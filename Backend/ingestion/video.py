_EASYOCR_READER = None
"""Video parser using MoviePy for frames and Whisper for audio."""
from pathlib import Path
from loguru import logger
import cv2

from config import (
    FRAMES_DIR,
    MAX_VIDEO_DURATION_SEC,
    VIDEO_FRAME_RATE,
    MAX_KEYFRAMES,
    VIDEO_MAX_WIDTH,
    VIDEO_OCR_LANGS,
    VIDEO_OCR_USE_GPU,
    VIDEO_OCR_MIN_CONFIDENCE,
)
from ingestion.audio import parse_audio

def _get_easyocr_reader():
    """
    Load EasyOCR reader once and cache it.
    Respects VIDEO_OCR_LANGS and VIDEO_OCR_USE_GPU from config.
    """
    global _EASYOCR_READER
    if _EASYOCR_READER is None:
        try:
            import easyocr
            logger.info(
                f"Loading EasyOCR reader (langs={VIDEO_OCR_LANGS}, gpu={VIDEO_OCR_USE_GPU})"
            )
            _EASYOCR_READER = easyocr.Reader(VIDEO_OCR_LANGS, gpu=VIDEO_OCR_USE_GPU)
        except ImportError:
            logger.error("EasyOCR not installed")
            raise
    return _EASYOCR_READER


async def parse_video(file_path: Path, source_id: str) -> list[dict]:
    """
    Parse video files.

    - Extract audio → transcribe with Whisper
    - Extract keyframes at intervals
    - Run OCR on frames
    - Attach aligned audio transcript to frame windows
    """
    try:
        from moviepy import VideoFileClip
    except ImportError:
        try:
        # MoviePy v1.x fallback
            from moviepy.editor import VideoFileClip
        except Exception:
          logger.error("MoviePy not installed (or import path changed)")
          return []

    chunks = []

    try:
        logger.info(f"Processing video: {file_path}")
        clip = VideoFileClip(str(file_path))

        # Cap duration
        duration = min(clip.duration, MAX_VIDEO_DURATION_SEC)
        if clip.duration > MAX_VIDEO_DURATION_SEC:
            logger.warning(f"Video truncated: {clip.duration:.1f}s → {duration:.1f}s")

        # 1. Extract and transcribe audio (with timestamps)
        audio_chunks = await extract_and_transcribe_audio(clip, file_path, duration)
        chunks.extend(audio_chunks)

        # 2. Extract keyframes, with audio alignment per time window
        frame_chunks = await extract_keyframes(
            clip, file_path, source_id, duration, audio_chunks=audio_chunks
        )
        chunks.extend(frame_chunks)

        clip.close()

        logger.info(
            f"Video processed: {len(chunks)} chunks "
            f"({len(audio_chunks)} audio, {len(frame_chunks)} frame regions)"
        )
        return chunks

    except Exception as e:
        logger.error(f"Video processing failed: {e}")
        return []


async def extract_and_transcribe_audio(clip, file_path: Path, duration: float) -> list[dict]:
    """Extract audio track and transcribe."""
    import tempfile
    
    if clip.audio is None:
        logger.info("No audio track in video")
        return []
    
    try:
        # Export audio to temp file
        with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as f:
            temp_path = Path(f.name)
        
        # Only process up to duration limit
        audio = clip.audio
        if hasattr(audio, "subclipped"):
            audio_clip = audio.subclipped(0, duration)
        elif hasattr(audio, "subclip"):
            audio_clip = audio.subclip(0, duration)
        else:
            raise RuntimeError("MoviePy audio clip has no subclip/subclipped method")
        try:
            audio_clip.write_audiofile(
                str(temp_path),
                fps=16000,
                logger=None,
            )
        except TypeError:
            # MoviePy v1 fallback
            audio_clip.write_audiofile(
                str(temp_path),
                fps=16000,
                verbose=False,
                logger=None,
            )    
        
        # Transcribe
        chunks = await parse_audio(temp_path)
        
        # Update modality
        for chunk in chunks:
            chunk["modality"] = "audio_transcript"
        
        # Clean up
        temp_path.unlink(missing_ok=True)
        
        return chunks
        
    except Exception as e:
        logger.error(f"Audio extraction failed: {e}")
        return []


def _collect_audio_text_for_window(
    audio_chunks: list[dict] | None, start: float, end: float
) -> str:
    """
    Collect audio transcript text that overlaps the given [start, end] time window.
    """
    if not audio_chunks:
        return ""

    texts = []
    for c in audio_chunks:
        a_start = float(c.get("timestamp_start") or 0.0)
        a_end = float(c.get("timestamp_end") or a_start)
        if a_end >= start and a_start <= end:
            t = c.get("text_content")
            if t:
                texts.append(t.strip())

    return " ".join(texts)        


async def extract_keyframes(
    clip,
    file_path: Path,
    source_id: str,
    duration: float,
    audio_chunks: list[dict] | None = None,
) -> list[dict]:
    """Extract keyframes at regular intervals and attach OCR + aligned audio text."""
    from PIL import Image
    import numpy as np

    chunks = []

    # Calculate frame times
    interval = 1 / VIDEO_FRAME_RATE  # e.g., 2 seconds
    frame_times = []
    t = 0.0
    while t < duration and len(frame_times) < MAX_KEYFRAMES:
        frame_times.append(t)
        t += interval

    logger.info(f"Extracting {len(frame_times)} frames")

    for i, t in enumerate(frame_times):
        try:
            # Get frame at time t
            frame = clip.get_frame(t)  # numpy array (H, W, C)

            # Resize if needed
            h, w = frame.shape[:2]
            if w > VIDEO_MAX_WIDTH:
                scale = VIDEO_MAX_WIDTH / w
                new_w = int(w * scale)
                new_h = int(h * scale)
                frame = cv2.resize(frame, (new_w, new_h))
                h, w = new_h, new_w  # update to resized dims

            # Convert to PIL for saving
            from PIL import Image  # already imported above, but safe
            pil_image = Image.fromarray(frame.astype(np.uint8))

            # Save frame
            frame_filename = f"{source_id}_frame_{i:03d}.jpg"
            frame_path = FRAMES_DIR / frame_filename
            pil_image.save(frame_path, quality=85)

            # Run OCR on frame → returns multiple regions with bbox + confidence
            ocr_regions = await run_frame_ocr(frame_path, width=w, height=h)

            # Collect audio transcript overlapping this frame window
            window_start = t
            window_end = t + interval
            audio_text = _collect_audio_text_for_window(
                audio_chunks, window_start, window_end
            )

            # If no OCR regions, still create a visual-only chunk with audio text (if any)
            if not ocr_regions:
                combined_text = audio_text.strip()
                chunk = {
                    "image_path": str(frame_path),
                    "modality": "video_frame",
                    "timestamp_start": window_start,
                    "timestamp_end": window_end,
                }
                if combined_text:
                    chunk["text_content"] = combined_text
                chunks.append(chunk)
                continue

            # Create a chunk per OCR region, with bbox + confidence + (optional) audio text
            for region in ocr_regions:
                region_text = region.get("text", "").strip()
                if not region_text:
                    continue

                combined_text_parts = []
                if audio_text:
                    combined_text_parts.append(audio_text.strip())
                combined_text_parts.append(region_text)
                combined_text = " ".join(combined_text_parts).strip()

                chunk = {
                    "image_path": str(frame_path),
                    "modality": "video_frame",
                    "timestamp_start": window_start,
                    "timestamp_end": window_end,
                    "bbox": region.get("bbox"),
                    "ocr_confidence": region.get("confidence"),
                }

                if combined_text:
                    chunk["text_content"] = combined_text

                chunks.append(chunk)

        except Exception as e:
            logger.warning(f"Failed to extract frame at {t}s: {e}")
            continue

    return chunks


async def run_frame_ocr(frame_path: Path, width: int, height: int) -> list[dict]:
    """
    Run OCR on a video frame and return region-level results with
    normalized bounding boxes and confidence.
    """
    try:
        reader = _get_easyocr_reader()
        results = reader.readtext(str(frame_path))

        ocr_results: list[dict] = []
        for bbox, text, confidence in results:
            text = (text or "").strip()
            if not text:
                continue

            conf = float(confidence or 0.0)
            if conf < VIDEO_OCR_MIN_CONFIDENCE:
                continue

            # bbox from EasyOCR: list of 4 points [[x1,y1], [x2,y1], [x2,y2], [x1,y2]]
            x_coords = [p[0] for p in bbox]
            y_coords = [p[1] for p in bbox]

            normalized_bbox = [
                min(x_coords) / float(width),
                min(y_coords) / float(height),
                max(x_coords) / float(width),
                max(y_coords) / float(height),
            ]

            ocr_results.append(
                {
                    "bbox": normalized_bbox,
                    "text": text,
                    "confidence": conf,
                }
            )

        return ocr_results

    except ImportError:
        logger.warning("EasyOCR not installed, skipping frame OCR")
        return []
    except Exception as e:
        logger.warning(f"Frame OCR failed: {e}")
        return []
