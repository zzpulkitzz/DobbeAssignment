from mcp.server.fastmcp import FastMCP
from database import engine
from Server.base import Base
import url  
mcp = FastMCP("DoctorScheduler", description="Doctor appointment and reporting tools",host="0.0.0.0")

url.register_tools(mcp)
Base.metadata.create_all(engine)


if __name__ == "__main__":
    mcp.run(
        transport="streamable-http"
    )
