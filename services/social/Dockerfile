FROM python:3.9-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Create requirements.txt for placeholder service
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create health endpoint
EXPOSE 8080

# Start the social automation service in API mode
CMD ["python", "social_automation_api.py"]
