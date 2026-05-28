from pydantic import BaseModel
from typing import Optional
from models import PlaceStatus

class PlaceBase(BaseModel):
    name: str
    type: str
    lat: float
    lng: float
    trust_score: int
    is_safe: bool
    status: PlaceStatus
    icon: Optional[str] = ""

class PlaceCreate(PlaceBase):
    pass

class PlaceResponse(PlaceBase):
    id: int

    class Config:
        from_attributes = True
