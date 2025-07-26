from sqlalchemy import create_engine


from sqlalchemy.orm import Session, sessionmaker

from Server.models import Doctor, Appointment,User
from datetime import datetime, time, timedelta
import os
from dotenv import load_dotenv




load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
print(DATABASE_URL) 
engine = create_engine(DATABASE_URL, echo=False)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


try:
    session = SessionLocal()
    for i in ["Dr. Alice","Dr. Bob","Dr. Carol"]:
        doctor=Doctor(name=i,email=i[4:]+"@doctor.com",phonenum="1234567890",access_token="",refresh_token="")
        session.add(doctor)
    session.commit()
except Exception as e:
    print(e)
finally:
    session.close()

def createUser(email,name,access_token,refresh_token):
    session = SessionLocal()
    try:
        user = User(
            email=email,
            name=name,
            access_token=access_token,
            refresh_token=refresh_token
        )
        session.add(user)
        session.commit()
        return user
    finally:
        session.close()
def listDoctors():
    session = SessionLocal()
    try:
        doctors = session.query(Doctor).all()
        print("root",doctors)
        return doctors
    finally:
        session.close()


def store_appointment(data):
    """
    Takes an AppointmentInput object, checks if the doctor is free at the given date and time,
    and if so, creates the appointment using create_appointment. If not free, raises an Exception.
    """
    

    session = SessionLocal()
    
    try:
        # Find the doctor by name
        
        data=data.dict()
        print("datavs",data['doctor_name'])
        
        doctor = session.query(Doctor).filter(Doctor.name == data["doctor_name"]).first()
        if not doctor:
            raise Exception("Doctor not found")

        # Parse the date and time into correct types
        date = datetime.strptime(data["date"], "%d-%m-%Y").date()
        start_time = datetime.strptime(data["start_time"], "%H:%M").time()

        # Check if there is already an appointment for this doctor at this time
        existing = session.query(Appointment).filter(
            Appointment.doctor_id == doctor.id,
            Appointment.date == date,
            Appointment.start_time == start_time
        ).first()
        print(existing)
        if existing:
            print("ya")
            raise Exception("Doctor is not available at this time")

        # Create the appointment
        appointment = Appointment(
            doctor_id=doctor.id,
            patient_email=data["email"],
            patient_name=data["patient_name"],
            date=date,
            start_time=start_time,
        )

        session.add(appointment)
        session.commit()
        return {"status": "success", "message": f"Appointment created successfully on {appointment}"}
    except Exception as e:
        return {"status": "error", "message": f"Failed to create appointment: {e}"}
    finally:
        session.close()

def get_availability_for_doctor(doctor_name: str, date: datetime.date):
    """
    Returns a list of available slots for a doctor on a given date.
    Each slot is a dict: {'time': 'HH:MM', 'is_available': bool}
    """
    session = SessionLocal()
    try:
        doctor = session.query(Doctor).filter(Doctor.name == doctor_name).first()
        if not doctor:
            raise Exception("No Doctor found with name: " + doctor_name)


        # Define slots: every 30 min from 9:00  to 17:00
        slots = []
        date=datetime.strptime(date, "%d-%m-%Y").date()     
        slots = [time(h, m).strftime('%H:%M')
         for h in range(9, 17)
         for m in (0, 30)]
        
        # Get all appointments for this doctor on this date
        appts = session.query(Appointment).filter(
            Appointment.doctor_id == doctor.id,
            Appointment.date == date
        ).all()
        booked_times=[]
        for appt in appts:
            booked_times.append(str(appt.start_time)[:-3])
        print("booked_times",booked_times)
        result = []
        for slot in slots:
            if str(slot) not in booked_times:
                result.append(
                    slot,
                )

        return [{"status": "success", "message": "Available Slots Fetched Successfully", "data": result},{"status": "success", "message": "Busy Slots Fetched Successfully", "data": booked_times}]
    except(Exception) as e:
        return {"status": "error", "message": "Failed to get availability for doctor " + str(e)}
    finally:
        session.close()