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
        
        print("Sample data inserted!")
    finally:
        session.close()

def addCol():
        

        # Replace with your actual PostgreSQL connection string
        

        # Connect using the URL
        conn = psycopg2.connect(DATABASE_URL)
        cur = conn.cursor()

        # SQL query to add a new column
        alter_table_query = '''
        ALTER TABLE doctors
        ADD COLUMN phonenum VARCHAR(255);'''

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
        deleted = session.query(Appointment).delete()
        session.commit()
        print(f"Deleted {deleted} appointments from the database.")
    finally:
        session.close()

if __name__ == "__main__":
    seed()


