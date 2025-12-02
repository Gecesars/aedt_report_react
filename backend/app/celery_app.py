from __future__ import annotations

from celery import Celery

from .config import settings

celery_app = Celery(
    "hfss_tasks",
    broker=settings.broker_url,
    backend=settings.result_backend,
)
celery_app.conf.update(
    task_default_queue="hfss",
    task_routes={"app.workers.tasks.*": {"queue": "hfss"}},
)
