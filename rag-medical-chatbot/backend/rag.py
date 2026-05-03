import os
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain.embeddings import HuggingFaceEmbeddings
from groq import Groq
from config import GROQ_API_KEY

# Load PDF with a fallback if it doesn't exist yet
pdf_path = os.path.join(os.path.dirname(__file__), "data", "PDFBIO.EL28.pdf")
docs = []

if os.path.exists(pdf_path):
    loader = PyPDFLoader(pdf_path)
    docs = loader.load()
else:
    print(f"Warning: PDF not found at {pdf_path}. Please place it there.")

# Split
splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=100)
chunks = splitter.split_documents(docs) if docs else []

# Embeddings
embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

# Vector DB
if chunks:
    db = FAISS.from_documents(chunks, embeddings)
    retriever = db.as_retriever(search_kwargs={"k": 3})
else:
    retriever = None
    print("Warning: No documents to embed. RAG will fallback to web search.")

# Groq Client
client = Groq(api_key=GROQ_API_KEY) if GROQ_API_KEY and GROQ_API_KEY != "your_groq_api_key_here" else None

def ask_llm(prompt):
    if not client:
        return "Error: GROQ_API_KEY is not set or valid in .env"
    
    chat = client.chat.completions.create(
        messages=[{"role": "user", "content": prompt}],
        model="llama3-8b-8192"
    )
    return chat.choices[0].message.content

def rag_answer(query):
    if not retriever:
        return "NOT_FOUND"

    docs = retriever.get_relevant_documents(query)

    if not docs:
        return "NOT_FOUND"

    context = "\n".join([d.page_content for d in docs])

    prompt = f"""
You are a medical assistant.

Given symptoms, suggest possible diseases.

Rules:
- Only use context
- Give top 2-3 diseases
- Explain symptom match
- If unsure → NOT_FOUND

Symptoms:
{query}

Context:
{context}
"""

    return ask_llm(prompt)
