from __future__ import annotations

from datetime import datetime
from pydantic import BaseModel, Field


class TracePoint(BaseModel):
    frequency_hz: float
    magnitude_db: float
    phase_deg: float
    vswr: float | None = None


class TraceData(BaseModel):
    name: str
    points: list[TracePoint]


class SParameterResponse(BaseModel):
    design_id: str
    traces: list[TraceData]


class RadiationCut(BaseModel):
    plane: str
    frequency_hz: float
    theta: list[float]
    gain_db: list[float]


class RadiationResponse(BaseModel):
    design_id: str
    cuts: list[RadiationCut] = Field(default_factory=list)
    heatmap_url: str | None = None


class GeometryImage(BaseModel):
    design_id: str
    view: str
    url: str
    updated_at: datetime
