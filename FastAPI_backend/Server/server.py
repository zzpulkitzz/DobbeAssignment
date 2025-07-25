from mcp.server.fastmcp import FastMCP
from database import engine
from Server.base import Base
import url  # This ensures MCP tools are registered
import os
mcp = FastMCP("DoctorScheduler", description="Doctor appointment and reporting tools")

url.register_tools(mcp)
Base.metadata.create_all(engine)



if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))  # Render sets PORT automatically
    mcp.run(host="0.0.0.0", port=port,transport="streamable-http")
