FROM python:3.11-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    ffmpeg \
    git \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy the local submodules and main app
COPY silero-vad/ /app/silero-vad/
COPY whisperX/ /app/whisperX/
COPY voicecut/ /app/voicecut/

# Install the dependencies
WORKDIR /app/voicecut

# Install PyTorch CPU first to avoid heavy GPU layers if not available
RUN pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu

# Upgrade pip and install the requirements
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Install the voicecut package itself
RUN pip install -e .

EXPOSE 8000

# Run the FastAPI app
CMD ["uvicorn", "voicecut.backend.api.main:app", "--host", "0.0.0.0", "--port", "8000"]
