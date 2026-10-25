from app.api.routes_innovations import router as innovations_router
from app.api.routes_assessments import router as assessments_router
from app.api.routes_scenarios import router as scenarios_router
from app.api.routes_stt import router as stt_router
from app.api.routes_knowledge import router as knowledge_router

__all__ = [
    "innovations_router",
    "assessments_router",
    "scenarios_router",
    "stt_router",
    "knowledge_router",
]
