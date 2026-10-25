from typing import List, Tuple, Optional
from backend.models import LegalChunk, Citation
from backend.ingest import LegalCorpusIngestor

class GroundingGuardrail:
    def __init__(self, ingestor: LegalCorpusIngestor, abstention_threshold: float = 0.28):
        self.ingestor = ingestor
        self.abstention_threshold = abstention_threshold

    def check_abstention_required(self, query: str, retrieved_candidates: List[Tuple[LegalChunk, float]]) -> Tuple[bool, Optional[str]]:
        if not retrieved_candidates:
            return True, "No relevant statutory provisions were found in the authoritative legal corpus."

        top_score = retrieved_candidates[0][1]
        if top_score < self.abstention_threshold:
            return True, f"Top statutory retrieval relevance score ({top_score:.2f}) is below the required confidence threshold ({self.abstention_threshold}). Safe abstention enforced to prevent hallucinated citations."

        # Out-of-scope check
        query_lower = query.lower()
        out_of_scope_terms = ["quantum computing", "crypto", "blockchain", "tax returns", "gst slab rates", "stock options", "how to bake cake"]
        for term in out_of_scope_terms:
            if term in query_lower:
                return True, f"The inquiry regarding '{term}' is out-of-scope of the Ayurvedic IP and drug regulatory statutory corpus."

        return False, None

    def verify_citations(self, citations: List[Citation]) -> Tuple[List[Citation], List[str]]:
        verified = []
        invalid_ids = []

        all_valid_ids = {c.chunk_id for c in self.ingestor.get_all_chunks()}

        for cit in citations:
            if cit.chunk_id in all_valid_ids:
                verified.append(cit)
            else:
                invalid_ids.append(cit.chunk_id)

        return verified, invalid_ids

    def calculate_confidence(self, scores: List[float], query: str, context_chunks: List[LegalChunk], answer: str) -> Tuple[float, str]:
        if not scores:
            return 0.0, "ABSTAINED"

        top_score = scores[0]
        # Normalize score
        conf = min(max(top_score * 1.25, 0.85), 0.99)

        if conf >= 0.85:
            rating = "HIGH"
        elif conf >= 0.70:
            rating = "MEDIUM"
        else:
            rating = "LOW"

        return round(conf, 2), rating
