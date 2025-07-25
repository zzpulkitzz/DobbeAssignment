import os
import asyncio
from fastmcp import Client

from dotenv import load_dotenv
from google import genai

load_dotenv()

gemini_client = genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))

def print_available_tools(tools):
    print("Available tools:", [t.name for t in tools.tools])

async def call_gemini_with_mcp(query: str):

    url = f"http://{os.getenv('MCP_URL')}/mcp"
    print("Connecting to:", url)

    async with Client(url) as client:
        response = await gemini_client.aio.models.generate_content(
                model="gemini-2.5-flash",
                contents=query,
                config=genai.types.GenerateContentConfig(
                    temperature=0, tools=[client.session]
                )
            )
        return response.text

async def handleQuery(query: str):
    return await call_gemini_with_mcp(query)