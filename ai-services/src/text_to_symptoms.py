# simple NLP mapping (hinglish + english)

symptom_map = {
    "fever": ["fever", "bukhar", "high temperature"],
    "headache": ["headache", "sar dard", "sir dard"],
    "cough": ["cough", "khansi"],
    "cold": ["cold", "sardi"],
    "vomiting": ["vomiting", "ulti"],
    "fatigue": ["fatigue", "thakan"],
    "body pain": ["body pain", "jism dard"],
    "chills": ["chills", "thand lagna"],
    "nausea": ["nausea", "jee ghabrana"]
}

def extract_symptoms(text):
    text = text.lower()

    detected = []

    for symptom, keywords in symptom_map.items():
        for word in keywords:
            if word in text:
                detected.append(symptom)
                break

    return detected