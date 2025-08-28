from mcp.server.fastmcp import FastMCP
from MCPServer.database import engine
from MCPServer.base import Base
import MCPServer.url  
mcp = FastMCP("DoctorScheduler", description="Doctor appointment and reporting tools",host="0.0.0.0")

MCPServer.url.register_tools(mcp)
Base.metadata.create_all(engine)


if __name__ == "__main__":
    mcp.run(
        transport="streamable-http"
    )
