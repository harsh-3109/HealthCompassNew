#!/bin/bash

echo "Setting up project..."

python -m venv venv
source venv/bin/activate

pip install -r backend/requirements.txt

echo "Starting server..."
uvicorn backend.app:app --reload
