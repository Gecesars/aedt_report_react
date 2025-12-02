from __future__ import annotations

from datetime import datetime
from pydantic import BaseModel, Field


class ProjectUploadResponse(BaseModel):
    project_id: str
    filename: str
    stored_path: str


class ProjectOpenRequest(BaseModel):
    project_id: str
    open_in_gui: bool = Field(True, description="Mantem a GUI do AEDT focada no projeto carregado")


class ProjectInfo(BaseModel):
    project_id: str
    name: str
    designs: list[str] = Field(default_factory=list)
    last_modified: datetime | None = None


class ProjectListResponse(BaseModel):
    projects: list[ProjectInfo]
