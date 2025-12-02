from pathlib import Path
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    aedt_version: str = "2025.2"
    storage_dir: Path = Path("data")
    upload_dir: Path = Path("data/uploads")
    redis_url: str = "redis://localhost:6379/0"
    celery_broker_url: str | None = None
    celery_result_backend: str | None = None
    cors_allow_origins: list[str] = ["http://localhost:5173", "http://127.0.0.1:5173"]
    log_level: str = "INFO"

    class Config:
        env_file = ".env"

    @property
    def broker_url(self) -> str:
        return self.celery_broker_url or self.redis_url

    @property
    def result_backend(self) -> str:
        return self.celery_result_backend or self.redis_url


settings = Settings()
settings.storage_dir.mkdir(parents=True, exist_ok=True)
settings.upload_dir.mkdir(parents=True, exist_ok=True)
