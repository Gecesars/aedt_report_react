from __future__ import annotations

from datetime import datetime
from pathlib import Path
from uuid import uuid4

from fastapi import APIRouter, File, UploadFile, HTTPException

from ..schemas.project import ProjectUploadResponse, ProjectOpenRequest, ProjectListResponse, ProjectInfo
from ..services.hfss_session import session_manager
from ..services.storage import storage
from ..services.repository import project_repository

router = APIRouter()


@router.post("/upload", response_model=ProjectUploadResponse)
async def upload_project(file: UploadFile = File(...)):
    if not file.filename:
        raise HTTPException(status_code=400, detail="Arquivo invalido")
    saved_path = storage.save_upload(file.filename, file.file)
    project_id = f"proj-{uuid4().hex[:8]}"
    info = ProjectInfo(
        project_id=project_id,
        name=file.filename,
        designs=[],
        last_modified=datetime.utcnow(),
    )
    project_repository.add(info, str(saved_path))
    return ProjectUploadResponse(project_id=project_id, filename=file.filename, stored_path=str(saved_path))


@router.post("/open")
def open_project(payload: ProjectOpenRequest):
    record = project_repository.get(payload.project_id)
    if not record:
        raise HTTPException(status_code=404, detail="Projeto nao encontrado")
    if not session_manager.app:
        try:
            session_manager.connect()
        except RuntimeError as exc:
            raise HTTPException(status_code=500, detail=str(exc))
    session_manager.open_project(Path(record["path"]))
    designs = session_manager.list_designs()
    project_repository.update_designs(payload.project_id, designs)
    return ProjectInfo(
        project_id=payload.project_id,
        name=record.get("name", payload.project_id),
        designs=designs,
        last_modified=record.get("last_modified"),
    )


@router.get("", response_model=ProjectListResponse)
def list_projects():
    return ProjectListResponse(projects=project_repository.list())
