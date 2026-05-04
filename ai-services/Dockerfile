# Use official Python image
FROM python:3.9

# Create a non-root user (Hugging Face requires this)
RUN useradd -m -u 1000 user
USER user
ENV PATH="/home/user/.local/bin:$PATH"

# Set working directory
WORKDIR /app

# Copy requirements and install dependencies
COPY --chown=user ./requirements.txt requirements.txt
RUN pip install --no-cache-dir --upgrade -r requirements.txt

# Copy the rest of the application code
COPY --chown=user . /app

# Start the FastAPI application on port 7860 (Hugging Face requires port 7860)
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "7860"]
