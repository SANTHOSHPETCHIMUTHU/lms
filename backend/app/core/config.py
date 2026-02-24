import os
from dotenv import load_dotenv

load_dotenv()

DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_HOST = os.getenv("DB_HOST")
DB_PORT = os.getenv("DB_PORT", "3306")
DB_NAME = os.getenv("DB_NAME")

# Use MySQL if all variables are provided, otherwise fallback to SQLite
if all([DB_USER, DB_PASSWORD, DB_HOST, DB_NAME]):
    DATABASE_URL = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
else:
    # Use SQLite for easier local development
    DATABASE_URL = "sqlite:///./cubeloan360.db"