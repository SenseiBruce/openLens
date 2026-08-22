FROM python:3.11-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    ffmpeg \
    git \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install PyTorch CPU first (largest dependency, rarely changes)
RUN pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu

# Copy submodules and requirements.txt to cache the heavy pip install step
COPY silero-vad/ /app/silero-vad/
COPY whisperX/ /app/whisperX/
COPY voicecut/requirements.txt /app/voicecut/

WORKDIR /app/voicecut

# Upgrade pip and install the requirements
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Now copy the rest of the fast-changing voicecut code
COPY voicecut/ /app/voicecut/

# Install the voicecut package itself
RUN pip install -e .

EXPOSE 8000

# Run the FastAPI app
CMD ["uvicorn", "voicecut.backend.api.main:app", "--host", "0.0.0.0", "--port", "8000"]
