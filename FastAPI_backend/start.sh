#!/bin/bash


set -e

echo "Starting FastAPI server..."
uvicorn gemini_api:app --host 0.0.0.0 --port 8000 &

echo "Starting MCP server..."
mcp run Server/server.py --transport=sse &

wait