import joblib
import numpy as np
import pandas as pd

from .utils import get_description, get_precautions, get_risk, severity_dict
from .nlp_engine import extract_symptoms, find_similar_disease
from .vision_engine import analyze_image_with_groq
from .rag_engine import ask_llm
import json
import re


class DiseasePredictor:
    def __init__(self):
        self.model = joblib.load("models/model.pkl")
        self.encoder = joblib.load("models/label_encoder.pkl")
        self.columns = joblib.load("models/symptom_columns.pkl")

        df = pd.read_csv("data/disease_prediction/training.csv")
        self.disease_list = df["prognosis"].dropna().astype(str).unique().tolist()
        
        # 🔥 BUILD NLP PROFILES FOR SEMANTIC FALLBACK
        from .nlp_engine import build_disease_profiles
        build_disease_profiles(df)

    def predict(self, input_data):
        try:
            image_analysis = None
            symptoms = []
            text_data = ""

            if isinstance(input_data, dict):
                # Process Image if present
                if input_data.get("image"):
                    image_analysis = analyze_image_with_groq(input_data["image"])

                # Determine Symptoms and Text
                if input_data.get("text"):
                    text_data = input_data["text"]
                    symptoms = extract_symptoms(text_data, self.columns)
                elif input_data.get("symptoms"):
                    symptoms_raw = input_data["symptoms"]
                    if len(symptoms_raw) == 1 and isinstance(symptoms_raw[0], str) and " " in symptoms_raw[0]:
                        # It was a single string containing text rather than array of symptoms
                        text_data = symptoms_raw[0]
                        symptoms = extract_symptoms(text_data, self.columns)
                    else:
                        symptoms = symptoms_raw
            elif isinstance(input_data, str):
                text_data = input_data
                symptoms = extract_symptoms(input_data, self.columns)
            else:
                symptoms = input_data

            print("Detected:", symptoms)

            # If NO symptoms but we DO have an image, return just image analysis
            if not symptoms and image_analysis:
                return {
                    "symptoms_detected": [],
                    "top_predictions": [],
                    "final_prediction": "Pending Clinical Review (Image Only)",
                    "description": "Image scan received. Review the clinical findings from the imaging analysis below.",
                    "precautions": ["Consult a radiologist", "Follow up with primary care"],
                    "risk": "Moderate",
                    "graph_data": [],
                    "image_analysis": image_analysis
                }

            # 🔥 RULE ENGINE (VERY IMPORTANT)
            rule_match = None
            if "chest_pain" in symptoms and "acidity" in symptoms:
                rule_match = "GERD"
            elif "chest_pain" in symptoms and "breathlessness" in symptoms:
                rule_match = "Heart attack"
            elif ("itching" in symptoms or "skin_rash" in symptoms) and "nodal_skin_eruptions" in symptoms:
                rule_match = "Fungal infection"
            elif "high_fever" in symptoms and "chills" in symptoms and "sweating" in symptoms:
                rule_match = "Malaria"
            elif "stomach_pain" in symptoms and "acidity" in symptoms and "ulcers_on_tongue" in symptoms:
                rule_match = "Peptic ulcer diseae"
            elif "joint_pain" in symptoms and "vomiting" in symptoms and "yellowing_of_eyes" in symptoms:
                rule_match = "Hepatitis E"
                
            if rule_match:
                return {
                    "symptoms_detected": symptoms,
                    "top_predictions": [{ "disease": rule_match, "confidence": 0.99 }],
                    "final_prediction": rule_match,
                    "description": get_description(rule_match),
                    "precautions": get_precautions(rule_match),
                    "risk": "High" if rule_match == "Heart attack" else get_risk(0.99),
                    "graph_data": [{
                        "disease": rule_match,
                        "confidence": 0.99,
                        "type": "Rule-Based"
                    }]
                }
            # 🔥 VECTOR
            input_vector = np.zeros(len(self.columns))

            for s in symptoms:
                if s in self.columns:
                    idx = self.columns.index(s)
                    input_vector[idx] = 1

            # 🔥 ML
            probs = self.model.predict_proba([input_vector])[0]
            probs = probs / probs.sum()   # 🔥 normalize

            top_idx = probs.argsort()[-3:][::-1]

            results = []
            for i in top_idx:
                confidence = float(probs[i])

                if confidence < 0.1:  # 🔥 filter weak
                    continue

                disease = self.encoder.inverse_transform([i])[0]

                results.append({
                    "disease": disease,
                    "confidence": round(confidence, 2)
                })

            # 🔥 NLP fallback (Using Deep Semantic Symptom Profiles)
            text = input_data if isinstance(input_data, str) else " ".join(symptoms)
            nlp_disease, score = find_similar_disease(text)

            # 🔥 FINAL DECISION (Intelligently blend NLP Context and ML Precision)
            # Native Bayes often hallucinates 50%+ confidence on bad matches (like Paralysis for headache).
            # Our semantic profile matcher is much more "doctor-like". We prioritize it if it has strong confidence.
            if score > 0.45:
                # Strong semantic profile match!
                final = nlp_disease
                conf = score
                final_type = "NLP"
            elif results and results[0]["confidence"] > 0.65:
                # Very strong ML match
                final = results[0]["disease"]
                conf = results[0]["confidence"]
                final_type = "ML"
            elif score > 0.2:
                # Weak semantic profile match
                final = nlp_disease
                conf = score
                final_type = "NLP"
            elif results:
                # Weak but better than nothing
                final = results[0]["disease"]
                conf = results[0]["confidence"]
                final_type = "ML"
            else:
                final = nlp_disease
                conf = score
                final_type = "NLP"

            # 🔥 GRAPH
            graph_data = []

            for r in results:
                graph_data.append({
                    "disease": r["disease"],
                    "confidence": r["confidence"],
                    "type": "ML"
                })

            graph_data.append({
                "disease": final,
                "confidence": round(conf, 2),
                "type": final_type
            })

            raw_desc = get_description(final)
            raw_prec = get_precautions(final)
            
            result_payload = {
                "symptoms_detected": symptoms,
                "top_predictions": results,
                "final_prediction": final,
                "description": raw_desc,
                "precautions": raw_prec,
                "risk": get_risk(conf),
                "graph_data": graph_data
            }

            # 🔥 Simplify Medical Language using Groq
            try:
                prec_str = ", ".join(raw_prec)
                simple_prompt = f"""
                You are a friendly, empathetic health assistant. 
                Rewrite the following medical description and precautions into VERY SIMPLE, plain language like you are talking to a 10-year-old. ABSOLUTELY NO medical jargon.
                
                Disease: {final}
                Medical Description: {raw_desc}
                Medical Precautions: {prec_str}
                
                Output ONLY valid JSON matching this exact format:
                {{"description": "The simple explanation here", "precautions": ["Simple step 1", "Simple step 2"]}}
                """
                
                simplified = ask_llm(simple_prompt)
                
                json_match = re.search(r'\{.*\}', simplified, re.DOTALL)
                if json_match:
                    simple_data = json.loads(json_match.group(0))
                    if "description" in simple_data:
                        result_payload["description"] = simple_data["description"]
                    if "precautions" in simple_data:
                        result_payload["precautions"] = simple_data["precautions"]
            except Exception as e:
                print(f"Error simplifying text: {e}")
                pass # fallback to original if parsing fails

            if image_analysis:
                result_payload["image_analysis"] = image_analysis
                # Enhance the description and final prediction if image was extremely clear
                if image_analysis.get("confidence", 0) > 0.8:
                    result_payload["description"] += f" Note: Image findings suggest {image_analysis['scan_type']} review."

            return result_payload

        except Exception as e:
            return {
                "message": f"AI Error: {str(e)}"
            }