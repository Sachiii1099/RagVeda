import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, Any, List

from backend.models import (
    ChatQueryRequest, ClassificationRequest, TKDLScanRequest,
    ABSAssessmentRequest, ConsentRequest, PaidQueryRequest,
    AgentPlanRequest, EscalationTicketRequest, RAGResponse
)
from backend.ingest import LegalCorpusIngestor
from backend.core.rag_engine import LegalRAGEngine
from backend.core.knowledge_graph import LegalKnowledgeGraph, MultiHopLegalAgent
from backend.modules.classifier import FormulationDecisionTree
from backend.modules.tkdl_scanner import TKDLScanner
from backend.modules.abs_helper import BiodiversityABSHelper
from backend.modules.dpdp_connectors import DPDPPaidConnector
from backend.modules.facilitator import AIIAFacilitator
from backend.modules.eval_suite import EvalHarness

app = FastAPI(
    title="RAGveda API",
    description="Grounded Ayurvedic IP & Regulatory Intelligence Assistant (Ministry of AYUSH • AIIA)",
    version="1.0.0"
)

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Shared Singletons
ingestor = LegalCorpusIngestor()
rag_engine = LegalRAGEngine(ingestor=ingestor)
decision_tree = FormulationDecisionTree()
tkdl_scanner = TKDLScanner()
abs_helper = BiodiversityABSHelper()
knowledge_graph = LegalKnowledgeGraph()
agent = MultiHopLegalAgent(knowledge_graph)
paid_connector = DPDPPaidConnector()
facilitator = AIIAFacilitator()
eval_harness = EvalHarness(rag_engine=rag_engine)

@app.get("/")
def root():
    return {
        "service": "RAGveda Statutory Intelligence Gateway",
        "authority": "Ministry of AYUSH • All India Institute of Ayurveda (AIIA)",
        "status": "ONLINE",
        "docs_url": "/docs"
    }

@app.get("/api/health")
def health_check():
    return {
        "status": "HEALTHY",
        "corpus_chunks_loaded": len(ingestor.get_all_chunks()),
        "grounding_guardrails": "ACTIVE",
        "zero_hallucination_policy": "ENFORCED"
    }

@app.post("/api/chat", response_model=RAGResponse)
def chat_endpoint(request: ChatQueryRequest):
    try:
        return rag_engine.answer_query(
            query=request.query,
            jurisdiction=request.jurisdiction,
            language=request.language,
            session_id=request.session_id
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"RAG Inference Error: {str(e)}")

@app.post("/api/classify")
def classify_formulation(request: ClassificationRequest):
    try:
        return decision_tree.evaluate_formulation(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Classification Error: {str(e)}")

@app.post("/api/tkdl/scan")
def scan_tkdl(request: TKDLScanRequest):
    try:
        return tkdl_scanner.scan_formulation(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"TKDL Scanner Error: {str(e)}")

@app.post("/api/abs/assess")
def assess_abs(request: ABSAssessmentRequest):
    try:
        return abs_helper.assess_compliance(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"ABS Assessment Error: {str(e)}")

@app.get("/api/graph")
def get_graph():
    return knowledge_graph.get_graph_data()

@app.post("/api/agent/plan")
def agent_plan(request: AgentPlanRequest):
    try:
        return agent.plan_compliance_roadmap(
            query=request.query,
            jurisdiction=request.jurisdiction,
            language=request.language
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Agent Planning Error: {str(e)}")

@app.post("/api/connectors/consent")
def set_consent(request: ConsentRequest):
    try:
        return paid_connector.record_consent(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Consent Error: {str(e)}")

@app.post("/api/connectors/query")
def query_paid(request: PaidQueryRequest):
    try:
        return paid_connector.query_precedents(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Paid Connector Error: {str(e)}")

@app.get("/api/connectors/audit")
def get_audit_logs():
    return paid_connector.get_audit_trail()

@app.post("/api/escalation/ticket")
def create_ticket(request: EscalationTicketRequest):
    try:
        return facilitator.create_ticket(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ticket Error: {str(e)}")

@app.get("/api/eval/run")
def run_eval():
    try:
        return eval_harness.run_all_benchmarks()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Eval Suite Error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
