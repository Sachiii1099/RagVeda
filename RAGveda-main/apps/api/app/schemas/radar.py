from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class RadarNode(BaseModel):
    id: str
    label: str
    category: str  # innovation, patent, tk, research, regulatory
    similarity: float  # 0.0 to 1.0
    distance: float    # inverse of similarity for radar radius
    angle: float       # 0 to 360 degrees for visual positioning
    source_title: str
    section: Optional[str] = None
    citation_id: Optional[str] = None
    summary: str

class RadarData(BaseModel):
    center_label: str
    nodes: List[RadarNode]
    max_similarity: float
    high_risk_cluster: bool

class TimelineItem(BaseModel):
    id: str
    title: str
    era_or_date: str
    category: str  # Classical Text, Modern Research, Prior Art Patent, Innovator Claim
    description: str
    source_reference: str
    significance: str

class DependencyNode(BaseModel):
    id: str
    label: str
    category: str  # innovation, classification, ip, regulatory, biodiversity
    status: str    # completed, warning, required, pending
    details: str

class DependencyEdge(BaseModel):
    id: str
    source: str
    target: str
    label: str
    statutory_trigger: Optional[str] = None

class DependencyGraph(BaseModel):
    nodes: List[DependencyNode]
    edges: List[DependencyEdge]
