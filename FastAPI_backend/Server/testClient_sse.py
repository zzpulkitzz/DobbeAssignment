import asyncio
from mcp.client.sse import sse_client
from mcp import ClientSession

async def test_call_tool():
    async with sse_client("http://localhost:8000/sse") as (read_stream, write_stream):
        async with ClientSession(read_stream, write_stream) as session:

            await session.initialize()
            result = await session.call_tool("sendReport", {"report": "hey there doctor", "doctor_number": "+918126293202"})
            print(result)

asyncio.run(test_call_tool())