# auth_setup.py
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
import pickle
import os.path

SCOPES = ['https://www.googleapis.com/auth/calendar']

def authenticate_user():
    creds = None

    # Load existing token
    if os.path.exists('token.pickle'):
        with open('token.pickle', 'rb') as token:
            creds = pickle.load(token)

    
    # If no valid creds, start OAuth flow
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                '/Users/pulkit/claude-demo/auth_credentials.json', SCOPES)
            creds = flow.run_local_server(port=8080)

        # Save token
        with open('token.pickle', 'wb') as token:
            pickle.dump(creds, token)

    return creds
