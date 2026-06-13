import os
import csv
import httpx
from datetime import datetime
from dotenv import load_dotenv
from app.models import NormalizedDisaster

load_dotenv()
MAP_KEY = os.getenv("NASA_FIRMS_MAP_KEY", "DEMO_KEY")

# get data for the past day
FIRMS_URL = f"https://firms.modaps.eosdis.nasa.gov/api/area/csv/{MAP_KEY}/MODIS_NRT/world/1"

async def fetch_active_wildfires() -> list[NormalizedDisaster]:
    if MAP_KEY == "DEMO_KEY" or not MAP_KEY:
        print("No NASA FIRMS API key found. Skipping wildfires.")
        return []

    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(FIRMS_URL, timeout=15.0)
            response.raise_for_status()
        except Exception as e:
            print(f"FIRMS API Error: {e}")
            return []

    disasters = []
    
    # split text by lines and use CSV DictReader
    lines = response.text.strip().split('\n')
    reader = csv.DictReader(lines)

    for i, row in enumerate(reader):
        # filter out less severe fires to prevent lag
        frp = float(row.get('frp', 0))
        if frp < 50.0:
            continue
            
        lat = float(row.get('latitude', 0))
        lon = float(row.get('longitude', 0))
        date_str = row.get('acq_date', '')
        time_str = str(row.get('acq_time', '0000')).zfill(4)
        
        try:
            dt_str = f"{date_str} {time_str}"
            event_time = datetime.strptime(dt_str, "%Y-%m-%d %H%M")
        except ValueError:
            event_time = datetime.now()

        disasters.append(NormalizedDisaster(
            id = f"firms-{i}",
            title = f"Wildfire (FRP: {frp})",
            type = "wildfire",
            latitude = lat,
            longitude = lon,
            severity = frp / 100.0, # scale down FRP to resemble earthquake 1-10 severity range
            timestamp = event_time,
            source = "NASA FIRMS"
        ))

    return disasters