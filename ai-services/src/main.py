from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional

from .predictor import DiseasePredictor
from .nlp_engine import extract_symptoms   # ✅ correct import
from .rag_engine import rag_answer
from .web_search import web_answer

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all origins for easier deployment, restrict later if needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = DiseasePredictor()


class InputData(BaseModel):
    symptoms: Optional[List[str]] = None
    text: Optional[str] = None
    image: Optional[str] = None


@app.post("/predict")
def predict(data: InputData):
    try:
        # Pass the full data object to the predictor to handle text/symptoms AND image
        if data.text or data.symptoms or data.image:
            # We convert it to a dictionary so predictor can easily check fields
            return model.predict(data.model_dump())
        else:
            return {
                "message": "Provide symptoms, text, or an image scan"
            }

    except Exception as e:
        return {
            "message": f"API Error: {str(e)}"
        }

class ChatQuery(BaseModel):
    query: str
    image: Optional[str] = None

@app.post("/chat")
def chat_endpoint(data: ChatQuery):
    try:
        query_text = data.query
        
        # If image is uploaded in chat, analyze it first
        if data.image:
            from .vision_engine import analyze_image_with_groq
            vision_results = analyze_image_with_groq(data.image)
            
            # 🔥 Handle Vision Errors Gracefully
            if vision_results["scan_type"] == "Analysis Error":
                return {"response": f"⚠️ **Scan Analysis Failed**\n\nI couldn't process the uploaded scan. It might be too large or there was a system error.\n\n*Error details: {vision_results['findings']}*"}
                
            image_context = f"\n\n[System Note: User uploaded a {vision_results['scan_type']}. Findings: {vision_results['findings']}]"
            query_text += image_context

        answer = rag_answer(query_text)
        if "NOT_FOUND" in answer:
            answer = web_answer(query_text)
            
        return {"response": answer}
    except Exception as e:
        return {"response": f"Chat API Error: {str(e)}"}