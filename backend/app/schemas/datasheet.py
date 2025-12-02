from __future__ import annotations

from datetime import datetime
from pydantic import BaseModel, Field

from .design import DesignSummary
from .results import SParameterResponse, RadiationResponse, GeometryImage


class DatasheetSection(BaseModel):
    title: str
    description: str | None = None
    highlights: list[str] = Field(default_factory=list)


class DatasheetResponse(BaseModel):
    design_id: str
    generated_at: datetime
    summary: DesignSummary
    sparameters: SParameterResponse
    radiation: RadiationResponse
    geometry: GeometryImage | None = None
    sections: list[DatasheetSection] = Field(default_factory=list)
    notes: list[str] = Field(default_factory=list)
