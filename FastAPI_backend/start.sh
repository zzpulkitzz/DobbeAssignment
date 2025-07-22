#!/bin/bash

set -e

echo "=== Container boot ==="
echo "PWD: $(pwd)"
echo "Files:"
ls -al

echo "Starting MCP server..."
mcp run Server/server.py --transport=sse > mcp.log 2>&1 &

echo "Starting FastAPI server..."
uvicorn gemini_api:app --host 0.0.0.0 --port 8000