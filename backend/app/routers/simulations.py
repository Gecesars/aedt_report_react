from __future__ import annotations

from datetime import datetime
from uuid import uuid4

from fastapi import APIRouter, HTTPException

from ..schemas.simulation import (
    SimulationVideoRequest,
    SimulationJob,
    SimulationProgress,
    SimulationFramesResponse,
)
from ..services.video import VideoGenerator
from ..workers import tasks
from ..services.repository import simulation_repository

router = APIRouter()


def _sync_generate(design_id: str, payload: SimulationVideoRequest, job_id: str, submitted_at: datetime) -> str:
    generator = VideoGenerator(design_id, payload, job_id=job_id, frame_callback=simulation_repository.add_frame)
    progress = SimulationProgress(
        job_id=job_id,
        status="running",
        progress=0.0,
        current_frame=0,
        total_frames=generator.total_frames,
        submitted_at=submitted_at,
    )
    simulation_repository.upsert_progress(progress)
    for state in generator.run_iter():
        progress.progress = state["progress"]
        progress.current_frame = state["current_frame"]
        simulation_repository.upsert_progress(progress)
    progress.status = "completed"
    simulation_repository.upsert_progress(progress)
    return job_id


@router.post("/{design_id}/videos", response_model=SimulationJob)
def create_video(design_id: str, payload: SimulationVideoRequest):
    submitted = datetime.utcnow()
    job_id = f"job-{uuid4().hex[:8]}"
    progress = SimulationProgress(job_id=job_id, status="queued", submitted_at=submitted)
    simulation_repository.upsert_progress(progress)
    try:
        tasks.generate_simulation_video.apply_async((design_id, payload.model_dump(), job_id), task_id=job_id)
    except Exception:
        _sync_generate(design_id, payload, job_id, submitted)
    return SimulationJob(job_id=job_id, design_id=design_id, status="queued", submitted_at=submitted)


@router.get("/{job_id}", response_model=SimulationProgress)
def get_progress(job_id: str):
    progress = simulation_repository.get_progress(job_id)
    if not progress:
        raise HTTPException(status_code=404, detail="Job nao encontrado")
    return progress


@router.get("/{job_id}/frames", response_model=SimulationFramesResponse)
def list_frames(job_id: str):
    frames = simulation_repository.list_frames(job_id)
    if not frames:
        raise HTTPException(status_code=404, detail="Frames nao encontrados")
    return SimulationFramesResponse(job_id=job_id, frames=frames)
