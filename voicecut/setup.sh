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

# 3. Install dependencies
echo "Installing backend dependencies (this will also install silero-vad and whisperX locally)..."
pip install -r requirements.txt

# 4. Install voicecut package in editable mode
echo "Installing voicecut package in editable mode..."
pip install -e .

# 5. Setup frontend
if [ ! -d "web" ]; then
    echo "Frontend web directory not found. Please scaffold it with Vite."
else
    echo "Installing frontend dependencies..."
    cd web
    npm install
    cd ..
fi

echo "Setup complete! To run the backend:"
echo "source .venv/bin/activate && uvicorn voicecut.backend.api.main:app --reload"
