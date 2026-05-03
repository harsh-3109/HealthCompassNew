from duckduckgo_search import DDGS
from rag import ask_llm

def web_answer(query):
    try:
        with DDGS() as ddgs:
            results = [r["body"] for r in ddgs.text(query, max_results=5)]

        if not results:
            return "No internet results found either."

        context = "\n".join(results)

        prompt = f"""
Answer based on web results:

{context}

Question: {query}
"""

        return ask_llm(prompt)
    except Exception as e:
        return f"Internet search failed. Error: {str(e)}"
