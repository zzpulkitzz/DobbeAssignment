#!/bin/bash

set -e

echo "=== Container boot ==="
echo "PWD: $(pwd)"
echo "Files:"
ls -al



echo "Starting FastAPI server..."
uvicorn gemini_api:app --host 0.0.0.0 --port 8000