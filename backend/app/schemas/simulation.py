from __future__ import annotations

from datetime import datetime
from typing import Literal
from pydantic import BaseModel, Field


SimulationType = Literal["parametric", "source_motion", "sbr_plus"]


class SimulationVideoRequest(BaseModel):
    type: SimulationType
    parameters: list[str] = Field(default_factory=list, description="Lista de parametros varridos")
    frame_rate: int = Field(12, ge=1, le=60)
    max_frames: int = Field(120, gt=0)


class SimulationJob(BaseModel):
    job_id: str
    design_id: str
    status: str
    submitted_at: datetime


class SimulationProgress(BaseModel):
    job_id: str
    status: str
    progress: float = 0.0
    current_frame: int = 0
    total_frames: int | None = None
    message: str | None = None
    submitted_at: datetime


class SimulationFrame(BaseModel):
    job_id: str
    frame_index: int
    image_url: str
    data_snapshot: dict | None = None
    timestamp: datetime


class SimulationFramesResponse(BaseModel):
    job_id: str
    frames: list[SimulationFrame]
