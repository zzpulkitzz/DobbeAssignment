from database import SessionLocal
from Server.models import Doctor, Appointment

def log_all_data():
    session = SessionLocal()
    try:
        doctors = session.query(Doctor).all()
        for doctor in doctors:

            print(f"Doctor Name: {doctor.name}")
            appointments = session.query(Appointment).filter_by(doctor_id=doctor.id).all()
            for appt in appointments:
                print(f"  Appointment ID: {appt.id}")
                print(f"    Patient Email: {appt.patient_email}")
                print(f"    Start Time: {appt.start_time}")
    finally:
        session.close()

if __name__ == "__main__":
    log_all_data()