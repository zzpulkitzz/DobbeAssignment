from sqlalchemy import create_engine, text
import os
from dotenv import load_dotenv
load_dotenv()
# Update with your actual DB credentials
engine = create_engine(os.getenv("DATABASE_URL"))

# Define the raw SQL query
alter_query = """
ALTER TABLE appointments
ALTER COLUMN date TYPE DATE,
ALTER COLUMN start_time TYPE TIME;


"""

# Execute the query
with engine.connect() as connection:
    connection.execute(text(alter_query))
    connection.commit()