from typing import List, Tuple
from backend.models import LegalChunk

class LegalReranker:
    def __init__(self):
        pass

    def rerank(self, candidates: List[Tuple[LegalChunk, float]], query: str) -> List[Tuple[LegalChunk, float]]:
        if not candidates:
            return []

        query_lower = query.lower()
        reranked = []

        for chunk, score in candidates:
            multiplier = 1.0
            
            # Statutory Hierarchy: Primary Acts have higher precedence
            if "act" in chunk.act_title.lower() or "treaty" in chunk.act_title.lower():
                multiplier += 0.10

            # Direct keyword relevance
            for kw in chunk.keywords:
                if kw.lower() in query_lower:
                    multiplier += 0.08

            reranked.append((chunk, score * multiplier))

        reranked.sort(key=lambda x: x[1], reverse=True)
        return reranked
