from database import SessionLocal
from Server.models import Doctor, Appointment

def log_all_data():
    session = SessionLocal()
    try:
        token = session.query(Doctor).all()
        for doctor in token:
            print(doctor.phonenum)
        
    finally:
        session.close()

if __name__ == "__main__":
    log_all_data()