from __future__ import annotations

from datetime import datetime

from ..schemas.datasheet import DatasheetResponse, DatasheetSection
from ..schemas.design import DesignSummary
from ..schemas.results import SParameterResponse, RadiationResponse, GeometryImage
from .extractors import get_design_summary, get_sparameters, get_radiation, get_geometry_image


def build_datasheet(design_id: str) -> DatasheetResponse:
    summary: DesignSummary = get_design_summary(design_id)
    sparams: SParameterResponse = get_sparameters(design_id)
    radiation: RadiationResponse = get_radiation(design_id)
    geometry: GeometryImage | None = None
    try:
        geometry = get_geometry_image(design_id, "isometric")
    except Exception:
        geometry = None

    sections = [
        DatasheetSection(
            title="Resumo eletrico",
            highlights=[
                f"Faixa de frequencia: {summary.frequency_range}",
                f"Ganho maximo: {summary.metrics.gain_max_db} dBi",
                f"Largura de feixe: {summary.metrics.beamwidth_deg} graus",
            ],
        ),
        DatasheetSection(
            title="S-Parametros",
            description="Curvas chave de retorno e acoplamento",
            highlights=[f"Traces: {', '.join(trace.name for trace in sparams.traces)}"],
        ),
        DatasheetSection(
            title="Radiacao",
            description="Cortes E/H e heatmap theta/phi",
            highlights=[f"Cortes disponiveis: {len(radiation.cuts)}"],
        ),
    ]

    notes = [
        "Dados extraidos diretamente do HFSS via PyAEDT.",
        "Valores sujeitos a atualizacao apos nova simulacao ou iteracao de projeto.",
    ]

    return DatasheetResponse(
        design_id=design_id,
        generated_at=datetime.utcnow(),
        summary=summary,
        sparameters=sparams,
        radiation=radiation,
        geometry=geometry,
        sections=sections,
        notes=notes,
    )
