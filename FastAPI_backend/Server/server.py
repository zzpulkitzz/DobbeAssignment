from mcp.server.fastmcp import FastMCP
from database import engine
from Server.base import Base
import url  # This ensures MCP tools are registered
mcp = FastMCP("DoctorScheduler", description="Doctor appointment and reporting tools")
url.register_tools(mcp)
Base.metadata.create_all(engine)

if __name__ == "__main__":
    mcp.run(host="0.0.0.0")
    