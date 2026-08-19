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
├── docker-compose.yml # One-command sandbox (backend + frontend)
├── voicecut/          # Main application (backend + frontend)
│   ├── backend/       # FastAPI server, API routes, services
│   ├── web/           # React + TypeScript frontend (Vite)
│   ├── shared/        # Shared types and utilities
│   ├── tests/         # Automated test suite (no network / no model downloads)
│   ├── scripts/       # Manual checks (not run by pytest)
│   ├── requirements.txt
│   ├── requirements.lock
│   ├── .env.example
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
- **Docker** (optional, for the compose sandbox) — `docker --version`

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

### 2. Environment file

```bash
cp voicecut/.env.example voicecut/.env
```

Fill in LLM keys only if you want chapter / viral-clip generation. Analysis and export work without them.

### 3. Run the setup script

```bash
cd voicecut
bash setup.sh
```

This will:
- Create a Python virtual environment at `voicecut/.venv`
- Install pinned backend dependencies from `requirements.lock`
- Install `silero-vad` and `whisperX` as local editable packages (if submodules are present)
- Install frontend npm dependencies via `npm ci`

Manual equivalent from the repo root:

```bash
python3 -m venv voicecut/.venv
source voicecut/.venv/bin/activate
pip install -r voicecut/requirements.lock
pip install -e voicecut
cd voicecut/web && npm ci && cd ../..
```

---

## Docker (one command)

From the **repo root**:

```bash
docker compose up --build
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| FastAPI Backend | http://localhost:8000 |
| API Docs (Swagger) | http://localhost:8000/docs |
| Health | http://localhost:8000/health |

Stop with `Ctrl+C`, or `docker compose down`.

---

## Local Startup & Shutdown

### ▶ Start (Recommended — one command)

From the **repo root**, run the unified launch script:

```bash
./voicecut/infrastructure/launch_local.sh
```

This starts **both** services concurrently:

| Service | URL | Log file |
|---------|-----|----------|
| FastAPI Backend | http://localhost:8000 | `voicecut/voicecut_backend.log` |
| API Docs (Swagger) | http://localhost:8000/docs | — |
| React Frontend (Vite) | http://localhost:5173 | `voicecut/voicecut_frontend.log` |

Press **Ctrl+C** to gracefully shut down both services together.

---

### ■ Stop (if running in background)

If services are already running on their ports, kill them with:

```bash
./voicecut/infrastructure/stop_local.sh
```

This forcefully kills any process bound to ports `8000` and `5173`.

---

### ▶ Start Manually (two terminals)

If you prefer to run services separately:

**Terminal 1 — Backend:**
```bash
cd voicecut
source .venv/bin/activate        # Windows: .venv\Scripts\activate
uvicorn voicecut.backend.api.main:app --host 0.0.0.0 --port 8000 --reload
```

**Terminal 2 — Frontend:**
```bash
cd voicecut/web
npm run dev
```

---

### 📋 Monitoring Logs

Stream live logs in a separate terminal:

```bash
# Backend logs
tail -f voicecut/voicecut_backend.log

# Frontend logs
tail -f voicecut/voicecut_frontend.log
```

> **First analysis note:** On the first analysis (not during tests), the app will download AI model weights (Silero VAD, WhisperX) into `~/.cache/torch/hub/`. This may take a few minutes — ensure you have a stable internet connection. Automated tests never download models.

---

## Environment Variables

Copy `voicecut/.env.example` to `voicecut/.env`. Referenced variables:

```env
DATABASE_URL=sqlite:///./data/voicecut.db
UPLOAD_DIR=./data/uploads
EXPORT_DIR=./data/exports
GEMINI_API_KEY=your-gemini-api-key
OPENAI_API_KEY=your-openai-api-key
OPENROUTER_API_KEY=your-openrouter-api-key
API_TARGET=http://localhost:8000
```

> The `data/uploads/` and `data/exports/` directories are created automatically at runtime and are excluded from version control. Blank `DATABASE_URL` / `UPLOAD_DIR` / `EXPORT_DIR` fail startup with a validation error.

---

## Running Tests

From the **repo root** (same command CI runs):

```bash
source voicecut/.venv/bin/activate
pip install -r voicecut/requirements.lock
pytest voicecut/tests/ --maxfail=1
```

Coverage is enforced at 50% (`--cov=voicecut --cov-fail-under=50`). Tests mock WhisperX/Silero and set `HF_HUB_OFFLINE=1` so they run without GPU, torch cache, or internet.

Frontend:

```bash
cd voicecut/web
npm ci
npm test          # vitest
npm run build
npx eslint src
```

Python lint:

```bash
pip install -r voicecut/requirements.txt
ruff check voicecut/
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
| `ModuleNotFoundError: whisperX` | Run `bash setup.sh` from `voicecut/` after initializing submodules |
| `npm: command not found` | Install Node.js 18+ |
| Port 8000 already in use | `uvicorn ... --port 8001` |
| Port 5173 already in use | `npm run dev -- --port 5174` |
| Submodules empty after clone | Run `git submodule update --init --recursive` |

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit your changes with tests in the same commit: `git commit -m "feat: your feature"`
4. Push and open a Pull Request — CI runs pytest, ruff, eslint, and the frontend build on every PR

---

## License

MIT
