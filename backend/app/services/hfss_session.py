from __future__ import annotations

from pathlib import Path
from typing import Optional

from loguru import logger

try:  # PyAEDT so estara disponivel em ambiente Windows com AEDT instalado
    from pyaedt import Desktop, Hfss
except ImportError:  # fallback para desenvolvimento sem AEDT
    Desktop = None  # type: ignore
    Hfss = None  # type: ignore

from ..config import settings


def _ensure_pyaedt() -> None:
    if Desktop is None or Hfss is None:
        raise RuntimeError("PyAEDT nao esta disponivel no ambiente ativo")


class HFSSSessionManager:
    """Gerencia ciclo de vida do Desktop AEDT 2025.2 com GUI."""

    def __init__(self, version: str):
        self.version = version
        self.desktop: Optional[Desktop] = None  # type: ignore[assignment]
        self.app: Optional[Hfss] = None  # type: ignore[assignment]
        self.session_id = "sess-001"

    def connect(self) -> None:
        _ensure_pyaedt()
        if self.desktop:
            logger.debug("Sessao existente detectada, reutilizando.")
            return
        logger.info("Conectando a sessao AEDT existente (se houver).")
        self.desktop = Desktop(
            specified_version=self.version,
            new_desktop=False,
            non_graphical=False,
            close_on_exit=False,
        )
        self.app = Hfss(desktop_instance=self.desktop)  # type: ignore[call-arg]

    def start_new(self, force: bool = False) -> None:
        _ensure_pyaedt()
        if force:
            self.close()
        logger.info("Iniciando nova instancia do AEDT {version}", version=self.version)
        self.desktop = Desktop(
            specified_version=self.version,
            new_desktop=True,
            non_graphical=False,
            close_on_exit=False,
        )
        self.app = Hfss(desktop_instance=self.desktop)  # type: ignore[call-arg]

    def close(self) -> None:
        if self.desktop:
            logger.info("Encerrando sessao do AEDT.")
            try:
                self.desktop.release_desktop(close_projects=True, close_desktop=True)
            except Exception as exc:  # pragma: no cover - apenas log
                logger.warning("Falha ao liberar AEDT: {}", exc)
        self.desktop = None
        self.app = None

    def open_project(self, project_path: Path) -> None:
        if not self.app:
            raise RuntimeError("Sessao HFSS nao inicializada")
        logger.info("Abrindo projeto {}", project_path)
        self.app.open_project(project_path.as_posix())

    def metadata(self) -> dict:
        return {
            "session_id": self.session_id,
            "status": "ready" if self.app else "disconnected",
            "aedt_version": self.version,
            "current_project": getattr(self.app, "project_name", None),
            "current_design": getattr(self.app, "design_name", None),
        }

    def list_designs(self) -> list[str]:
        if not self.app:
            return []
        return list(self.app.design_list)


session_manager = HFSSSessionManager(settings.aedt_version)
