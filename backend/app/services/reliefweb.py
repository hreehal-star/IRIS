import httpx
from datetime import datetime
from app.models import NormalizedDisaster
import os
from dotenv import load_dotenv

load_dotenv()
RELIEFWEB_API = os.getenv("RELIEFWEB_API", "DEMO_KEY")

COUNTRY_CENTROIDS = {
    "Afghanistan": (33.939, 67.710),
    "Bangladesh": (23.685, 90.356),
    "Haiti": (18.971, -72.285),
    "Sudan": (12.862, 30.217),
    "Syrian Arab Republic": (34.802, 38.996),
    "Ukraine": (48.379, 31.165),
    "Yemen": (15.552, 48.516),
}

async def fetch_humanitarian_crises() -> list[NormalizedDisaster]:
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(RELIEFWEB_API, timeout=10.0)
            response.raise_for_status()
            data = response.json()
        except Exception as e:
            print(f"ReliefWeb API Error: {e}")
            return []

    disasters = []
    
    for item in data.get("data", []):
        fields = item.get("fields", {})
        title = fields.get("title", "Humanitarian Crisis")
        
        primary_country = fields.get("primary_country")
        if isinstance(primary_country, dict):
            country_name = primary_country.get("name", "Unknown")
        elif isinstance(primary_country, list) and len(primary_country) > 0:
            country_name = primary_country[0].get("name", "Unknown")
        else:
            country_name = "Unknown"
        
        lat, lon = COUNTRY_CENTROIDS.get(country_name, (0.0, 0.0))
        if lat == 0.0 and lon == 0.0:
            continue

        date_str = fields.get("date", {}).get("created")
        event_time = datetime.fromisoformat(date_str.replace("Z", "+00:00")) if date_str else datetime.now()

        disasters.append(NormalizedDisaster(
            id = item.get("id", "0"),
            title = title,
            type = "crisis",
            latitude = lat,
            longitude = lon,
            severity = 8.0, 
            timestamp = event_time,
            source = "ReliefWeb"
        ))

    return disasters
