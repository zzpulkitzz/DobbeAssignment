from fastapi import FastAPI,Request,Depends,Body
from pydantic import BaseModel
from fastapi.responses import JSONResponse,RedirectResponse
import os
from dotenv import load_dotenv
from google import genai
from Server.client import handleQuery
from Server.database import createUser
from fastapi.responses import RedirectResponse, JSONResponse
from authlib.integrations.starlette_client import OAuth
from starlette.config import Config
from starlette.middleware.sessions import SessionMiddleware
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from Server.models import User,Doctor
from Server.url import AppointmentInput
from datetime import datetime
from datetime import timedelta
import httpx
load_dotenv()
gemini_client = genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))

app = FastAPI()
engine = create_engine(os.getenv("DATABASE_URL"))
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
app.add_middleware(SessionMiddleware, secret_key=os.getenv("SECRET_KEY"))
from fastapi.middleware.cors import CORSMiddleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

oauth = OAuth()
oauth.register(
    name='google',
    client_id=os.getenv('GOOGLE_CLIENT_ID'),
    client_secret=os.getenv('GOOGLE_CLIENT_SECRET'),
    server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
    authorize_params={
        'access_type': 'offline',
        'prompt': 'consent',
    },
    client_kwargs={'scope': 'openid email profile https://www.googleapis.com/auth/calendar.events'}
)
class QueryRequest(BaseModel):
    query: str

conversation=[]
system_prompt="You are an intelligent MCP agent Dobbe, an AI assistant for a hospital's appointment management system.Your users can have two possible roles- patient or doctor. You will be used by patients to schedule and query about their appointments with Doctors and send them confirmation emails about it. And doctors will use you to query about their appointments with patients and recieve summary reports about their appointments via whatsapp. You must-:1. Invoke tools intelligently according to the user query and their role, also following the tool’s declared schema. 2. Intelligently parse the user query to understand the arguments to pass to the tools to complete the user's request in the right format. 3. If the tools return an error for a particular format be persistent and try again with a changed format , atleast 4 times , before you return a response to the user. 4. provide a final response if no tools are needed. Always prefer calling tools when useful. If an error occurs, handle it gracefully and communicate the error to the user. 5. Do not ask user for any unnecessary information."




@app.get('/login')
async def login(request: Request):
    redirect_uri = request.url_for('auth_callback')
    role = request.query_params.get('role')
    print(role)
    return await oauth.google.authorize_redirect(request, redirect_uri,state=role)

@app.get('/logout')
async def logout(request: Request):
    request.session.pop('user', None)
    return RedirectResponse(url="http://localhost:5173/login")

@app.get('/auth/callback')
async def auth_callback(request: Request):
    role = request.query_params.get('state')
    print("sdc",role)
    token = await oauth.google.authorize_access_token(request)
    session = SessionLocal()
    user = session.query(Doctor).filter_by(email=token['userinfo']['email']).first()
    
    print("bdshvbjds",user)
    if role=="doctor":
        if user:
            user.access_token = token['access_token']
            user.refresh_token = token['refresh_token']
            request.session['user'] = {'name': user.name, 'email': token['userinfo']['email'],"role":role}
            session.commit()
        else:
            print("hereeee")
            doctor=Doctor(
                name="Dr. "+token['userinfo']['name'],
                email=token['userinfo']['email'],
                access_token=token['access_token'],
                refresh_token=token['refresh_token'])
            session.add(doctor)
            request.session['user'] = {'name': doctor.name, 'email': token['userinfo']['email'],"role":role}
            session.commit()
            return RedirectResponse(url="http://localhost:5173/whatsapp")
    else:
        user = session.query(User).filter_by(email=token['userinfo']['email']).first()
        if user:
            user.access_token = token['access_token']
            user.refresh_token = token['refresh_token']
            request.session['user'] = {'name': user.name, 'email': token['userinfo']['email'],"role":role}
            session.commit()
        else:
            user = User(
            name=token['userinfo']['name'],
            email=token['userinfo']['email'],
            access_token=token['access_token'],
            refresh_token=token['refresh_token'])
            session.add(user)
            session.commit()

    
    
    request.session['user'] = {'name': token['userinfo']['name'], 'email': token['userinfo']['email'],"role":role}
    

    return RedirectResponse(url="http://localhost:5173/")

@app.get('/me')
def get_user(request: Request):
    user = request.session.get('user')
    return JSONResponse({"user": user})

@app.post("/ask")
async def ask_gemini(request: Request, query: QueryRequest):
    user_obj = request.session.get('user')
    print("phone",user_obj.get("phonenum"))
    if user_obj:    
        user = {"name": user_obj.get("name"), "email": user_obj.get("email"),
        "whatsapp_number":user_obj.get("phonenum"),
        "role":user_obj.get("role")}
    else:
        user = {"name": None, "email": None,"role":None}
    conversation.append({"role": user.get("role"), "content": query.query})
    query=system_prompt+"6. Basic user information is:"+str(user)+"7. The following is your conversation history with the user,where you are the assistant:"+str(conversation)
    response = await handleQuery(query)
    conversation.append({"role": "assistant", "content": response})
    return JSONResponse({"response": response})

@app.post("/create_event")
async def create_event(request: Request,data: dict = Body(...)):
    try:
        session = SessionLocal()
        token=session.query(Doctor).filter_by(name=data["doctor_name"]).first().access_token

        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }
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
            "summary": "Appointment with " + data["patient_name"],
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


        async with httpx.AsyncClient() as client:
                response = await client.post(
                    "https://www.googleapis.com/calendar/v3/calendars/primary/events",
                    headers=headers,
                    json=event
                )
                print(response.json())
        return {"status":"success","message": "Event created successfully"}

    except Exception as e:
        return {"status":"error","message": str(e)}

    finally:
        session.close()



@app.post("/whatsapp")
async def whatsapp(request: Request):
    try:
        user_obj = request.session.get('user')
        session = SessionLocal()
        user = session.query(Doctor).filter_by(email=user_obj.get("email")).first()
        data = await request.json()  
        user.phonenum = data.get("phone_number")
        session_user = request.session.get("user")
        if session_user:
            session_user["phonenum"] = data.get("phone_number")
            request.session["user"] = session_user      
        session.commit()
        return JSONResponse({"status":"success","message": "WhatsApp number added successfully"})
    except Exception as e:
        return JSONResponse({"status":"error","message": str(e)})
    