#!/bin/sh
set -e

# Get PORT from environment variable, default to 8000 if not set
PORT=${PORT:-8000}

# Debug: Log the port being used (Railway will capture this in logs)
echo "Starting uvicorn on port: $PORT"

# Start uvicorn with the port
exec uvicorn backend.app:app --host 0.0.0.0 --port "$PORT"

