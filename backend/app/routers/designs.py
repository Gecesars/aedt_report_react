from __future__ import annotations

from fastapi import APIRouter

from ..schemas.design import DesignSummary
from ..schemas.results import SParameterResponse, RadiationResponse, GeometryImage
from ..services.extractors import get_design_summary, get_sparameters, get_radiation, get_geometry_image

router = APIRouter()


@router.get("/{design_id}/summary", response_model=DesignSummary)
def design_summary(design_id: str):
    return get_design_summary(design_id)


@router.get("/{design_id}/sparameters", response_model=SParameterResponse)
def design_sparameters(design_id: str):
    return get_sparameters(design_id)


@router.get("/{design_id}/radiation", response_model=RadiationResponse)
def design_radiation(design_id: str):
    return get_radiation(design_id)


@router.get("/{design_id}/images/geometry", response_model=GeometryImage)
def design_geometry(design_id: str, view: str = "isometric"):
    return get_geometry_image(design_id, view)
