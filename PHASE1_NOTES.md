1. Auth Service
Problem: The Auth service was not loading the environment variables required for its configuration.

Error / Cause: The project was using environment variables from a .env file, but the dotenv package was not installed/loaded correctly.

Fix:  we installed dotenv inside the Auth service by npm install dotenv
Then we modified the Auth service entry file to load the .env variables:
require('dotenv').config();
This was added at the beginning of the application so the environment variables are loaded before the service uses them.
also there is typoerror  in JWT_SECERT

2. Frontend
The frontend was configured to send API requests to: http://localhost:8080
there was no gateway service running on port 8080 in Phase 1.

Fix: i did a gateway to link between front and services on port 8080

3. Catalog Service CORS Problem
The Catalog API worked from the terminal ,but the React frontend could not fetch it and showed:

The issue was caused by the browser's same-origin policy because the frontend runs on: http://localhost:3000
while the Catalog service runs on:http://localhost:8081
Fix: We configured CORS in the Catalog service to allow requests from

4. Analytics Service CORS Problem
The Analytics API worked correctly using curl , However, the React Dashboard showed: Failed to load analytics: Failed to fetch
The browser was blocking the cross-origin request from:http://localhost:3000 to http://localhost:8085 
so we add CORSMiddleware
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

5. Booking Service / RabbitMQ Notification
Problem: The Booking API created bookings successfully, but the Notification Worker was not receiving booking events. The Booking Service 
The Booking Service was not loading the `.env` file, so `RABBITMQ_URL` and `RABBITMQ_QUEUE` were not available to the application.

Fix: We used `python-dotenv` and modified `app/main.py` to load the `.env` file:
from dotenv import load_dotenv
from pathlib import Path
BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")
After creating a booking, the worker successfully received the event:


