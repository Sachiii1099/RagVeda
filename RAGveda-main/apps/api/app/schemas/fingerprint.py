from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class IngredientInfo(BaseModel):
    name: str
    normalized_name: Optional[str] = None
    scientific_name: Optional[str] = None
    biological_resource: bool = True
    parts_used: Optional[str] = None
    classical_reference: Optional[str] = None
    source_country: str = "India"
    is_threatened_or_endangered: bool = False

class PreparationMethod(BaseModel):
    traditional: bool = True
    modified: bool = False
    details: Optional[str] = None
    novel_features: List[str] = Field(default_factory=list)

class InnovationFingerprint(BaseModel):
    title: str = "Ayurvedic Innovation"
    summary: str = ""
    ingredients: List[IngredientInfo] = Field(default_factory=list)
    preparation_method: PreparationMethod = Field(default_factory=PreparationMethod)
    intended_use: str = "Therapeutic"
    product_form: str = "Solid / Churna / Capsule"
    product_category: str = "unknown"  # classical, proprietary, phytopharmaceutical, ayush_aahar, cosmetic
    claimed_novelty: List[str] = Field(default_factory=list)
    traditional_knowledge_signal: bool = True
    biological_resources: List[str] = Field(default_factory=list)
    source_location: str = "Domestic (India)"
    commercial_intent: bool = True
    target_markets: List[str] = Field(default_factory=lambda: ["IN"])
    ip_targets: List[str] = Field(default_factory=lambda: ["Patent", "Trademark"])
    is_complete: bool = False
