Dobbe — Smart Healthcare Assistant

Dobbe is an agentic web app for managing doctor appointments, powered by AI and context-aware scheduling.

It helps:
- Patients: book appointments with doctors using natural language.
- Doctors: view schedules, appointment stats, and receive summaries via WhatsApp or email.

---

Core Technologies

- **Google Gemini Flash 2.5**: Handles natural language understanding and tool orchestration.
- **FastMCP**: The official Python SDK implementing the Model Context Protocol (MCP) for dynamic tool usage.

Tools Provided to the LLM:-

1. get_all_doctors():- Get the list of all registered doctors.
2. get_doctor_availability:-Get the available slots for a doctor on a specific date.
3. get_doctor_appointments:-Get the appointments for a doctor on a specific date.
4. create_appointment:-Create an appointment, adds to the calendar of the Doctor, and send confirmation email.
5. sendReport:-Send a summary report to the doctor via whatsapp
6. getDate:-Gets current Date and Time.

---

##  Tech Stack

- **Frontend**: Vite + React
- **Backend**: FastAPI
- **Database**: PostgreSQL
- **AI Agent**: Gemini Flash 2.5 orchestrated via FastMCP
- **APIs**: Google Calendar, Gmail, Twilio SMS
- **ORM**: SQLAlchemy

---

##  Installation & Setup  

### 1. Clone the Project  
git clone https://github.com/your-username/dobbe-assistant.git  
cd dobbe-assistant  
pip install uv  
uv add -r requirements.txt  

For MCP tools:-
uv add "mcp[cli]"

##Running the backend server:  
cd FastAPI_backend  
uvicorn gemini_api:app --port 8060  

##Running the MCP server:-  
cd FastAPI_backend/Server  
mcp run Server/server.py --transport=sse  

##Running the React App:-  
cd DobbeFrontend  
npm run dev


