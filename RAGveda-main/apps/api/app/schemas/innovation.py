from typing import List, Optional, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field
from app.schemas.fingerprint import InnovationFingerprint

class InnovationCreate(BaseModel):
    title: str = "My Ayurvedic Formulation"
    description: str
    intended_use: Optional[str] = "Therapeutic treatment"
    commercial_intent: bool = True
    target_jurisdiction: str = "IN"  # IN or INT
    language: str = "en"             # en, hi, mr

class ClarificationQuestion(BaseModel):
    id: str
    question: str
    why_we_ask: str
    options: List[str] = Field(default_factory=list)
    impact_variable: str  # e.g., classical_origin, biological_origin, target_market

class ClarificationSubmission(BaseModel):
    answers: Dict[str, str]  # question_id -> user answer

class InnovationResponse(BaseModel):
    id: str
    title: str
    description: str
    intended_use: Optional[str] = None
    product_category: Optional[str] = None
    commercial_intent: bool = True
    target_jurisdiction: str = "IN"
    status: str
    created_at: datetime
    fingerprint: Optional[InnovationFingerprint] = None
    has_assessment: bool = False
