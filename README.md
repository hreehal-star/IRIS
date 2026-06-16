# IRIS: Global Disaster Dashboard

> A real-time spatial intelligence platform that tracks and visualizes global natural disasters and humanitarian crises using live telemetry and a 3D WebGL interface.

![IRIS Dashboard Demo](./IRIS_Demo.gif)

## Overview
IRIS (Interactive Regional Intelligence System) is designed to aggregate, normalize, and visualize concurrent streams of disaster data. 

### Core Features
* **Real-Time Telemetry Streaming:** Implemented a persistent WebSocket connection, injecting live global events instantly into the frontend state.
* **Hardware-Accelerated 3D WebGL Globe:** A custom-built Three.js sphere with dynamic spatial coordinate mapping, orbit controls, and automated camera targeting.
* **Heuristic Advisory Engine:** An automated spatial analysis pipeline that calculates estimated impact radii and generates localized, practical public safety advisories based on disaster severity and classification.


## Architecture & Tech Stack

**Frontend Pipeline**
* **React 18** (Vite)
* **Three.js & React Three Fiber / Drei** (3D Rendering & Camera Control)
* **Tailwind CSS v4** (Utility-first styling & UI layer)
* **TanStack React Query** (Asynchronous state management & caching)

**Backend Pipeline**
* **Python 3 / FastAPI** (Asynchronous API & WebSocket Manager)
* **Uvicorn** (ASGI Web Server)
* **Asyncio** (Concurrent background tasks & event injection)

**Data Ingestion Sources**
* **USGS API:** Seismological activity and global earthquakes.
* **NASA FIRMS:** Near real-time active fire data and thermal anomalies.
* **ReliefWeb (UN OCHA):** Active humanitarian crises and severe weather events.

## Local Setup & Installation

### Prerequisites
* Node.js (v18+)
* Python (v3.10+)
* A free [NASA FIRMS API Key](https://firms.modaps.eosdis.nasa.gov/api/)

### 1. Backend Configuration
Navigate to the `backend` directory and set up your Python environment:

```bash
cd backend
python -m venv venv

# Activate the virtual environment
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

# Install dependencies (Assuming a requirements.txt exists)
pip install fastapi uvicorn websockets httpx