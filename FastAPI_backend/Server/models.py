from sqlalchemy import Column, Integer, String, Date, Time, ForeignKey
from Server.base import Base
from datetime import datetime
from sqlalchemy import Text




class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True)
    email = Column(String, unique=True, nullable=False)
    name = Column(String)
    access_token = Column(Text)
    refresh_token = Column(Text)


class Doctor(Base):
    __tablename__ = "doctors"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)
    email = Column(String, unique=True, nullable=False)
    phonenum=Column(String)
    access_token = Column(Text)
    refresh_token = Column(Text)

class Appointment(Base):
    __tablename__ = "appointments"
    id = Column(Integer, primary_key=True, index=True)
    doctor_id = Column(Integer, ForeignKey("doctors.id"))
    patient_email = Column(String, nullable=False)
    patient_name=Column(String, nullable=False)
    date=Column(Date)
    start_time = Column(Time)




