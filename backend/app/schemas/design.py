from __future__ import annotations

from pydantic import BaseModel, Field


class PortInfo(BaseModel):
    name: str
    type: str
    impedance: float | None = None


class SetupInfo(BaseModel):
    name: str
    sweep: str | None = None
    solution_type: str | None = None


class MetricSummary(BaseModel):
    gain_max_db: float | None = None
    beamwidth_deg: float | None = None
    front_to_back_db: float | None = None
    efficiency: float | None = None


class DesignSummary(BaseModel):
    design_id: str
    name: str
    design_type: str
    frequency_range: str | None = None
    ports: list[PortInfo] = Field(default_factory=list)
    setups: list[SetupInfo] = Field(default_factory=list)
    metrics: MetricSummary = Field(default_factory=MetricSummary)
