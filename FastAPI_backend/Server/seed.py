from database import SessionLocal
from Server.models import Doctor, Appointment
from datetime import datetime, timedelta
import psycopg2

# Sample doctors
sample_doctors = [
    Doctor(name="Dr. Gupta",email="gpulkitgupta72@gmail.com",access_token="",refresh_token="")
    
]

def clear_all_appointments():
    """
    Delete all appointments for all doctors from the database.
    """
    session = SessionLocal()
    try:
        deleted = session.query(Appointment).delete()
        session.commit()
        print(f"Deleted {deleted} appointments from the database.")
    finally:
        session.close()

def seed():
    session = SessionLocal()
    try:
        # Add doctors
        session.add_all(sample_doctors)
        session.commit()

        # Fetch doctors with IDs
        doctors = session.query(Doctor).all()
        base_date = datetime.now().replace(hour=9, minute=0, second=0, microsecond=0)
        appointments = []
        for i, doctor in enumerate(doctors):
            for j in range(3):
                appointments.append(
                    Appointment(
                        doctor_id=doctor.id,
                        patient_email="gpulkitgupta72@gmail.com",
                        start_time=base_date + timedelta(hours=j, days=i)
                    )
                )
        #session.add_all(appointments)
        #session.commit()
        #print("Sample data inserted!")
    finally:
        session.close()

def addCol():
        

        # Replace with your actual PostgreSQL connection string
        DATABASE_URL = "postgresql://pulkit@localhost:5432/ai_agent_db"

        # Connect using the URL
        conn = psycopg2.connect(DATABASE_URL)
        cur = conn.cursor()

        # SQL query to add a new column
        alter_table_query = '''
        ALTER TABLE doctors
        ADD COLUMN phonenum VARCHAR(255);
        
        '''

        try:
            cur.execute(alter_table_query)
            conn.commit()
            print("Column  added to 'doctors' table successfully.")
        except Exception as e:
            print("An error occurred:", e)
            conn.rollback()
        finally:
            cur.close()
            conn.close()

def deleteEntry():
    session = SessionLocal()
    try:
        deleted = session.query(Doctor).filter(Doctor.email == "gsonal87@gmail.com")
        print(deleted.email)
        session.commit()
        print(f"Deleted {deleted} doctors from the database.")
    finally:
        session.close()

if __name__ == "__main__":
    deleteEntry()


