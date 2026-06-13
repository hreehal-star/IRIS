from pydantic import BaseModel
from datetime import datetime

class NormalizedDisaster(BaseModel):
    id: str
    title: str
    type: str
    latitude: float
    longitude: float
    severity: float
    timestamp: datetime
    source: str