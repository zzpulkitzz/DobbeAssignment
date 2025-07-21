#!/bin/bash

# Start FastAPI server
uvicorn gemini_api:app --host 0.0.0.0 &

# Start MCP server
mcp run Server/server.py --transport=sse &

# Wait for both to finish
wait