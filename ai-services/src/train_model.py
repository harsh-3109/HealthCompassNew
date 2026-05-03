import pandas as pd
import joblib
from sklearn.preprocessing import LabelEncoder
from sklearn.naive_bayes import MultinomialNB

df = pd.read_csv("data/disease_prediction/training.csv").fillna(0)

if "Unnamed: 133" in df.columns:
    df = df.drop("Unnamed: 133", axis=1)

X = df.drop("prognosis", axis=1)
y = df["prognosis"]

le = LabelEncoder()
y_encoded = le.fit_transform(y)

model = MultinomialNB()
model.fit(X, y_encoded)

joblib.dump(model, "models/model.pkl")
joblib.dump(le, "models/label_encoder.pkl")
joblib.dump(X.columns.tolist(), "models/symptom_columns.pkl")

print("Model trained successfully")