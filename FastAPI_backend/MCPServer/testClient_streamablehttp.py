import asyncio
from mcp import ClientSession
import httpx
from fastmcp import Client
async def main():
    # The MCP server URL for streamable-http
    mcp_url = "http://localhost:8000/mcp"
    async with Client(mcp_url) as client:
            session=client.session
            await session.initialize()
            # List available tools
            tools = await session.list_tools()
            print("Available tools:", [t.name for t in tools.tools])

            # Example: Call a tool if it exists
            if any(t.name == "create_appointment" for t in tools.tools):
                result = await session.call_tool("create_appointment", {"data":{"patient_name":"Pulkit", "doctor_name":"Dr. Alice", "date":"29-07-2025", "start_time":"2:00", "email":"gpulkitgupta72@gmail.com"}})
                print("create_appointment result:", result)

if __name__ == "__main__":
    asyncio.run(main())
