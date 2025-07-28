
import httpx
from MCPServer.database import store_appointment
import asyncio
import os
async def test_store_appointment(data):
    async with httpx.AsyncClient() as client:
            response = await client.post(str(os.getenv("API_URL")+"create_event"),
        json=data
        )
    print(response.json())
asyncio.run(test_store_appointment({
    "doctor_name":"Dr. Gupta",
    "date":"21-07-2025",
    "start_time":"16:00",
    "email":"gpulkitgupta72@gmail.com",
    "patient_name":"Pulkit"
}))
    
    