import sys
import asyncio
from mcp.client.sse import sse_client
from mcp import ClientSession
from dotenv import load_dotenv
import os
from google import genai

load_dotenv()

gemini_client = genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))

def print_available_tools(tools):
    print("Available tools:", [t.name for t in tools.tools])





async def call_gemini_with_mcp(query: str):
    print("https://"+os.getenv("API_URL")+":"+str(os.getenv("MCP_PORT"))+"/sse")
    async with sse_client("https://"+os.getenv("API_URL")+":"+str(os.getenv("MCP_PORT"))+"/sse") as (read_stream, write_stream):
        async with ClientSession(read_stream, write_stream) as session:
            await session.initialize()
            response = await gemini_client.aio.models.generate_content(
                model="gemini-2.5-flash",
                contents=query,
                config=genai.types.GenerateContentConfig(temperature=0, tools=[session])
            )
            
            return response.text

async def handleQuery(query: str):
    
    return await call_gemini_with_mcp(query)

