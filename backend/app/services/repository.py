from __future__ import annotations

import json
from pathlib import Path
from typing import Any

from ..config import settings
from ..schemas.project import ProjectInfo
from ..schemas.simulation import SimulationProgress, SimulationFrame


class JsonStore:
    def __init__(self, filename: str, default: dict[str, Any] | list[Any], base_dir: Path | None = None):
        base = base_dir or settings.storage_dir
        self.path = base / filename
        self._default = default
        self._data: dict | list = json.loads(json.dumps(default)) if isinstance(default, dict) else list(default)
        self.path.parent.mkdir(parents=True, exist_ok=True)
        self._load()

    def _load(self) -> None:
        if self.path.exists():
            try:
                self._data = json.loads(self.path.read_text(encoding="utf-8"))
            except json.JSONDecodeError:
                self._data = json.loads(json.dumps(self._default)) if isinstance(self._default, dict) else list(self._default)

    def save(self) -> None:
        self.path.write_text(json.dumps(self._data, ensure_ascii=False, indent=2), encoding="utf-8")

    @property
    def data(self):
        return self._data


class ProjectRepository:
    def __init__(self, base_dir: Path | None = None) -> None:
        self.store = JsonStore("projects.json", {}, base_dir)

    def add(self, project_info: ProjectInfo, path: str) -> None:
        self.store.data[project_info.project_id] = {
            "name": project_info.name,
            "designs": project_info.designs,
            "last_modified": project_info.last_modified.isoformat() if project_info.last_modified else None,
            "path": path,
        }
        self.store.save()

    def update_designs(self, project_id: str, designs: list[str]) -> None:
        if project_id in self.store.data:
            self.store.data[project_id]["designs"] = designs
            self.store.save()

    def get(self, project_id: str) -> dict[str, Any] | None:
        return self.store.data.get(project_id)

    def list(self) -> list[ProjectInfo]:
        infos: list[ProjectInfo] = []
        for pid, payload in self.store.data.items():
            infos.append(
                ProjectInfo(
                    project_id=pid,
                    name=payload.get("name", pid),
                    designs=payload.get("designs", []),
                    last_modified=payload.get("last_modified"),
                )
            )
        return infos


class SimulationRepository:
    def __init__(self, base_dir: Path | None = None) -> None:
        self.progress_store = JsonStore("sim_jobs.json", {}, base_dir)
        self.frames_store = JsonStore("sim_frames.json", {}, base_dir)

    def upsert_progress(self, progress: SimulationProgress) -> None:
        self.progress_store.data[progress.job_id] = progress.model_dump()
        self.progress_store.save()

    def get_progress(self, job_id: str) -> SimulationProgress | None:
        data = self.progress_store.data.get(job_id)
        if not data:
            return None
        return SimulationProgress(**data)

    def add_frame(self, frame: SimulationFrame) -> None:
        self.frames_store.data.setdefault(frame.job_id, []).append(frame.model_dump())
        self.frames_store.save()

    def list_frames(self, job_id: str) -> list[SimulationFrame]:
        return [SimulationFrame(**frame) for frame in self.frames_store.data.get(job_id, [])]


project_repository = ProjectRepository()
simulation_repository = SimulationRepository()
