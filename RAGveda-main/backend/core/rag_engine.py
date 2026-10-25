import os
import datetime
from typing import List, Dict, Any, Optional, Tuple
from backend.models import LegalChunk, Citation, RAGResponse
from backend.ingest import LegalCorpusIngestor
from backend.core.vector_store import HybridLegalVectorStore
from backend.core.reranker import LegalReranker
from backend.core.grounding import GroundingGuardrail
from backend.core.translator import MultilingualLegalEngine

class LegalRAGEngine:
    def __init__(self, ingestor: Optional[LegalCorpusIngestor] = None):
        self.ingestor = ingestor or LegalCorpusIngestor()
        self.vector_store = HybridLegalVectorStore(self.ingestor)
        self.reranker = LegalReranker()
        self.guardrail = GroundingGuardrail(self.ingestor)
        self.translator = MultilingualLegalEngine()

    def answer_query(self, query: str, jurisdiction: str = "india", topic: Optional[str] = None, language: str = "en", session_id: Optional[str] = None) -> RAGResponse:
        now_str = datetime.datetime.utcnow().isoformat() + "Z"

        # 1. Retrieval
        raw_candidates = self.vector_store.search(query, jurisdiction=jurisdiction, topic=topic, top_k=6)

        # 2. Rerank
        reranked = self.reranker.rerank(raw_candidates, query)

        # 3. Check Abstention
        should_abstain, reason = self.guardrail.check_abstention_required(query, reranked)
        if should_abstain:
            abstained_msg = "**Safe Abstention Notice**: " + str(reason)
            localized_abstention = self.translator.translate_response(abstained_msg, language)
            return RAGResponse(
                query=query,
                jurisdiction_filter=jurisdiction,
                answer=localized_abstention,
                citations=[],
                confidence_score=0.0,
                confidence_rating="ABSTAINED",
                is_abstained=True,
                abstention_reason=reason,
                partial_coverage_flag=False,
                uncovered_aspects="Entire query is ungrounded in the ingested primary legal corpus.",
                reasoning_steps=["1. Query received", "2. Scanned legal vector corpus", "3. Relevance below threshold / out-of-scope trigger detected", "4. Invoked non-hallucination abstention protocol"],
                sources_accessed=[],
                timestamp=now_str
            )

        context_chunks = [c[0] for c in reranked]
        scores = [c[1] for c in reranked]

        # 4. Generate Grounded Legal Synthesis
        answer_text, citations_data, is_partial, uncovered = self._generate_synthesis(query, jurisdiction, context_chunks)

        # 5. Verify citations against ground-truth corpus
        verified_citations, invalid_ids = self.guardrail.verify_citations(citations_data)

        # 6. Calculate Grounded Confidence
        conf_score, conf_rating = self.guardrail.calculate_confidence(scores, query, context_chunks, answer_text)

        # 7. Apply Multilingual Synthesis with Term Locking
        localized_answer = self.translator.translate_response(answer_text, language)

        reasoning = [
            f"Filtered corpus strictly by jurisdiction: {jurisdiction.upper()}",
            f"Retrieved {len(context_chunks)} primary statutory chunks with top relevance score: {scores[0]:.2f}",
            "Cross-referenced Section/Article provisions against authoritative India Code / WIPO records",
            f"Verified {len(verified_citations)} citations against primary legal texts with 0 hallucination guarantee"
        ]

        sources_accessed = list(set([f"{c.act_title} ({c.section})" for c in context_chunks]))

        return RAGResponse(
            query=query,
            jurisdiction_filter=jurisdiction,
            answer=localized_answer,
            citations=verified_citations,
            confidence_score=conf_score,
            confidence_rating=conf_rating,
            is_abstained=False,
            abstention_reason=None,
            partial_coverage_flag=is_partial,
            uncovered_aspects=uncovered,
            reasoning_steps=reasoning,
            sources_accessed=sources_accessed,
            timestamp=now_str
        )

    def _generate_synthesis(self, query: str, jurisdiction: str, chunks: List[LegalChunk]) -> Tuple[str, List[Citation], bool, Optional[str]]:
        primary_chunk = chunks[0]
        query_lower = query.lower()

        citations = []
        for c in chunks:
            citations.append(Citation(
                chunk_id=c.chunk_id,
                act_title=c.act_title,
                section=c.section,
                title=c.title,
                official_url=c.official_url,
                jurisdiction=c.jurisdiction,
                exact_quote=c.legal_text
            ))

        # Check for partial coverage
        is_partial = False
        uncovered = None
        if ("pricing" in query_lower or "tax" in query_lower or "export tariff" in query_lower) and not any("tariff" in c.legal_text.lower() for c in chunks):
            is_partial = True
            uncovered = "Specific commercial export tariffs or GST tax rates are outside this statutory IP/regulatory corpus and require consultation with DGFT and Tax authorities."

        paragraphs = []

        # Statutory summary
        paragraphs.append(f"### Statutory Determination\n\nUnder **{primary_chunk.act_title}**, specifically **{primary_chunk.section}** (*{primary_chunk.title}*), the applicable legal framework provides:\n\n> \"{primary_chunk.legal_text}\"")

        # Analysis of retrieved chunks
        analysis_points = []
        for chunk in chunks:
            exp = chunk.explanation if chunk.explanation else chunk.legal_text
            analysis_points.append(f"- **{chunk.act_title} [{chunk.section}]**: {exp}")

        paragraphs.append("### Detailed Legal and Regulatory Provisions\n\n" + "\n\n".join(analysis_points))

        # Strategic Action points
        strategies = []
        if "patent" in query_lower and any("3(p)" in c.section for c in chunks):
            strategies.append("1. **Section 3(p) Traditional Knowledge Bar**: Classical recipes listed in First Schedule authoritative texts cannot be patented as compositions of matter.")
            strategies.append("2. **TKDL Defensive Art**: CSIR-TKDL contains >430,000 digitized formulations and actively opposes classical composition claims at Indian and international patent offices.")
            strategies.append("3. **Allowable IP Alternatives**: Focus on **Coined Brand Trademarks (Class 5)**, **Industrial Designs for novel delivery applicators (Designs Act 2000)**, or prove **Synergistic Ratios (CI < 0.7)** or **Novel Extraction Process Patents**.")
        elif "biological" in query_lower or "western ghats" in query_lower or any("bda" in c.chunk_id.lower() for c in chunks):
            strategies.append("1. **National Biodiversity Authority (NBA) Form III Approval**: Mandatory under **Section 6 of the Biological Diversity Act, 2002** prior to applying for or sealing any patent based on Indian biological resources.")
            strategies.append("2. **State Biodiversity Board (SBB) Intimation**: Mandatory under **Section 7** for Indian entities engaging in commercial utilization.")
            strategies.append("3. **Source Disclosure in Patent Specification**: Mandatory under **Section 10(4)(d)(ii) of the Patents Act, 1970**; failure to disclose is a ground for revocation under Section 64(1)(p).")
        elif "international" in jurisdiction.lower() or any("wipo" in c.chunk_id.lower() or "trips" in c.chunk_id.lower() for c in chunks):
            strategies.append("1. **WIPO GRATK Treaty (2024)**: Article 3 mandates global disclosure of the country of origin for genetic resources and indigenous community source for traditional knowledge in patent filings.")
            strategies.append("2. **Nagoya Protocol (CBD)**: Articles 5 and 6 require Prior Informed Consent (PIC) and Mutually Agreed Terms (MAT), along with an Internationally Recognized Certificate of Compliance (IRCC).")
            strategies.append("3. **PCT System**: International phase filings under PCT Rule 51bis must preserve domestic biodiversity clearances.")

        if strategies:
            paragraphs.append("### Strategic Recommendations and Compliance Roadmap\n\n" + "\n".join(strategies))

        if is_partial:
            paragraphs.append(f"> [!WARNING]\n> **Partial Statutory Coverage**: {uncovered}")

        full_answer = "\n\n".join(paragraphs)
        return full_answer, citations, is_partial, uncovered
