#!/bin/zsh
#!/bin/zsh
cd /Users/pulkit/claude-demo

# Activate your virtual environment if needed
# source .venv/bin/activate

export $(grep -v '^#' .env | xargs)
export PYTHONPATH=/Users/pulkit/claude-demo/FastAPI_backend

/Users/pulkit/.local/bin/uv run --with "mcp[cli]" /Users/pulkit/claude-demo/FastAPI_backend/MCPServer/server.py --transport=sse