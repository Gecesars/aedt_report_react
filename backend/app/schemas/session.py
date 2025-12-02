from __future__ import annotations

from pydantic import BaseModel, Field


class SessionStatus(BaseModel):
    status: str = Field(..., description="Estado atual da sessao com o AEDT")
    session_id: str | None = Field(default=None, description="Identificador logico da sessao")
    aedt_version: str | None = None
    current_project: str | None = None
    current_design: str | None = None
    has_open_project: bool = False


class SessionStartRequest(BaseModel):
    force: bool = Field(False, description="Se verdadeiro, encerra a sessao anterior e cria uma nova GUI")
