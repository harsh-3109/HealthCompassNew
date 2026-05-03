from duckduckgo_search import DDGS
from .rag_engine import ask_llm

def web_answer(query):
    try:
        results = []
        try:
            with DDGS() as ddgs:
                results = [r["body"] for r in ddgs.text(query + " medical symptoms disease", max_results=5)]
        except Exception:
            pass # DDGS can sometimes ratelimit or crash, ignore and fallback to base knowledge

        context = "\n".join(results) if results else "No internet data could be fetched."

        prompt = f"""
You are an expert AI medical assistant for HealthCompass. Since the disease wasn't found in the local knowledge base, please answer based on the following web results, or your base knowledge if web results are unavailable:

{context}

User Symptoms: {query}

Rule:
- Format it nicely with possible diseases.
- State clearly that this is based on a generic web search or base knowledge.
- Mention they should consult a doctor.
"""
        return ask_llm(prompt)
    except Exception as e:
        return f"Internet search error: {str(e)}"
