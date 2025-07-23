FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Create non-root user
RUN groupadd -r twinning && useradd -r -g twinning twinning

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Copy dependencies directory for SPELWork integration
COPY --chown=twinning:twinning ../dependencies/ ../dependencies/

# Change ownership of the app directory
RUN chown -R twinning:twinning /app

# Switch to non-root user
USER twinning

# Expose port
EXPOSE 3003

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD python -c "import requests; requests.get('http://localhost:3003/health').raise_for_status()"

# Start the application
CMD ["python", "memory_api.py"]
