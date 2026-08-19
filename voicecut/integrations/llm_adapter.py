import os
import json
import logging
from litellm import completion
from pydantic import BaseModel
from typing import List, Optional
from voicecut.shared.models import Chapter, TranscriptSegment

logger = logging.getLogger(__name__)

class LLMAdapter:
    def __init__(self, model_name: str = "gemini/gemini-2.5-flash", api_key: Optional[str] = None):
        self.model_name = model_name
        # Fallback to general API key environment variable or GEMINI_API_KEY
        if api_key:
            self.api_key = api_key
        else:
            from voicecut.backend.config import get_settings
            cfg = get_settings()
            self.api_key = (
                cfg.openrouter_api_key
                or cfg.gemini_api_key
                or cfg.openai_api_key
                or os.environ.get("OPENROUTER_API_KEY")
                or os.environ.get("GEMINI_API_KEY")
                or os.environ.get("OPENAI_API_KEY")
            )

    def generate_chapters(self, transcript_segments: List[TranscriptSegment]) -> List[Chapter]:
        if not self.api_key:
            logger.warning("API key is not set. Cannot generate chapters.")
            return []

        if not transcript_segments:
            return []

        # Prepare the transcript text with timestamps
        transcript_text = ""
        for seg in transcript_segments:
            transcript_text += f"[{seg.start:.2f} - {seg.end:.2f}]: {seg.text}\n"

        prompt = f"""
You are an expert video editor and summarizer. Please analyze the following video transcript and divide it into logical chapters. 
Each chapter should cover a distinct topic or segment of the video.
For each chapter, provide:
1. title: A concise and catchy title.
2. summary: A short 1-2 sentence summary.
3. start_time: The start time in seconds (matching the transcript).
4. end_time: The end time in seconds (matching the transcript).

Respond strictly in valid JSON format as a list of objects. Do not include markdown formatting or backticks.
Example:
[
  {{"title": "Introduction", "summary": "The speaker introduces the topic.", "start_time": 0.0, "end_time": 15.5}}
]

Transcript:
{transcript_text}
"""
        try:
            response = completion(
                model=self.model_name,
                messages=[{"role": "user", "content": prompt}],
                api_key=self.api_key
            )
            content = response.choices[0].message.content.strip()
            
            # Clean up markdown if present
            if content.startswith("```json"):
                content = content[7:-3]
            elif content.startswith("```"):
                content = content[3:-3]
                
            data = json.loads(content)
            
            chapters = []
            for item in data:
                chapters.append(Chapter(
                    start=float(item.get("start_time", 0.0)),
                    end=float(item.get("end_time", 0.0)),
                    title=item.get("title", "Untitled"),
                    summary=item.get("summary", "")
                ))
            return chapters
        except Exception as e:
            logger.error(f"Error generating chapters: {e}")
            return []
