# Dockerfile for Backend API
FROM python:3.11-slim

WORKDIR /app

# Update pip
RUN python -m pip install --upgrade pip

# Copy requirements and install dependencies
COPY requirements.txt .
RUN python -m pip install --no-cache-dir -r requirements.txt

# Copy all backend files
COPY . .

# Copy entrypoint script
COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

# Expose port (Render will set PORT env var)
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD python -c "import os, httpx; port = os.environ.get('PORT', '8000'); httpx.get(f'http://localhost:{port}/health', timeout=5)"

# Start the application using entrypoint script
ENTRYPOINT ["/app/entrypoint.sh"]

