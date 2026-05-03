@echo off
echo Setting up project...

python -m venv venv
call venv\Scripts\activate.bat

pip install -r backend\requirements.txt

echo Starting server...
uvicorn backend.app:app --reload
