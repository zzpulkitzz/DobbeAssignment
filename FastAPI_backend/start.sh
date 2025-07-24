#!/bin/bash

set -e

echo "=== Container boot ==="
echo "PWD: $(pwd)"
echo "Files:"
ls -al

echo "Starting MCP server..."
mcp run Server/server.py --transport=sse > mcp.log 

