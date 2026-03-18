import os
from google.genai import Client
from google.genai import types

client = Client(api_key=os.getenv("GEMINI_API_KEY"))


async def generate_summary(text: str) -> str:
    if not text or len(text.strip()) < 10:
        return "Insufficient text for analysis."

    try:
        prompt = f"""
        Analyze the following document.
        If it is a contract, identify clauses and risks.
        Use a professional tone and format with Markdown. 
        Provide a structured summary including:
        
        1. Document Type
        2. Involved Parties
        3. Key Clauses
        4. Potential Risks
        
        Respond in English.

        TEXT:
        {text[:20000]}
        """

        response = client.models.generate_content(
            model="gemini-3-flash-preview",
            contents=prompt,
            config=types.GenerateContentConfig(
                temperature=0.3,
            ),
        )
        return response.text
    except Exception as e:
        return f"AI Error: {str(e)}"
