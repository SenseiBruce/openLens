FROM python:3.11-slim

RUN apt-get update \
    && apt-get install -y --no-install-recommends ffmpeg \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY voicecut/requirements.lock voicecut/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.lock

COPY voicecut /app/voicecut

ENV PYTHONPATH=/app
ENV DATABASE_URL=sqlite:////app/data/voicecut.db
ENV UPLOAD_DIR=/app/data/uploads
ENV EXPORT_DIR=/app/data/exports

EXPOSE 8000

CMD ["uvicorn", "voicecut.backend.api.main:app", "--host", "0.0.0.0", "--port", "8000"]
