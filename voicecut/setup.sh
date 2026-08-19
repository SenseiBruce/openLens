#!/bin/bash
set -e

echo "Setting up VoiceCut Environment..."

# Ensure we're in the voicecut directory
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR"

# 1. Create virtual environment
if [ ! -d ".venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv .venv
fi

source .venv/bin/activate

# 2. Upgrade pip
pip install --upgrade pip

# 3. Install pinned backend dependencies (reproducible)
echo "Installing backend dependencies from lockfile..."
if [ -f requirements.lock ]; then
    pip install -r requirements.lock
else
    pip install -r requirements.txt
fi

# 4. Install voicecut package in editable mode
echo "Installing voicecut package in editable mode..."
pip install -e .

# 5. Optional local ML packages (silero-vad, whisperX) — needed for analysis, not tests
if [ -f ../silero-vad/pyproject.toml ] || [ -f ../silero-vad/setup.py ]; then
    echo "Installing local ML packages..."
    pip install -r requirements-ml.txt
else
    echo "Warning: silero-vad/whisperX submodules not found. Analysis pipeline will be unavailable."
    echo "Run from the repo root: git submodule update --init --recursive"
fi

# 6. Setup frontend
if [ ! -d "web" ]; then
    echo "Frontend web directory not found. Please scaffold it with Vite."
else
    echo "Installing frontend dependencies..."
    cd web
    if [ -f package-lock.json ]; then
        npm ci
    else
        npm install
    fi
    cd ..
fi

echo "Setup complete."
echo "Backend:  source .venv/bin/activate && uvicorn voicecut.backend.api.main:app --reload"
echo "Tests:    pytest tests/     (from voicecut/)  or  pytest voicecut/tests/  (from repo root)"
echo "Frontend: cd web && npm run dev"
