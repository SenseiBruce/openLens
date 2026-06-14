# OpenLens — AI-Powered Speech-Aware Video Editor

OpenLens is a full-stack application that automatically analyzes video, detects human speech, transcribes it, and identifies candidate cuts for non-dialogue gaps.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | FastAPI · SQLite · FFmpeg · Python 3.10+ |
| Frontend | React · TypeScript · TailwindCSS · WaveSurfer.js · Vite |
| AI / ML | Silero VAD · WhisperX · Auto-Editor |

---

## Repository Structure

```
OpenLens/
├── voicecut/          # Main application (backend + frontend)
│   ├── backend/       # FastAPI server, API routes, services
│   ├── web/           # React + TypeScript frontend (Vite)
│   ├── shared/        # Shared types and utilities
│   ├── tests/         # Test suite
│   ├── requirements.txt
│   ├── pyproject.toml
│   └── setup.sh       # One-shot environment setup script
├── silero-vad/        # Submodule — Voice Activity Detection
├── whisperX/          # Submodule — Transcription & word alignment
├── auto-editor/       # Submodule — Loudness-based cut fallback
└── docs/              # Documentation & runbooks
```

---

## Prerequisites

Make sure the following are installed on your system before cloning:

- **Python 3.10+** — `python3 --version`
- **Node.js 18+** — `node --version`
- **npm 9+** — `npm --version`
- **FFmpeg** — `ffmpeg -version`
  - macOS: `brew install ffmpeg`
  - Ubuntu: `sudo apt install ffmpeg`
  - Windows: [Download from ffmpeg.org](https://ffmpeg.org/download.html)
- **Git** with submodule support — `git --version`

---

## Installation

### 1. Clone with submodules

```bash
git clone --recurse-submodules https://github.com/SenseiBruce/openLens.git
cd openLens
```

> If you already cloned without `--recurse-submodules`, run:
> ```bash
> git submodule update --init --recursive
> ```

### 2. Run the setup script

```bash
cd voicecut
bash setup.sh
```

This will:
- Create a Python virtual environment at `voicecut/.venv`
- Install all backend Python dependencies
- Install `silero-vad` and `whisperX` as local editable packages
- Install frontend npm dependencies

---

## Running the Application

### Backend

```bash
cd voicecut
source .venv/bin/activate        # Windows: .venv\Scripts\activate
uvicorn voicecut.backend.api.main:app --reload
```

Backend runs at: **http://localhost:8000**  
API docs available at: **http://localhost:8000/docs**

### Frontend

In a separate terminal:

```bash
cd voicecut/web
npm run dev
```

Frontend runs at: **http://localhost:5173**

---

## Environment Variables

Create a `.env` file inside `voicecut/` if you need to override defaults:

```env
# Example — adjust as needed
DATABASE_URL=sqlite:///./voicecut.db
UPLOAD_DIR=./data/uploads
EXPORT_DIR=./data/exports
```

> The `data/uploads/` and `data/exports/` directories are created automatically at runtime and are excluded from version control.

---

## Running Tests

```bash
cd voicecut
source .venv/bin/activate
pytest tests/
```

---

## Updating Submodules

To pull the latest version of all submodules:

```bash
git submodule update --remote --merge
```

---

## Common Issues

| Issue | Fix |
|-------|-----|
| `ffmpeg: command not found` | Install FFmpeg (see Prerequisites) |
| `ModuleNotFoundError: whisperX` | Run `bash setup.sh` from `voicecut/` |
| `npm: command not found` | Install Node.js 18+ |
| Port 8000 already in use | `uvicorn ... --port 8001` |
| Port 5173 already in use | `npm run dev -- --port 5174` |
| Submodules empty after clone | Run `git submodule update --init --recursive` |

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit your changes: `git commit -m "feat: your feature"`
4. Push and open a Pull Request

---

## License

MIT
