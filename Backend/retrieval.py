"""Retrieval with two-layer ranking.

Layer 1: Vector similarity search (find candidates)
Layer 2: Modality + confidence aware re-ranking

Modality Reliability Hierarchy:
1. document (PDF text) - highest reliability
2. ocr (EasyOCR with confidence)
3. audio_transcript (Whisper ASR)
4. image_description (LLM-generated)
5. video_frame (frame OCR/caption)
"""
from typing import Optional
from db import get_db
from embedder import get_embedder
from loguru import logger


# Modality reliability weights (higher = more trustworthy)
MODALITY_WEIGHTS = {
    "document": 1.0,      # PDF/DOCX text extraction
    "text": 1.0,          # Plain text
    "markdown": 0.95,     # Markdown
    "image_description": 1.0,  # LLM-generated caption - High trust for image queries
    "ocr": 0.6,           # EasyOCR - Good for text, but often fragmented
    "audio_transcript": 0.75,  
    "video_frame": 0.4,   
    "unknown": 0.3,
}


def get_modality_weight(modality: str) -> float:
    """Get base reliability weight for a modality."""
    return MODALITY_WEIGHTS.get(modality, 0.3)


def calculate_final_score(
    result: dict,
    vector_similarity: float,
    vector_weight: float = 0.5,
    modality_weight: float = 0.3,
    confidence_weight: float = 0.2,
) -> float:
    """
    Calculate final score with multi-factor ranking.
    
    final_score = 
        vector_weight * similarity +
        modality_weight * modality_reliability +
        confidence_weight * extraction_confidence
    
    Args:
        result: Search result with modality, confidence scores
        vector_similarity: Raw vector similarity [0, 1]
        vector_weight: Weight for vector similarity
        modality_weight: Weight for modality reliability
        confidence_weight: Weight for OCR/ASR confidence
    
    Returns:
        Final score [0, 1]
    """
    # 1. Vector similarity component
    sim_score = vector_similarity * vector_weight
    
    # 2. Modality reliability component
    modality = result.get("modality", "unknown")
    mod_score = get_modality_weight(modality) * modality_weight
    
    # 3. Extraction confidence component
    # Use OCR confidence if available, else ASR, else assume 1.0 for clean text
    ocr_conf = result.get("ocr_confidence")
    asr_conf = result.get("asr_confidence")
    
    if ocr_conf is not None:
        conf = ocr_conf
    elif asr_conf is not None:
        conf = asr_conf
    else:
        # No OCR/ASR = clean text extraction, assume high confidence
        conf = 1.0
    
    conf_score = conf * confidence_weight
    
    # 4. Combined score
    final = sim_score + mod_score + conf_score
    
    return min(1.0, final)


def rerank_results(
    results: list[dict],
    limit: int = 5,
) -> list[dict]:
    """
    Re-rank search results by combined score.
    
    Layer 2: Modality + confidence aware re-ranking.
    """
    if not results:
        return []
    
    # Calculate final scores
    for r in results:
        vector_sim = r.get("similarity", 0.5)
        r["final_score"] = calculate_final_score(r, vector_sim)
        
        # Log for debugging
        logger.debug(
            f"Rerank: {r.get('modality')} | "
            f"sim={vector_sim:.3f} | "
            f"final={r['final_score']:.3f}"
        )
    
    # Sort by final score (descending)
    results.sort(key=lambda x: x.get("final_score", 0), reverse=True)
    
    return results[:limit]


def retrieve(
    query: str,
    limit: int = 5,
    modalities: Optional[list[str]] = None,
    rerank: bool = True,
) -> list[dict]:
    """
    Two-layer retrieval with optional re-ranking.
    
    Layer 1: Vector similarity search (retrieves 2x limit for re-ranking)
    Layer 2: Modality + confidence re-ranking (if enabled)
    
    Args:
        query: Search query text
        limit: Maximum number of final results
        modalities: Filter by modality types
        rerank: Whether to apply layer 2 re-ranking
    
    Returns:
        List of evidence chunks with final scores
    """
    db = get_db()
    embedder = get_embedder()
    
    # Embed query
    query_embedding = embedder.embed_text(query)
    
    if not query_embedding:
        return []
    
    # Layer 1: Vector search (get more candidates for re-ranking)
    search_limit = limit * 2 if rerank else limit
    results = db.search(
        query_embedding, 
        limit=search_limit, 
        modalities=modalities
    )
    
    if not results:
        return []
    
    # Layer 2: Re-rank by modality + confidence
    if rerank:
        results = rerank_results(results, limit=limit)
        logger.info(f"Re-ranked {len(results)} results by modality + confidence")
    
    # --- Lazy Cleanup: Check if source files exist ---
    from config import DATA_DIR
    from pathlib import Path
    
    valid_results = []
    checked_sources = {}  # source_id -> exists (bool)
    
    for r in results:
        source_id = r.get("source_id")
        if not source_id:
            valid_results.append(r)
            continue
            
        if source_id not in checked_sources:
            # Check if any file starts with source_id in DATA_DIR
            # Ingest saves files as {source_id}.{ext}
            found = False
            try:
                # fast glob check
                if any(DATA_DIR.glob(f"{source_id}.*")):
                    found = True
            except Exception as e:
                logger.error(f"Error checking file existence for {source_id}: {e}")
                found = True # fail safe, keep it
            
            checked_sources[source_id] = found
            
            if not found:
                logger.warning(f"Source file for {source_id} missing. Deleting from DB.")
                # Fire and forget delete (or await if async, but this is sync context currently)
                # LanceDB delete is sync
                try:
                    db.delete_source(source_id)
                except Exception as e:
                    logger.error(f"Failed to delete orphan source {source_id}: {e}")

        if checked_sources[source_id]:
            valid_results.append(r)
            
    results = valid_results
    
    if not results:
        return []
    # -------------------------------------------------

    return results


def retrieve_by_source(source_id: str) -> list[dict]:
    """Get all chunks from a specific source."""
    db = get_db()
    return db.get_by_source(source_id)


def retrieve_by_modality(modality: str, limit: int = 20) -> list[dict]:
    """Get chunks of a specific modality."""
    db = get_db()
    
    if db.table is None:
        return []
    
    # Sanitize modality to prevent injection
    safe_modality = modality.replace("'", "''")
    
    try:
        results = db.table.search().where(f"modality = '{safe_modality}'").limit(limit).to_list()
        return results
    except Exception:
        return []
