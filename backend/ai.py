import os
import json
from groq import Groq
from dotenv import load_dotenv

# Load environment variables
load_dotenv(".env")

MODEL_NAME = "llama-3.1-8b-instant"

API_KEY = os.getenv("GROQ_API_KEY")
if not API_KEY:
    raise RuntimeError("GROQ_API_KEY not found in .env")



client = Groq(api_key=API_KEY)


def generate_ai_outputs(review, rating):
    
    prompt = f"""
You are an AI feedback assistant.

Analyze the review and return STRICT JSON only.

JSON format:
{{
  "user_response": "...",
  "summary": "...",
  "action": "..."
}}

Rating: {rating}
Review: {review}
"""

    response = client.chat.completions.create(
        model=MODEL_NAME,
        messages=[
            {"role": "system", "content": "Return ONLY valid JSON. No extra text."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.3
    )

    raw = response.choices[0].message.content.strip()

    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        # Safe fallback
        return {
            "user_response": "Thank you for your feedback!",
            "summary": "Could not generate summary",
            "action": "Review manually"
        }
