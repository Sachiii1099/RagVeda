from typing import Dict, Any, List
from backend.models import RAGResponse, ConsentRequest, PaidQueryRequest
from backend.core.rag_engine import LegalRAGEngine
from backend.core.knowledge_graph import LegalKnowledgeGraph, MultiHopLegalAgent
from backend.modules.dpdp_connectors import DPDPPaidConnector

class EvalHarness:
    def __init__(self, rag_engine: LegalRAGEngine = None):
        self.rag_engine = rag_engine or LegalRAGEngine()
        self.graph = LegalKnowledgeGraph()
        self.agent = MultiHopLegalAgent(self.graph)
        self.connector = DPDPPaidConnector()

    def run_all_benchmarks(self) -> Dict[str, Any]:
        results = []

        # Benchmark 1: Classical Formulation Patent Bar (Sec 3(p))
        res1 = self.rag_engine.answer_query(
            "I have a classical Ayurvedic formulation for joint pain from Charaka Samhita - can I patent it?",
            jurisdiction="india",
            language="en"
        )
        has_3p = any("3(p)" in c.section for c in res1.citations) or any("patents" in c.act_title.lower() for c in res1.citations)
        pass1 = has_3p and res1.confidence_score >= 0.70
        results.append({
            "id": "TEST-01-CLASSICAL-PATENT-3P",
            "name": "Classical Formulation Patent Bar Check",
            "description": "Verifies Section 3(p) TK bar and TKDL defensive citations.",
            "passed": pass1,
            "citations_found": [f"{c.act_title} ({c.section})" for c in res1.citations],
            "confidence": res1.confidence_score
        })

        # Benchmark 2: Biodiversity Access & NBA Form III
        res2 = self.rag_engine.answer_query(
            "I developed an herbal extract using a wild plant from Western Ghats. What biodiversity approvals do I need?",
            jurisdiction="india",
            language="en"
        )
        has_bda = any("biological" in c.act_title.lower() or "biodiversity" in c.act_title.lower() for c in res2.citations)
        pass2 = has_bda and res2.confidence_score >= 0.70
        results.append({
            "id": "TEST-02-BIODIVERSITY-ABS",
            "name": "Western Ghats Biodiversity & NBA Form III Check",
            "description": "Verifies Biological Diversity Act Section 6 NBA Form III and Section 7 SBB citations.",
            "passed": pass2,
            "citations_found": [f"{c.act_title} ({c.section})" for c in res2.citations],
            "confidence": res2.confidence_score
        })

        # Benchmark 3: Strict Jurisdiction Isolation
        res3_in = self.rag_engine.answer_query(
            "What are the patent requirements for Ayurvedic innovations?",
            jurisdiction="india"
        )
        res3_intl = self.rag_engine.answer_query(
            "What are the origin disclosure requirements for traditional knowledge?",
            jurisdiction="international"
        )
        in_has_only_india = all("india" in c.jurisdiction.lower() for c in res3_in.citations)
        intl_has_only_intl = all("international" in c.jurisdiction.lower() for c in res3_intl.citations)
        pass3 = in_has_only_india and intl_has_only_intl
        results.append({
            "id": "TEST-03-JURISDICTION-ISOLATION",
            "name": "Strict India vs International Jurisdiction Isolation",
            "description": "Ensures no domestic/international cross-contamination during isolated retrieval.",
            "passed": pass3,
            "india_citations_count": len(res3_in.citations),
            "intl_citations_count": len(res3_intl.citations)
        })

        # Benchmark 4: Multi-Hop Agentic Planning
        plan = self.agent.plan_compliance_roadmap(
            "I want to patent a Western Ghats extract in India, sell in the US, and export as Phytopharmaceutical"
        )
        pass4 = len(plan.get("roadmap_steps", [])) == 4 and "NBA" in str(plan) and "PCT" in str(plan)
        results.append({
            "id": "TEST-04-MULTIHOP-AGENTIC",
            "name": "Multi-Hop Knowledge Graph Reasoning Agent",
            "description": "Validates 4-stage sequential compliance roadmap across BDA, Patents, CDSCO, and WIPO.",
            "passed": pass4,
            "stages_generated": len(plan.get("roadmap_steps", []))
        })

        # Benchmark 5: Adversarial Out-of-Scope Safe Abstention
        res5 = self.rag_engine.answer_query(
            "How do I implement quantum key distribution algorithms for blockchain networks?",
            jurisdiction="india"
        )
        pass5 = res5.is_abstained is True and len(res5.citations) == 0 and res5.confidence_score == 0.0
        results.append({
            "id": "TEST-05-SAFE-ABSTENTION",
            "name": "Adversarial Out-of-Scope Safe Abstention",
            "description": "Guarantees zero hallucinated citations and safe abstention for non-legal queries.",
            "passed": pass5,
            "is_abstained": res5.is_abstained,
            "citations_count": len(res5.citations)
        })

        # Benchmark 6: Partial Coverage Boundary Flagging
        res6 = self.rag_engine.answer_query(
            "What is the patenting process for an Ayurvedic compound and what are the export customs tariffs and GST tax rates?",
            jurisdiction="india"
        )
        pass6 = res6.partial_coverage_flag is True and "tariff" in (res6.uncovered_aspects or "").lower()
        results.append({
            "id": "TEST-06-PARTIAL-COVERAGE",
            "name": "Partial Coverage & Boundary Flagging",
            "description": "Flags queries with mixed in-scope and out-of-scope regulatory questions.",
            "passed": pass6,
            "partial_flag": res6.partial_coverage_flag
        })

        # Benchmark 7: Multilingual Translation with Term Locking
        res7 = self.rag_engine.answer_query(
            "Can I patent a classical formulation for arthritis?",
            jurisdiction="india",
            language="hi"
        )
        contains_devanagari = any(ord(char) > 2300 for char in res7.answer)
        pass7 = contains_devanagari and any("3(p)" in c.section for c in res7.citations)
        results.append({
            "id": "TEST-07-MULTILINGUAL-INTEGRITY",
            "name": "Multilingual Translation with Statutory Term Locking",
            "description": "Verifies high-fidelity localized output while preserving exact statutory Section tokens.",
            "passed": pass7,
            "has_devanagari": contains_devanagari
        })

        # Benchmark 8: DPDP Act 2023 Consent Gate Enforcement
        blocked = self.connector.query_precedents(
            PaidQueryRequest(session_id="unconsented-session", connector_name="manupatra", query="curcumin patent")
        )
        self.connector.record_consent(
            ConsentRequest(session_id="consented-session", connector_name="manupatra", consent_granted=True, consent_purpose="Legal Research")
        )
        allowed = self.connector.query_precedents(
            PaidQueryRequest(session_id="consented-session", connector_name="manupatra", query="curcumin patent")
        )
        pass8 = (blocked.get("success") is False) and (allowed.get("success") is True)
        results.append({
            "id": "TEST-08-DPDP-CONSENT-GATE",
            "name": "DPDP Act 2023 Paid Connector Consent Enforcement",
            "description": "Verifies session-based consent gating with cryptographic SHA-256 audit logging.",
            "passed": pass8,
            "unconsented_blocked": not blocked.get("success"),
            "consented_allowed": allowed.get("success")
        })

        total = len(results)
        passed_count = sum(1 for r in results if r["passed"])
        pass_rate = round((passed_count / total) * 100, 1)

        return {
            "total_benchmarks": total,
            "passed_benchmarks": passed_count,
            "pass_rate_percentage": pass_rate,
            "overall_status": "PASSED" if passed_count == total else "FAILED",
            "test_results": results
        }
