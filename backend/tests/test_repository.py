from datetime import datetime

from app.schemas.project import ProjectInfo
from app.schemas.simulation import SimulationProgress, SimulationFrame
from app.services.repository import ProjectRepository, SimulationRepository


def test_project_repository_persists_data(tmp_path):
    repo = ProjectRepository(base_dir=tmp_path)
    info = ProjectInfo(project_id="proj-test", name="demo.aedt", designs=[], last_modified=datetime.utcnow())
    repo.add(info, "C:/data/demo.aedt")
    repo.update_designs("proj-test", ["HFSSDesign1"])

    stored = repo.get("proj-test")
    assert stored is not None
    assert stored["path"].endswith("demo.aedt")

    listed = repo.list()
    assert listed[0].designs == ["HFSSDesign1"]


def test_simulation_repository_handles_progress_and_frames(tmp_path):
    repo = SimulationRepository(base_dir=tmp_path)
    progress = SimulationProgress(job_id="job-123", status="queued", submitted_at=datetime.utcnow())
    repo.upsert_progress(progress)

    fetched = repo.get_progress("job-123")
    assert fetched is not None
    assert fetched.status == "queued"

    frame = SimulationFrame(
        job_id="job-123",
        frame_index=0,
        image_url="/static/frame.png",
        data_snapshot={"param": "theta"},
        timestamp=datetime.utcnow(),
    )
    repo.add_frame(frame)

    frames = repo.list_frames("job-123")
    assert len(frames) == 1
    assert frames[0].image_url == "/static/frame.png"
