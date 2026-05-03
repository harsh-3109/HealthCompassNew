import os
from dotenv import load_dotenv

# Load .env from one directory up (since it's in the root)
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
MODEL_NAME = "llama3-8b-8192"
