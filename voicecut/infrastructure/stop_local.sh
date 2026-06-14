#!/bin/bash

# stop_local.sh
# Script to gracefully or forcefully stop both backend and frontend services.

echo "🛑 Stopping VoiceCut local services..."

# Find and kill process running on port 8000 (FastAPI backend)
BACKEND_PID=$(lsof -t -i:8000 || true)
if [ -n "$BACKEND_PID" ]; then
    echo "Killing FastAPI Backend (PID: $BACKEND_PID)..."
    kill -9 $BACKEND_PID
else
    echo "No process running on port 8000 (Backend)."
fi

# Find and kill process running on port 5173 (Vite frontend)
FRONTEND_PID=$(lsof -t -i:5173 || true)
if [ -n "$FRONTEND_PID" ]; then
    echo "Killing Vite Frontend (PID: $FRONTEND_PID)..."
    kill -9 $FRONTEND_PID
else
    echo "No process running on port 5173 (Frontend)."
fi

echo "✅ Done."
