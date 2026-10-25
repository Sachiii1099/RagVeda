from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import engine, Base
from app.api import (
    innovations_router,
    assessments_router,
    scenarios_router,
    stt_router,
    knowledge_router,
)

# Create database tables automatically
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Evidence-First AI Decision-Support Platform for Ayurvedic Innovation & Regulatory Navigation (Smart India Hackathon 2026)",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url=f"{settings.API_V1_STR}/docs"
)

# Enable CORS for local Vite dev server and external frontends
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(innovations_router, prefix=settings.API_V1_STR)
app.include_router(assessments_router, prefix=settings.API_V1_STR)
app.include_router(scenarios_router, prefix=settings.API_V1_STR)
app.include_router(stt_router, prefix=settings.API_V1_STR)
app.include_router(knowledge_router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {
        "name": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "status": "operational",
        "docs_url": f"{settings.API_V1_STR}/docs"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy", "database": "connected"}
