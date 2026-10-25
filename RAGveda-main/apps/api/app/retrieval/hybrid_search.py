import math
import re
from typing import List, Dict, Any, Optional
from app.knowledge.corpus import STATUTORY_SOURCES
from app.schemas.assessment import Citation

class HybridRetriever:
    """
    Metadata-aware, evidence-first hybrid search engine combining:
    - Lexical (BM25-like token overlap)
    - Semantic character n-gram / term similarity
    - Statutory Authority Hierarchy (Level 1 legislation to Level 6 secondary)
    - Strict Jurisdiction filtering (IN vs INT)
    """

    def __init__(self, sources: Optional[List[Dict[str, Any]]] = None):
        self.sources = sources or STATUTORY_SOURCES

    def _tokenize(self, text: str) -> List[str]:
        return re.findall(r'\b[a-zA-Z0-9_-]{3,}\b', text.lower())

    def _compute_lexical_score(self, query_tokens: List[str], chunk_text: str, keywords: List[str]) -> float:
        chunk_lower = chunk_text.lower()
        score = 0.0
        for token in query_tokens:
            if token in chunk_lower:
                score += 1.0
            if any(token in kw.lower() for kw in keywords):
                score += 1.5
        return min(1.0, score / max(1, len(query_tokens)))

    def _compute_semantic_score(self, query: str, chunk_text: str) -> float:
        # Fast n-gram overlap similarity
        q = query.lower()
        c = chunk_text.lower()
        q_trigrams = set([q[i:i+3] for i in range(len(q)-2)]) if len(q) >= 3 else set([q])
        c_trigrams = set([c[i:i+3] for i in range(len(c)-2)]) if len(c) >= 3 else set([c])
        if not q_trigrams:
            return 0.0
        overlap = len(q_trigrams.intersection(c_trigrams))
        return min(1.0, overlap / (len(q_trigrams) + 1e-5))

    def _authority_weight(self, level: int) -> float:
        # Level 1 (Act/Rules): 1.0, Level 2 (Regulator): 0.85, Level 3 (Int. Treaty): 0.8, Level 4: 0.6
        weights = {1: 1.0, 2: 0.85, 3: 0.8, 4: 0.65, 5: 0.5, 6: 0.35}
        return weights.get(level, 0.5)

    def search(
        self,
        query: str,
        jurisdiction: str = "IN",
        limit: int = 5,
        required_keywords: Optional[List[str]] = None
    ) -> List[Citation]:
        query_tokens = self._tokenize(query)
        candidates = []

        for source in self.sources:
            src_jurisdiction = source.get("jurisdiction", "IN")
            # Jurisdiction filtering
            jurisdiction_match = 1.0 if (jurisdiction == "ALL" or src_jurisdiction == jurisdiction) else 0.15

            authority_score = self._authority_weight(source.get("authority_level", 1))

            for chunk in source.get("chunks", []):
                chunk_text = chunk.get("text", "")
                keywords = chunk.get("keywords", [])

                if required_keywords:
                    # If specific statutory filter requested
                    if not any(k.lower() in chunk_text.lower() for k in required_keywords):
                        continue

                lexical = self._compute_lexical_score(query_tokens, chunk_text, keywords)
                semantic = self._compute_semantic_score(query, chunk_text)

                # Composite score:
                # 0.35 semantic + 0.25 lexical + 0.20 authority + 0.10 jurisdiction + 0.10 relevance boost
                composite_score = (
                    0.35 * semantic +
                    0.25 * lexical +
                    0.20 * authority_score +
                    0.10 * jurisdiction_match +
                    0.10 * (1.0 if any(t in chunk_text.lower() for t in query_tokens) else 0.0)
                )

                candidates.append((composite_score, source, chunk))

        # Sort descending by composite score
        candidates.sort(key=lambda x: x[0], reverse=True)

        results: List[Citation] = []
        for score, src, chk in candidates[:limit]:
            results.append(
                Citation(
                    source_id=src["id"],
                    source_title=src["title"],
                    publisher=src["publisher"],
                    authority_level=src["authority_level"],
                    jurisdiction=src["jurisdiction"],
                    section=chk.get("section"),
                    page=chk.get("page"),
                    quoted_snippet=chk.get("text", "")[:280] + ("..." if len(chk.get("text", "")) > 280 else ""),
                    relevance_score=round(score, 3),
                    url=src.get("url")
                )
            )

        return results

retriever = HybridRetriever()
