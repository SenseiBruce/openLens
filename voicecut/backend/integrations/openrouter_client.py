import json
import logging
from openai import AsyncOpenAI

logger = logging.getLogger(__name__)

class OpenRouterClient:
    def __init__(self, api_key: str):
        self.client = AsyncOpenAI(
            base_url="https://openrouter.ai/api/v1",
            api_key=api_key,
            default_headers={
                "Authorization": f"Bearer {api_key}",
                "HTTP-Referer": "http://localhost:5173",
                "X-Title": "VoiceCut"
            }
        )

    async def extract_viral_clips(self, transcript_text: str, target_length_seconds: int) -> list[dict]:
        """
        Uses an LLM via OpenRouter to identify viral clips from a transcript.
        Returns a list of dictionaries with 'start', 'end', 'title', 'explanation', 'score'.
        """
        prompt = f"""
You are an expert video editor and social media strategist. 
Analyze the following transcript and identify the best, most engaging "viral" clips that are approximately {target_length_seconds} seconds long.
A viral clip should have a strong hook, a coherent thought, and high emotional or informational value.

The transcript contains timestamps in brackets like [12.3s - 15.6s].
Return a JSON array of objects, where each object has:
- start (float): the exact start time in seconds (e.g. 12.3)
- end (float): the exact end time in seconds (e.g. 45.6)
- title (string): a catchy title for the clip
- explanation (string): why this clip is viral
- score (float): a score out of 10 for its viral potential

Return ONLY valid JSON. No markdown formatting.

Transcript:
{transcript_text}
"""
        
        # Using a reliable free model
        model = "google/gemma-4-31b-it:free"
        
        try:
            response = await self.client.chat.completions.create(
                model=model,
                messages=[
                    {"role": "system", "content": "You are a helpful assistant that only returns JSON arrays."},
                    {"role": "user", "content": prompt}
                ]
            )
            content = response.choices[0].message.content
            # Strip potential markdown formatting
            if content.startswith("```json"):
                content = content[7:-3]
            elif content.startswith("```"):
                content = content[3:-3]
            
            data = json.loads(content.strip())
            
            # Handle case where the response is wrapped in an object e.g. {"clips": [...]}
            if isinstance(data, dict):
                # find the first list in the dict values
                for v in data.values():
                    if isinstance(v, list):
                        return v
                # If no list found, maybe the dict itself represents one clip
                if "start" in data and "end" in data:
                    return [data]
                return []
            elif isinstance(data, list):
                return data
            else:
                return []
        except Exception as e:
            err_msg = str(e).encode('ascii', 'ignore').decode('ascii')
            logger.error(f"Failed to extract viral clips via OpenRouter: {err_msg}")
            raise Exception(err_msg)
