import httpx
from datetime import datetime
from app.models import NormalizedDisaster

USGS_URL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"

async def fetch_recent_earthquakes() -> list[NormalizedDisaster]:
    async with httpx.AsyncClient() as client:
        response = await client.get(USGS_URL)
        response.raise_for_status()
        data = response.json()

    disasters = []
    
    for feature in data.get("features", []):
        properties = feature.get("properties", {})
        geometry = feature.get("geometry", {})
        
        # GeoJSON has coordinates stored as (longitude, latitude, depth)
        coordinates = geometry.get("coordinates", [0, 0])
        long, lat = coordinates[0], coordinates[1]
        time_ms = properties.get("time")
        event_time = datetime.fromtimestamp(time_ms / 1000.0) if time_ms else datetime.now()

        # create the NormalizedDisaster object
        disaster = NormalizedDisaster(
            id = feature.get("id", ""),
            title = properties.get("title", "Unknown Earthquake"),
            type = "earthquake",
            latitude = lat,
            longitude = long,
            severity = properties.get("mag", 0.0),
            timestamp = event_time,
            source = "USGS"
        )
        disasters.append(disaster)
        
    return disasters