from googleapiclient.discovery import build

from Server.Google_Calender.auth_setup import authenticate_user
from datetime import datetime, timedelta
def create_calendar_event(data):

    data = data.dict()

    creds = authenticate_user()
    service = build("calendar", "v3", credentials=creds)
    date_today = datetime.strptime(data["date"], "%d-%m-%Y").date()  

    # Parse start time and calculate end time
    # Zero-pad hour and minute for ISO format
    time_parts = data['start_time'].split(':')
    hour = int(time_parts[0])
    minute = int(time_parts[1])
    time_str = f"{hour:02d}:{minute:02d}:00"
    datetime_str = f"{date_today}T{time_str}"
    start_time = datetime.fromisoformat(datetime_str)
    end_time = start_time + timedelta(minutes=30)
    
    event = {
        "summary": "Appointment with " + data["doctor_name"],
        "description": "Regular check-up",
        "start": {
            "dateTime": start_time.isoformat(),
            "timeZone": "Asia/Kolkata",
        },
        "end": {
            "dateTime": end_time.isoformat(),
            "timeZone": "Asia/Kolkata",
        },
        "attendees": [{"email": data["email"]}],
        "reminders": {
            "useDefault": True
        },
    }

    try:
        event_result = service.events().insert(calendarId="primary", body=event).execute()
        return {"status": "success", "event_link": event_result.get("htmlLink"), "message": "Event created successfully"}
    except Exception as e:
        return {"status": "error", "message": f"Failed to create calendar event: {e}"}
