# RAG Medical Chatbot

Symptom-based chatbot using:
- PDF Knowledge Base
- Groq LLM
- FAISS Vector DB
- Web fallback

## Environment Setup
Create a `.env` file in this directory and add your Groq API key:
```
GROQ_API_KEY=your_groq_api_key_here
```

## Knowledge Base
Place your target PDF file inside `backend/data/` and name it `PDFBIO.EL28.pdf`.

## Features
- Symptom → Disease matching
- RAG pipeline
- Internet fallback
- Fast API backend

## Run (Windows)
Double click `setup.bat` or run:
```cmd
setup.bat
```

## Run (Mac/Linux)
```bash
bash setup.sh
```

## Web UI
Once the server is running, just open `frontend/index.html` in your browser.
