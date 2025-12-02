from fastapi import APIRouter, HTTPException

from ..schemas.session import SessionStatus, SessionStartRequest
from ..services.hfss_session import session_manager

router = APIRouter()


@router.post("/connect", response_model=SessionStatus)
def connect_session():
    try:
        session_manager.connect()
    except RuntimeError as exc:
        raise HTTPException(status_code=500, detail=str(exc))
    return SessionStatus(**session_manager.metadata())


@router.post("/start", response_model=SessionStatus)
def start_session(payload: SessionStartRequest):
    try:
        session_manager.start_new(force=payload.force)
    except RuntimeError as exc:
        raise HTTPException(status_code=500, detail=str(exc))
    return SessionStatus(**session_manager.metadata())


@router.get("/status", response_model=SessionStatus)
def get_status():
    return SessionStatus(**session_manager.metadata())
