from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from app.services.usgs import fetch_recent_earthquakes
from app.models import NormalizedDisaster
import asyncio
from app.services.firms import fetch_active_wildfires
from app.services.reliefweb import fetch_humanitarian_crises
import json
import random
from datetime import datetime
from app.services.event_report import generate_public_advisory
from fastapi import Request

app = FastAPI(title = "Global Disaster Information API")

app.add_middleware(
    CORSMiddleware,
    allow_origins = ["http://localhost:5173"], 
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"],
)
class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
        print(f"Uplink established. Active connections: {len(self.active_connections)}")

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)
        print(f"Uplink severed. Active connections: {len(self.active_connections)}")

    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            try:
                await connection.send_text(json.dumps(message))
            except Exception:
                pass

manager = ConnectionManager()

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

@app.websocket("/ws/telemetry")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)

async def injector_loop():
    await asyncio.sleep(5) # Let the server stabilize before injecting
    while True:
        await asyncio.sleep(random.randint(15, 20))
        if not manager.active_connections:
            continue

        is_fire = random.choice([True, False])
        simulated_event = {
            "id": f"sim-{random.randint(1000, 9999)}",
            "title": "Simulated Hotspot Detected" if is_fire else "Simulated Seismological Activity",
            "type": "wildfire" if is_fire else "earthquake",
            "latitude": random.uniform(-40.0, 60.0),
            "longitude": random.uniform(-120.0, 140.0),
            "severity": random.uniform(4.0, 9.5),
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "source": "SIM_STREAM"
        }
        
        print(f"Broadcasting stream injection: {simulated_event['id']}")
       # await manager.broadcast(simulated_event)

@app.post("/api/analyze")
async def analyze_disaster(request: Request):
    payload = await request.json()
    report = generate_public_advisory(payload)
    return report

#@asynccontextmanager
async def lifespan(app: FastAPI):
    injector_task = asyncio.create_task(injector_loop())
    yield
    injector_task.cancel()