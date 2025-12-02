from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import settings
from .routers import session, projects, designs, simulations, datasheets

app = FastAPI(
    title="HFSS Control API",
    description="Camada REST para orquestrar sess\u00f5es AEDT/HFSS via PyAEDT.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_allow_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(session.router, prefix="/session", tags=["session"])
app.include_router(projects.router, prefix="/projects", tags=["projects"])
app.include_router(designs.router, prefix="/designs", tags=["designs"])
app.include_router(simulations.router, prefix="/simulations", tags=["simulations"])\napp.include_router(datasheets.router, prefix="/datasheets", tags=["datasheets"])


@app.get("/health")
def health_check():
    return {"status": "ok", "aedt_version": settings.aedt_version}

