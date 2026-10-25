from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class Citation(BaseModel):
    source_id: str
    source_title: str
    publisher: str
    authority_level: int  # Level 1 (Act/Rules) to Level 6 (Secondary)
    jurisdiction: str     # IN or INT
    section: Optional[str] = None
    page: Optional[int] = None
    quoted_snippet: str
    relevance_score: float = 0.95
    url: Optional[str] = None

class ConfidenceBreakdown(BaseModel):
    evidence_quality: str = "HIGH"         # HIGH, MEDIUM, LOW
    classification_confidence: str = "HIGH"
    tk_confidence: str = "HIGH"
    abs_confidence: str = "MEDIUM"
    legal_certainty_note: str = "All assessments are decision-support indicators, not legal certification."

class ProductClassification(BaseModel):
    category: str  # classical_ayurvedic, proprietary_ayurvedic, phytopharmaceutical, ayush_aahar, cosmetic, uncertain
    category_display: str
    confidence: float
    reasons: List[str]
    applicable_statute: str
    needs_human_review: bool = False
    citations: List[Citation] = Field(default_factory=list)

class IPItem(BaseModel):
    category: str      # Patent, Trademark, GI, Trade Secret, Design, Plant Variety
    status: str        # Investigate, Relevant, Potentially Relevant, High Risk Exclusion, Not Applicable
    risk_level: str    # Low, Medium, High, Critical
    statutory_basis: str
    explanation: str
    recommendations: List[str]
    citations: List[Citation] = Field(default_factory=list)

class MatchedClassicalFormulation(BaseModel):
    name: str
    source_text: str   # e.g., Charaka Samhita, Sharangadhara Samhita, AFI
    overlapping_ingredients: List[str]
    traditional_indication: str
    similarity_percentage: float

class TKAssessment(BaseModel):
    overlap_detected: bool
    similarity_degree: str  # High, Moderate, Low, None
    similarity_score: float
    matched_formulations: List[MatchedClassicalFormulation] = Field(default_factory=list)
    prior_art_signals: List[str] = Field(default_factory=list)
    patentability_impact: str
    explanation: str
    citations: List[Citation] = Field(default_factory=list)

class BiodiversityAssessment(BaseModel):
    biological_resource_detected: bool
    potential_abs_consideration: str  # YES, NO, UNCERTAIN
    relevant_authority: str          # National Biodiversity Authority (NBA) or State Biodiversity Board (SBB)
    statutory_provision: str        # Section 3 or Section 7 of Biological Diversity Act
    required_filings: List[str]
    what_to_verify: List[str]
    statutory_warning: str
    citations: List[Citation] = Field(default_factory=list)

class RegulatoryAssessment(BaseModel):
    regulatory_framework: str
    authority: str
    licensing_pathway: str
    licensing_form: str
    rule_158b_applicable: bool
    safety_evidence_required: str
    clinical_trial_required: bool
    labelling_advertising_guidelines: List[str]
    checkpoints: List[str]
    citations: List[Citation] = Field(default_factory=list)

class ComplianceAction(BaseModel):
    id: str
    title: str
    priority: str  # CRITICAL, HIGH, MEDIUM, LOW
    status: str    # pending, in_progress, completed
    category: str  # IP, TK, Biodiversity, Regulatory, Commercial
    description: str
    authority: str
    recommended_timeline: str

class FullAssessmentResult(BaseModel):
    summary: str
    jurisdiction: str = "IN"
    confidence: ConfidenceBreakdown
    classification: ProductClassification
    ip_opportunities: List[IPItem]
    tk_prior_art: TKAssessment
    biodiversity_abs: BiodiversityAssessment
    regulatory: RegulatoryAssessment
    compliance_readiness_score: int  # 0 to 100%
    action_roadmap: List[ComplianceAction]
    all_citations: List[Citation]
    expert_review_recommended: bool = True
    expert_brief_summary: Optional[str] = None
