import os
import re
import numpy as np
from typing import List, Tuple, Optional
from sentence_transformers import SentenceTransformer
from backend.models import LegalChunk
from backend.ingest import LegalCorpusIngestor

class HybridLegalVectorStore:
    def __init__(self, ingestor: LegalCorpusIngestor, model_name: str = "all-MiniLM-L6-v2"):
        self.ingestor = ingestor
        self.model = SentenceTransformer(model_name)
        self.chunks: List[LegalChunk] = []
        self.embeddings = None
        self._build_index()

    def _build_index(self):
        self.chunks = self.ingestor.get_all_chunks()
        if not self.chunks:
            return
        
        texts = [
            f"{c.act_title} {c.section} {c.title}: {c.legal_text} {c.explanation or ''} {' '.join(c.keywords)}"
            for c in self.chunks
        ]
        self.embeddings = self.model.encode(texts, convert_to_numpy=True, normalize_embeddings=True)

    def search(self, query: str, jurisdiction: str = "all", topic: Optional[str] = None, top_k: int = 5) -> List[Tuple[LegalChunk, float]]:
        if not self.chunks or self.embeddings is None:
            return []

        query_emb = self.model.encode([query], convert_to_numpy=True, normalize_embeddings=True)[0]
        query_lower = query.lower()
        query_words = set(re.findall(r"\w+", query_lower))

        results = []
        for idx, chunk in enumerate(self.chunks):
            # 1. Jurisdiction check
            j_lower = chunk.jurisdiction.lower()
            if jurisdiction.lower() == "india" and "india" not in j_lower:
                continue
            if jurisdiction.lower() == "international" and "international" not in j_lower:
                continue

            # 2. Dense Cosine Similarity
            dense_sim = float(np.dot(query_emb, self.embeddings[idx]))

            # 3. Sparse Keyword Match
            chunk_text = f"{chunk.act_title} {chunk.section} {chunk.title} {chunk.legal_text}".lower()
            overlap_count = sum(1 for w in query_words if len(w) > 3 and w in chunk_text)
            sparse_score = min(overlap_count * 0.15, 1.0)

            # 4. Exact Section & Act Boost
            section_boost = 0.0
            sec_clean = chunk.section.lower().replace("section", "").replace("rule", "").replace("article", "").strip()
            if sec_clean and sec_clean in query_lower:
                section_boost = 0.35

            # Combine scores
            final_score = (0.50 * dense_sim) + (0.25 * sparse_score) + (0.25 * section_boost)
            results.append((chunk, final_score))

        results.sort(key=lambda x: x[1], reverse=True)
        return results[:top_k]
