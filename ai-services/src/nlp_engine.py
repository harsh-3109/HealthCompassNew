import re
from difflib import get_close_matches
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

# 🔥 Load model once
model = SentenceTransformer("all-MiniLM-L6-v2")

# 🔥 MASTER SYMPTOM MAP (EXPANDED + HINGLISH)
symptom_map = {
    # Fever
    "fever": "fever",
    "bukhar": "fever",
    "tej bukhar": "high_fever",
    "high fever": "high_fever",

    # Head
    "headache": "headache",
    "sar dard": "headache",
    "sir dard": "headache",

    # Chest / throat
    "chest pain": "chest_pain",
    "chhati me dard": "chest_pain",
    "heartburn": "acidity",
    "jin jalan": "acidity",
    "acidity": "acidity",
    "sore throat": "throat_irritation",
    "throat pain": "throat_irritation",
    "gale me dard": "throat_irritation",
    "khansi": "cough",
    "chronic cough": "cough",
    "cough": "cough",
    "breathlessness": "breathlessness",
    "saans fulna": "breathlessness",
    
    # Skin
    "rash": "skin_rash",
    "itching": "itching",
    "khujli": "itching",
    
    # Stomach
    "stomach pain": "stomach_pain",
    "abdominal pain": "abdominal_pain",
    "pet dard": "stomach_pain",

    # Digestion
    "vomiting": "vomiting",
    "vomit": "vomiting",
    "ulti": "vomiting",
    "nausea": "nausea",
    "matli": "nausea",

    "loose motion": "diarrhea",
    "diarrhea": "diarrhea",
    "dast": "diarrhea",

    # General
    "weakness": "fatigue",
    "fatigue": "fatigue",
    "kamzori": "fatigue",
    "thakan": "fatigue",
    "body pain": "body_pain",
    "badan dard": "body_pain",
    "muscle pain": "muscle_pain",
    "joint pain": "joint_pain",
    "jod me dard": "joint_pain",

    # Cold
    "cold": "cold",
    "zukaam": "cold",
    "sneezing": "sneezing",
    "chheenk": "sneezing"
}

# 🔥 CLEAN TEXT
def clean_text(text):
    text = text.lower()
    text = re.sub(r"[^a-zA-Z\s]", " ", text)
    return text.strip()


# 🔥 SPELL CORRECTION (SAFE VERSION)
def correct_word(word, valid_words):
    try:
        match = get_close_matches(word, valid_words, n=1, cutoff=0.7)
        return match[0] if match else word
    except:
        return word


# 🔥 N-GRAM GENERATION
def generate_phrases(words):
    phrases = []

    # single
    phrases.extend(words)

    # 2-word
    for i in range(len(words) - 1):
        phrases.append(words[i] + " " + words[i + 1])

    # 3-word
    for i in range(len(words) - 2):
        phrases.append(words[i] + " " + words[i + 1] + " " + words[i + 2])

    return phrases


# 🔥 MAIN EXTRACTOR (STRICT DATASET FILTER)
def extract_symptoms(text, all_symptoms):
    text = clean_text(text)

    if not text:
        return []

    words = text.split()

    # 🔥 spelling correction (only for single words against valid dataset)
    words = [correct_word(w, all_symptoms) for w in words]

    phrases = generate_phrases(words)

    found = set()

    # 🔥 STRICT FILTERING - ONLY RETURN SYMPTOMS IN all_symptoms
    valid_symptoms = set(all_symptoms)

    # 1. Match phrases against mapping
    for p in phrases:
        if p in symptom_map:
            mapped_val = symptom_map[p]
            if mapped_val in valid_symptoms:
                found.add(mapped_val)

    # 2. Match exact dataset strings directly
    for w in words:
        if w in valid_symptoms:
            found.add(w)

    return list(found)


# 🔥 GLOBAL CACHE FOR SPEED
disease_embeddings = None
disease_names = None

def build_disease_profiles(df):
    global disease_embeddings, disease_names
    print("Building Local NLP Symptom Profiles...")
    
    disease_names = [str(d) for d in df["prognosis"].dropna().unique().tolist()]
    
    profile_texts = []
    for d in disease_names:
        # Get all rows for this disease
        d_rows = df[df["prognosis"] == d]
        
        # Get symptoms that occur at least once for this disease
        symptoms = [
            col for col in d_rows.columns 
            if col not in ["prognosis", "Unnamed: 133"] and d_rows[col].sum() > 0
        ]
        
        # Make reading friendly: 'chest pain vomiting nausea'
        symptoms_text = " ".join([s.replace("_", " ") for s in symptoms])
        
        # Combine disease name and symptoms to form the context profile
        profile = d.replace("_", " ") + " " + symptoms_text
        profile_texts.append(profile)
        
    # Pre-encode for instant lookups during API calls
    disease_embeddings = model.encode(profile_texts)
    print(f"NLP Profiles ready for {len(disease_names)} diseases.")

# 🔥 NLP FALLBACK (SEMANTIC SYMPTOM MATCHING)
def find_similar_disease(text):
    global disease_embeddings, disease_names
    try:
        text = clean_text(text)

        if not text or disease_embeddings is None:
            return "Unknown Disease", 0.0

        text_emb = model.encode([text])

        # Match against full symptom profiles instead of just short strings
        scores = cosine_similarity(text_emb, disease_embeddings)[0]
        idx = scores.argmax()

        return disease_names[idx], float(scores[idx])

    except Exception as e:
        print("NLP Error:", e)
        return "Unknown Disease", 0.0