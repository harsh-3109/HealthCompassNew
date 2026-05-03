import os
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import HuggingFaceEmbeddings
from groq import Groq
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

pdf_path = os.path.join(os.path.dirname(__file__), "..", "data", "PDFBIO.EL28.pdf")
docs = []

if os.path.exists(pdf_path):
    loader = PyPDFLoader(pdf_path)
    docs = loader.load()
else:
    print(f"Warning: PDF not found at {pdf_path}. RAG fallback to Web Only.")

splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=100)
chunks = splitter.split_documents(docs) if docs else []

embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

if chunks:
    db = FAISS.from_documents(chunks, embeddings)
    retriever = db.as_retriever(search_kwargs={"k": 3})
else:
    retriever = None

client = Groq(api_key=GROQ_API_KEY) if GROQ_API_KEY else None

def ask_llm(prompt):
    if not client:
        return "GROQ API KEY IS NOT SET. (Error: Missing API key in .env or invalid key)"
    try:
        chat = client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="llama-3.1-8b-instant"
        )
        return chat.choices[0].message.content
    except Exception as e:
        return f"Groq Error: {str(e)}"

def rag_answer(query):
    if not retriever:
        return "NOT_FOUND"

    try:
        docs = retriever.invoke(query)
    except AttributeError:
        docs = retriever.get_relevant_documents(query)

    if not docs:
        return "NOT_FOUND"

    context = "\n".join([d.page_content for d in docs])

    prompt = f"""
You are an expert clinical AI medical assistant for the HealthCompass app.

You MUST output ONLY a valid JSON object matching the exact structure below. Do NOT output any markdown, explanations, conversational text, or wrapping tags outside of the JSON. If no conditions match, return an empty diseases array.

REQUIRED JSON STRUCTURE:
{{
  "symptoms": ["Fever", "Headache"],
  "diseases": [
    {{
      "name": "Dengue",
      "confidence": 78,
      "precautions": ["Drink plenty of fluids", "Rest in a cool room", "Avoid aspirin"],
      "risk": "high",
      "explanation": "Dengue is a viral infection usually spread by mosquitoes. It causes the sudden high fever and severe joint pain you are experiencing. While it can make you feel very tired, most people recover well with proper rest and hydration."
    }}
  ],
  "recommendations": ["Stay hydrated", "Take rest", "Consult doctor if symptoms persist"]
}}

RULES:
1. "symptoms" array must contain extracted symptoms from the user's query.
2. "diseases" array must contain the top 1-3 matched conditions based on the context.
3. For each disease, "confidence" must be an integer between 0 and 100.
4. For each disease, "precautions" must be a short array of specific steps or care tips to help recover from this specific condition.
5. For each disease, "risk" must be exactly "high", "medium", or "low".
6. For each disease, "explanation" must be a simple, easy-to-understand paragraph (2-3 sentences) explaining what the condition is and how it relates to their symptoms. Use plain language with NO medical jargon.
7. "recommendations" must be a short array of actionable advice strings.

User Query/Symptoms:
{query}

Context:
{context}
"""

    return ask_llm(prompt)
