from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from rag import rag_answer
from web_search import web_answer

app = FastAPI()

# Add CORS middleware because the frontend will call this API from a different origin (e.g. running from VSCode Live Server)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "RAG Medical Chatbot Running"}

@app.get("/chat")
def chat(query: str):
    answer = rag_answer(query)

    if "NOT_FOUND" in answer:
        answer = web_answer(query)

    return {
        "response": answer + "\n\n⚠️ This is not a medical diagnosis. Consult a doctor."
    }
