
import httpx
from Server.database import store_appointment
import asyncio
def test_store_appointment():
    res=store_appointment({
            "doctor_name":"Dr. Bob",
            "date":"21-07-2025",
            "start_time":"16:00",
            "email":"gpulkitgupta72@gmail.com",
            "patient_name":"Pulkit"
        })
    
    print(res)
test_store_appointment()
    
    