# Chakravyuh

**Multimodal RAG with Universal Evidence Citing**

A RAG system that handles ambiguity, adapts retrieval, and acknowledges uncertainty.

## Features

- **Multimodal Ingestion**: Supports PDF, DOCX, Markdown, Images, Audio, and Video.
- **Cross-Modal Retrieval**: Search across all indexed modalities.
- **Universal Citations**: Every answer is grounded in specific evidence with timestamps and location data.
- **Conflict Detection**: LLM-based contradiction identification between sources.
- **Hallucination Guard**: Refuses to answer when confidence is below the threshold.
- **Obsidian Export**: Export conversations to Obsidian with linked notes.

## Quick Start

### 1. Prerequisites

- **Python 3.10+** (for Backend)
- **Node.js 16+ & npm** (for Frontend)
- **FFmpeg** (for audio/video processing)
- **OpenRouter API Key** (for LLM inference)

### 2. Install FFmpeg

**Windows:**
```powershell
choco install ffmpeg
# or download from https://ffmpeg.org/download.html
# Ensure ffmpeg is in your system PATH
```

**macOS:**
```bash
brew install ffmpeg
```

**Linux:**
```bash
sudo apt install ffmpeg
```

### 3. Setup

#### Backend

1. Navigate to the Backend directory:
   ```bash
   cd Backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   ```

3. Activate the virtual environment:
   - **Windows:** `venv\Scripts\activate`
   - **Linux/macOS:** `source venv/bin/activate`

4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

5. Configure environment variables:
   - Create a `.env` file in the `Backend` directory.
   - Add your OpenRouter API Key and other settings (see [Configuration](#configuration)).

   ```env
   OPENROUTER_API_KEY=sk-or-v1-...
   ```

#### Frontend

1. Navigate to the Frontend directory:
   ```bash
   cd Frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### 4. Run

#### Start Backend
From the `Backend` directory:
```bash
uvicorn main:app --reload --port 8000
```
The API will be available at `http://localhost:8000`.

#### Start Frontend
From the `Frontend` directory:
```bash
npm run dev
```
The application will be available at `http://localhost:3000`.

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check and status |
| `/ingest` | POST | Upload and index a file (Docs, Images, A/V) |
| `/query` | POST | Query the knowledge base |
| `/evidence/{chunk_id}` | GET | Get raw evidence content |
| `/export/obsidian` | POST | Export conversation to Obsidian |

## Supported File Types

| Type | Extensions |
|------|------------|
| Documents | `.pdf`, `.docx`, `.pptx`, `.md`, `.txt`, `.html` |
| Images | `.jpg`, `.jpeg`, `.png`, `.webp`, `.gif` |
| Audio | `.mp3`, `.wav`, `.m4a`, `.flac`, `.ogg` |
| Video | `.mp4`, `.mkv`, `.avi`, `.mov`, `.webm` |

## Configuration

Environment variables for `Backend/.env`:

| Variable | Default | Description |
|----------|---------|-------------|
| `OPENROUTER_API_KEY` | - | **Required**. Get from openrouter.ai |
| `PRIMARY_MODEL` | anthropic/claude-3.5-sonnet | Main LLM for generating answers |
| `FAST_MODEL` | openai/gpt-4o-mini | Faster model for conflict detection |
| `MAX_VIDEO_SIZE_MB` | 100 | Max video file size in MB |
| `MAX_VIDEO_DURATION_SEC` | 600 | Max video length in seconds |
| `DATA_DIR` | ./data | Directory for storing uploaded files |
| `FRAMES_DIR` | ./frames | Directory for extracted video frames |

## Architecture

1. **Ingest**: specific parsers process files (PDF, Video, etc.) into chunks.
2. **LanceDB**: Vector database stores embeddings for semantic search.
3. **Retrieval**: Two-layer retrieval (Vector Similarity + Modality Reranking).
4. **Reasoning**:
   - Calculates uncertainty/confidence.
   - Detects conflicts between sources.
   - Guardrails check if the question can be answered.
5. **Generation**: LLM generates answer with specific citations.

## Uncertainty Calculation

Confidence score is derived from:
- **Embedding Similarity** (35%)
- **OCR/ASR Confidence** (20%)
- **Modality Agreement** (25%)
- **Source Count** (20%)

**Thresholds:**
- **< 0.4**: Refuse to answer (Not enough evidence).
- **0.4 - 0.6**: Low confidence warning.
- **> 0.6**: High confidence.