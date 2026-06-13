from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.services.usgs import fetch_recent_earthquakes
from app.models import NormalizedDisaster
import asyncio
from app.services.firms import fetch_active_wildfires
from app.services.reliefweb import fetch_humanitarian_crises

app = FastAPI(title = "Global Disaster Information API")

app.add_middleware(
    CORSMiddleware,
    allow_origins = ["http://localhost:5173"], 
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"],
)

@app.get("/api/disasters", response_model=list[NormalizedDisaster])
async def get_active_disasters():
    results = await asyncio.gather(
        fetch_recent_earthquakes(),
        fetch_active_wildfires(),
        # fetch_humanitarian_crises(),
        return_exceptions=True
    )

    all_disasters = []
    for result in results:
        if isinstance(result, list):
            all_disasters.extend(result)
            
    all_disasters.sort(key=lambda x: x.timestamp, reverse=True)
            
    return all_disasters
