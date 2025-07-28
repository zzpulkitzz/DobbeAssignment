import subprocess
import sys
import time
import json
import os

def test_create_doctor_appointment():
    # Path to your server file
    server_path = "/Users/pulkit/claude-demo/FastAPI_backend/Server/server.py"
    uv_bin = "/Users/pulkit/.local/bin/uv"

    # Start the MCP server as a subprocess
    server_proc = subprocess.Popen(
        [
            uv_bin, "run", "--with", "mcp[cli]", "mcp", "run", server_path
        ],
        stdin=subprocess.PIPE,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
        cwd="/Users/pulkit/claude-demo"
    )

    try:
        # Give the server a moment to start
        time.sleep(2)

        # Example MCP tool invocation (replace with actual tool name and schema)
        # This is a generic example; adjust "create_doctor_appointment" and arguments as needed
        mcp_request = {
            "type": "tool",
            "tool": "create_appointment",
            "args": {
                "date": "2025-07-19",
                "start_time": "14:30",
                "email": "gsonal87@gmail.com",
                "doctor_name": "Dr. Bob",
                "patient_name": "Pulkit"
            }
        }

        # Send the request as a JSON line
        server_proc.stdin.write(json.dumps(mcp_request) + "\n")
        server_proc.stdin.flush()

        # Read response (wait for one line)
        response_line = server_proc.stdout.readline()
        print("Server response:", response_line.strip())

    finally:
        # Clean up: terminate the server
        server_proc.terminate()
        try:
            server_proc.wait(timeout=5)
        except subprocess.TimeoutExpired:
            server_proc.kill()

if __name__ == "__main__":
    test_create_doctor_appointment()