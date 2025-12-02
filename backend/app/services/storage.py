from __future__ import annotations

from pathlib import Path
from typing import BinaryIO
from uuid import uuid4

from ..config import settings


class StorageService:
    base_dir: Path = settings.storage_dir

    def save_upload(self, filename: str, file_obj: BinaryIO) -> Path:
        dest = settings.upload_dir / f"{uuid4().hex}_{Path(filename).name}"
        dest.parent.mkdir(parents=True, exist_ok=True)
        with open(dest, "wb") as f:
            f.write(file_obj.read())
        return dest

    def artifact_path(self, *parts: str) -> Path:
        dest = self.base_dir.joinpath(*parts)
        dest.parent.mkdir(parents=True, exist_ok=True)
        return dest

    def public_url(self, path: Path) -> str:
        # Em ambiente real, serviria via CDN/S3. Aqui usamos caminho relativo.
        return f"/static/{path.name}"


storage = StorageService()
