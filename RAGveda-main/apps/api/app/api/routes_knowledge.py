from fastapi import APIRouter, Query
from typing import List, Dict, Any, Optional
from app.knowledge.corpus import STATUTORY_SOURCES
from app.retrieval.hybrid_search import retriever
from app.schemas.assessment import Citation

router = APIRouter(prefix="/knowledge", tags=["Knowledge & Retrieval"])

@router.get("/sources")
def list_statutory_sources(jurisdiction: Optional[str] = Query(None)):
    sources = STATUTORY_SOURCES
    if jurisdiction and jurisdiction != "ALL":
        sources = [s for s in sources if s.get("jurisdiction") == jurisdiction]
    return sources

@router.get("/search", response_model=List[Citation])
def search_evidence(
    query: str,
    jurisdiction: str = Query("IN", description="IN or INT"),
    limit: int = Query(5, ge=1, le=20)
):
    return retriever.search(query=query, jurisdiction=jurisdiction, limit=limit)
