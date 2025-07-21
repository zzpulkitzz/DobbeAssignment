from fastapi import APIRouter,Request
from pydantic import BaseModel, field_validator
from typing import List
from datetime import date,datetime
from Server.database import get_availability_for_doctor, store_appointment

from Server.Email.email_utils import send_email_confirmation
from Server.database import listDoctors
import httpx
from twilio.rest import Client
import os


router = APIRouter()

class AvailabilityInput(BaseModel):
    doctor_name: str
    date: str

    @field_validator("date", mode="before")
    def validate_date(cls, v):
        from datetime import datetime
        try:
            datetime.strptime(v, "%d-%m-%Y")
        except ValueError:
            raise ValueError("date must be DD-MM-YYYY")
        return v

    @field_validator("doctor_name", mode="before")
    def validate_doctor_name(cls, v):
        if not isinstance(v, str) or not v.startswith("Dr."):
            raise ValueError('doctor_name must start with "Dr."')
        return v


class Slot(BaseModel):
    time: str


class AppointmentInput(BaseModel):
    patient_name: str
    doctor_name: str
    date: str
    start_time: str
    email: str


class EventInput(BaseModel):
    summary: str
    description: str
    start_time: str 
    end_time: str
    email: str

def register_tools(mcp):
    @mcp.tool()
    def get_all_doctors() -> List[str]:
        """Get the list of all doctors.
        """
        print("[TOOL CALL] get_all_doctors called with no arguments")
        result = [doctor_entry.name for doctor_entry in listDoctors()]
        print(f"[TOOL RETURN] get_all_doctors returned: {result}")
        return result

    @mcp.tool()
    def get_doctor_availability(data: AvailabilityInput) -> Slot:
        """Get the available slots for a doctor on a specific date.    
        """
        print(f"[TOOL CALL] get_doctor_availability called with: {data}")
        result = get_availability_for_doctor(data.doctor_name, data.date)[0]
        print(f"[TOOL RETURN] get_doctor_availability returned: {result}")
        return result

    @mcp.tool()
    def get_doctor_appointments(data: AvailabilityInput) -> List[Slot]:
        """Get the appointments for a doctor on a specific date.    
        """
        print(f"[TOOL CALL] get_doctor_appointments called with: {data}")
        result = get_availability_for_doctor(data.doctor_name, data.date)[1]
        print(f"[TOOL RETURN] get_doctor_appointments returned: {result}")
        return result

    @mcp.tool()
    async def create_appointment(data: AppointmentInput) -> dict:
        """Create an appointment, add to calendar, and send confirmation email."""
        print("[TOOL CALL] create_appointment called with:" ,data)
        result1 = store_appointment(data)
        if not (isinstance(result1, dict) and result1.get("status") == "success"):
            print(f"[TOOL RETURN] create_appointment returned1: {result1}")
            return result1


        async with httpx.AsyncClient() as client:
            response = await client.post(
        (os.getenv("API_URL")+"/create_event"),
        json=data.model_dump() 
    )
        result2 = response.json()
        if not (isinstance(result2, dict) and result2.get("status") == "success"):
            print(f"[TOOL RETURN] create_appointment returned2: {result2}")
            return result2  

        result3 = send_email_confirmation(data)
        if not (isinstance(result3, dict) and result3.get("status") == "success"):
            print(f"[TOOL RETURN] create_appointment returned3: {result3}")
            return result3
        
        
        result = {"status": "success", "message": "Appointment created successfully, email sent and calendar event added"}
        print(f"[TOOL RETURN] create_appointment returned4: {result}")
        return result

    @mcp.tool()
    def sendReport(report:str,doctor_number:str):
        """Send a summary report to the doctor via whatsapp"""
        

        TWILIO_ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID")
        TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN")

        client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)

        from_whatsapp_number = 'whatsapp:+14155238886'
        to_whatsapp_number = f'whatsapp:{doctor_number}'

        message = client.messages.create(
            body=report,
            from_=from_whatsapp_number,
            to=to_whatsapp_number
            )
        return {"status":"success","message":"Report sent successfully","data": message.sid}

    @mcp.tool()
    def getDate() -> str:
        """Get the current date and time"""
        return datetime.now().strftime("%d-%m-%Y %H:%M:%S")
    

    
