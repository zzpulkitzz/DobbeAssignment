from mcp.server.fastmcp import FastMCP
from sqlalchemy import inspect
from database import engine
from Server.base import Base
import url  
mcp = FastMCP("DoctorScheduler", description="Doctor appointment and reporting tools")

url.register_tools(mcp)
Base.metadata.create_all(engine)

inspector = inspect(engine)
print(inspector.get_table_names())


if __name__ == "__main__":
    mcp.run(
        transport="streamable-http"
    )
