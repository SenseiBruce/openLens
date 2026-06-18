#!/bin/bash
echo "Waiting for backend to be ready..."
for i in {1..30}; do
  if curl -s http://localhost:8000/docs > /dev/null; then
    echo "Backend is up!"
    break
  fi
  sleep 2
done

echo "Creating project..."
project_id=$(curl -s -X POST http://localhost:8000/projects/ | jq -r '.id')
echo "Project ID: $project_id"

echo "Uploading video..."
# We use the existing video in data/uploads/2a3d9cd8-462c-4e3c-b457-9d22cc038304/video.mp4
curl -X POST -F "file=@data/uploads/2a3d9cd8-462c-4e3c-b457-9d22cc038304/video.mp4" "http://localhost:8000/upload/$project_id"

echo -e "\nStarting analysis with Hinglish setting..."
curl -s -N "http://localhost:8000/analyze/$project_id?language=hinglish&whisper_model=small" | grep -A 2 'event: '
