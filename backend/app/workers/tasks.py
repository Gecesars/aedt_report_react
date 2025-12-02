from __future__ import annotations

from datetime import datetime

from celery.utils.log import get_task_logger

from ..celery_app import celery_app
from ..schemas.simulation import SimulationVideoRequest, SimulationProgress
from ..services.video import VideoGenerator
from ..services.repository import simulation_repository

logger = get_task_logger(__name__)


@celery_app.task(bind=True)
def generate_simulation_video(self, design_id: str, payload: dict, job_id: str | None = None):
    request = SimulationVideoRequest(**payload)
    generator = VideoGenerator(design_id, request, job_id=job_id or self.request.id, frame_callback=simulation_repository.add_frame)
    submitted = datetime.utcnow()
    progress = SimulationProgress(
        job_id=generator.job_id,
        status="running",
        submitted_at=submitted,
        total_frames=generator.total_frames,
    )
    simulation_repository.upsert_progress(progress)
    logger.info("Iniciando geracao de video %s", generator.job_id)
    last_state = {}
    for state in generator.run_iter():
        last_state = state
        progress.progress = state["progress"]
        progress.current_frame = state["current_frame"]
        simulation_repository.upsert_progress(progress)
        self.update_state(state="PROGRESS", meta={"progress": state["progress"], "frame": state["current_frame"]})
    progress.status = "completed"
    simulation_repository.upsert_progress(progress)
    result = generator.finish()
    result.update(last_state)
    return result
