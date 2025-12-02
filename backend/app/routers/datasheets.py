from __future__ import annotations

from fastapi import APIRouter

from ..schemas.datasheet import DatasheetResponse
from ..services.datasheet import build_datasheet

router = APIRouter()


@router.get("/{design_id}", response_model=DatasheetResponse)
def get_datasheet(design_id: str):
    return build_datasheet(design_id)
