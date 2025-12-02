from __future__ import annotations

from datetime import datetime
from time import sleep
from typing import Callable, Iterable
from uuid import uuid4

from ..schemas.simulation import SimulationVideoRequest, SimulationFrame
from .storage import storage


FrameCallback = Callable[[SimulationFrame], None]


class VideoGenerator:
    def __init__(self, design_id: str, payload: SimulationVideoRequest, job_id: str | None = None, frame_callback: FrameCallback | None = None):
        self.design_id = design_id
        self.payload = payload
        self.job_id = job_id or f"job-{uuid4().hex[:8]}"
        self.frame_callback = frame_callback
        self.total_frames = min(payload.max_frames, 120)

    def run_iter(self) -> Iterable[dict]:
        for frame_idx in range(self.total_frames):
            sleep(0.05)  # placeholder; integracao real usaria PyAEDT
            frame = self._emit_frame(frame_idx)
            if self.frame_callback:
                self.frame_callback(frame)
            yield {
                "progress": (frame_idx + 1) / self.total_frames * 100,
                "current_frame": frame_idx + 1,
                "frame": frame,
            }

    def _emit_frame(self, frame_idx: int) -> SimulationFrame:
        image_path = storage.artifact_path("videos", f"{self.job_id}_{frame_idx:04d}.png")
        image_path.write_bytes(b"frame")
        return SimulationFrame(
            job_id=self.job_id,
            frame_index=frame_idx,
            image_url=storage.public_url(image_path),
            data_snapshot={"parameter": self.payload.parameters[:], "index": frame_idx},
            timestamp=datetime.utcnow(),
        )

    def finish(self) -> dict:
        return {"job_id": self.job_id, "status": "completed", "frames": self.total_frames}
