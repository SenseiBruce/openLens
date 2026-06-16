#!/bin/bash

# launch_local.sh
# Script to launch both the FastAPI backend and Vite frontend concurrently, or via Docker.

set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$(dirname "$DIR")"

echo "🚀 Launching VoiceCut Environment..."

cd "$PROJECT_ROOT"

# Check for --docker flag
USE_DOCKER=false
for arg in "$@"; do
    if [ "$arg" == "--docker" ]; then
        USE_DOCKER=true
    fi
done

if [ "$USE_DOCKER" = true ]; then
    echo "🐳 Launching via Docker Compose..."
    docker-compose up --build
    exit 0
fi

if [ ! -d ".venv" ]; then
    echo "❌ Error: Virtual environment not found. Please run setup.sh first."
    exit 1
fi

# Function to handle cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Shutting down services..."
    kill $BACKEND_PID 2>/dev/null || true
    kill $FRONTEND_PID 2>/dev/null || true
    exit 0
}
trap cleanup SIGINT SIGTERM

# 1. Start FastAPI Backend in background
echo "⚡ Starting FastAPI Backend on port 8000 (Logging to voicecut_backend.log)..."
source .venv/bin/activate
uvicorn voicecut.backend.api.main:app --host 0.0.0.0 --port 8000 --reload 2>&1 | tee voicecut_backend.log &
BACKEND_PID=$!

# Wait briefly
sleep 2

# 2. Start Vite Frontend in background
echo "🌐 Starting React Frontend on port 5173 (Logging to voicecut_frontend.log)..."
cd web
npm run dev 2>&1 | tee ../voicecut_frontend.log &
FRONTEND_PID=$!

echo ""
echo "✅ VoiceCut is now running!"
echo "   Backend API: http://localhost:8000/docs"
echo "   Frontend UI: http://localhost:5173"
echo "   Logs:"
echo "     - Backend: tail -f voicecut_backend.log"
echo "     - Frontend: tail -f voicecut_frontend.log"
echo ""
echo "Press Ctrl+C to shut down both services gracefully."

# Wait for background processes to finish (or until interrupted)
wait $BACKEND_PID $FRONTEND_PID


