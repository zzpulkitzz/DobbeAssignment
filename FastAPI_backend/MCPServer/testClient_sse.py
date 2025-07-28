import asyncio
from mcp.client.sse import sse_client
from mcp import ClientSession

async def test_call_tool():
    async with sse_client("http://localhost:8000/mcp") as (read_stream, write_stream):
        async with ClientSession(read_stream, write_stream) as session:

            await session.initialize()
            result = await session.call_tool("create_appointment", {"patient_name":"Pulkit", "doctor_name":"Dr. Alice", "date":"29-07-2025", "start_time":"09:00", "email":"gpulkitgupta72@gmail.com"})
            print(result)

asyncio.run(test_call_tool())