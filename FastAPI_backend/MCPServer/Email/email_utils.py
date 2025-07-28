import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
# Replace with your Gmail account
GMAIL_USER = "gpulkitgupta72@gmail.com"
GMAIL_PASSWORD = os.getenv("GMAIL_PASSWORD")  

def send_email_confirmation(data):
    """
    Sends appointment confirmation to the patient.
    `data` should be a dictionary with:
        patient_name: str
    doctor_name: str
    date: date
    time: str
    email: str
    """
    try:
        data=data.dict()
        to_email = data['email']
        subject = f"Appointment Confirmation with {data['doctor_name']}"
        body = f"""
        Hello {data['patient_name']},

        Your appointment with Dr. {data['doctor_name']} has been confirmed.

        📅 Date: {data['date']}
        ⏰ Time: {data['start_time']}

        Thank you for using Dobbe Health Assistant!

        Regards,
        Team Dobbe
        """

        message = MIMEMultipart()
        message["From"] = GMAIL_USER
        message["To"] = to_email
        message["Subject"] = subject
        message.attach(MIMEText(body, "plain"))

    
        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()
            server.login(GMAIL_USER, GMAIL_PASSWORD)
            server.sendmail(GMAIL_USER, to_email, message.as_string())
        return {"status": "success", "message": "Email sent successfully"}
    except Exception as e:
        return {"status": "error", "message": f"Failed to send email: {e}"}
