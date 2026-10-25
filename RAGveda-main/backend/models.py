from typing import List, Dict, Optional, Any
from pydantic import BaseModel, Field

class LegalChunk(BaseModel):
    chunk_id: str
    act_title: str
    chapter: Optional[str] = None
    section: str
    title: str
    legal_text: str
    explanation: Optional[str] = None
    jurisdiction: str  # 'India' | 'International' | 'India / International'
    topic: str         # 'patent' | 'biodiversity' | 'drug_regulatory' | 'food_ayurveda_aahar' | 'gi_trademark' | 'advertising' | 'tkdl_prior_art' | 'international_treaty'
    keywords: List[str] = Field(default_factory=list)
    official_url: str
    last_amended: Optional[str] = None

class Citation(BaseModel):
    chunk_id: str
    act_title: str
    section: str
    title: str
    official_url: str
    jurisdiction: str
    relevance_score: float = 0.0
    exact_quote: Optional[str] = None

class RAGResponse(BaseModel):
    query: str
    jurisdiction_filter: str
    answer: str
    citations: List[Citation]
    confidence_score: float
    confidence_rating: str  # 'HIGH' | 'MEDIUM' | 'LOW' | 'ABSTAINED'
    is_abstained: bool = False
    abstention_reason: Optional[str] = None
    partial_coverage_flag: bool = False
    uncovered_aspects: Optional[str] = None
    reasoning_steps: Optional[List[str]] = None
    sources_accessed: List[str] = Field(default_factory=list)
    timestamp: str

class ChatQueryRequest(BaseModel):
    query: str
    jurisdiction: str = "india"
    language: str = "en"
    session_id: Optional[str] = None

class ClassificationRequest(BaseModel):
    is_classical_text_recipe: bool = False
    classical_text_name: Optional[str] = None
    has_ingredient_modifications: bool = False
    is_purified_standardized_fraction: bool = False
    bioactive_markers_count: int = 0
    intended_use: str = "therapeutic_disease"
    has_heavy_metals_or_schedule_e1: bool = False
    extraction_method: str = "classical_water_oil"
    clinical_safety_data_available: bool = False

class TKDLScanRequest(BaseModel):
    formulation_text: str
    indication: Optional[str] = None

class ABSAssessmentRequest(BaseModel):
    is_foreign_entity_or_has_foreign_equity: bool = False
    is_nri: bool = False
    purpose: str = "commercial_utilization"
    is_cultivated_ayush_resource: bool = False
    is_registered_ayush_practitioner_for_clinic: bool = False
    annual_turnover_bracket: str = "upto_1cr"

class ConsentRequest(BaseModel):
    session_id: str
    connector_name: str
    consent_granted: bool
    consent_purpose: str

class PaidQueryRequest(BaseModel):
    session_id: str
    connector_name: str
    query: str

class AgentPlanRequest(BaseModel):
    query: str
    jurisdiction: str = "all"
    language: str = "en"

class EscalationTicketRequest(BaseModel):
    user_name: str
    email: str
    organization: Optional[str] = None
    formulation_name: str
    issue_description: str
    last_query: Optional[str] = None
    category: str = "patent_eligibility"
