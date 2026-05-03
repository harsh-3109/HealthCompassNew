import pandas as pd

desc_df = pd.read_csv("data/disease_prediction/symptom_Description.csv")
prec_df = pd.read_csv("data/disease_prediction/symptom_precaution.csv")
sev_df = pd.read_csv("data/disease_prediction/Symptom-severity.csv")

severity_dict = dict(zip(sev_df["Symptom"], sev_df["weight"]))

def get_description(disease):
    row = desc_df[desc_df["Disease"] == disease]
    return row.iloc[0]["Description"] if not row.empty else "No description"

def get_precautions(disease):
    row = prec_df[prec_df["Disease"] == disease]
    return row.iloc[0][1:].dropna().tolist() if not row.empty else []

def get_risk(conf):
    if conf > 0.7:
        return "High"
    elif conf > 0.4:
        return "Medium"
    return "Low"