from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.services.usgs import fetch_recent_earthquakes
from app.models import NormalizedDisaster

app = FastAPI(title = "Global Disaster Information API")

# Allow your React frontend (usually running on port 5173) to talk to this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins = ["http://localhost:5173"], 
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"],
)

@app.get("/api/disasters", response_model=list[NormalizedDisaster])
async def get_active_disasters():
    earthquakes = await fetch_recent_earthquakes()
    return earthquakes