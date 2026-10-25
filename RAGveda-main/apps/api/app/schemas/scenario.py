from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class ScenarioCreate(BaseModel):
    title: str
    delta_params: Dict[str, Any]

class ScenarioDiffItem(BaseModel):
    area: str  # Classification, Patentability, ABS, Regulatory, Readiness
    parameter: str
    baseline_value: str
    scenario_value: str
    impact_summary: str
    risk_change: str  # Decreased, Increased, Neutral

class ScenarioComparison(BaseModel):
    innovation_id: str
    scenario_id: str
    title: str
    baseline_readiness: int
    scenario_readiness: int
    diff_items: List[ScenarioDiffItem]
    recommendation: str
