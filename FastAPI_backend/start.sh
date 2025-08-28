#!/bin/bash

set -e

echo "=== Container boot ==="
echo "PWD: $(pwd)"
echo "Files:"
ls -al


echo "Starting FastAPI server..."
uvicorn     main:app --host 0.0.0.0 

