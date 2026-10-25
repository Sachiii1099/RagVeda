from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Dict, Any, List, Optional
from app.core.database import get_db
from app.models.entities import Innovation, InnovationFingerprintModel, AssessmentModel
from app.schemas.fingerprint import InnovationFingerprint
from app.schemas.assessment import (
    FullAssessmentResult,
    ConfidenceBreakdown,
    Citation,
)
from app.schemas.radar import RadarData, TimelineItem, DependencyGraph, DependencyNode, DependencyEdge
from app.engines.classification_engine import classification_engine
from app.engines.ip_engine import ip_engine
from app.engines.prior_art_engine import prior_art_engine
from app.engines.biodiversity_engine import biodiversity_engine
from app.engines.regulatory_engine import regulatory_navigator

router = APIRouter(prefix="/innovations", tags=["Assessments"])

@router.post("/{id}/assess", response_model=FullAssessmentResult)
def run_assessment(
    id: str,
    jurisdiction: Optional[str] = Query(None, description="Jurisdiction override: IN or INT"),
    db: Session = Depends(get_db)
):
    inv = db.query(Innovation).filter_by(id=id).first()
    if not inv:
        raise HTTPException(status_code=404, detail="Innovation not found")

    fp_rec = db.query(InnovationFingerprintModel).filter_by(innovation_id=id).first()
    if not fp_rec:
        raise HTTPException(status_code=400, detail="Fingerprint missing. Please create innovation first.")

    target_jurisdiction = jurisdiction or inv.target_jurisdiction or "IN"
    fp = InnovationFingerprint(**fp_rec.data_json)

    # 1. Product Classification
    classification = classification_engine.classify(fp)

    # 2. IP Opportunities
    ip_opps = ip_engine.evaluate(fp)

    # 3. Traditional Knowledge & Prior-Art Overlap
    tk_res = prior_art_engine.assess_tk_overlap(fp)

    # 4. Biodiversity / ABS Considerations
    bio_res = biodiversity_engine.evaluate(fp)

    # 5. Regulatory Navigator & Compliance Debt Readiness
    reg_res, readiness_score, actions = regulatory_navigator.navigate(fp, classification, target_jurisdiction)

    # Add biodiversity action if ABS flagged
    if "YES" in bio_res.potential_abs_consideration:
        actions.insert(1, {
            "id": "act_bio_1",
            "title": "State Biodiversity Board (SBB) Prior Intimation",
            "priority": "HIGH",
            "status": "pending",
            "category": "Biodiversity",
            "description": "Submit Form I prior intimation under Section 7 of Biological Diversity Act before commercial production.",
            "authority": "State Biodiversity Board",
            "recommended_timeline": "Within 30 days"
        })

    # Consolidate Traceable Citations
    all_citations: List[Citation] = []
    for c in classification.citations + tk_res.citations + bio_res.citations + reg_res.citations:
        if not any(existing.source_id == c.source_id and existing.section == c.section for existing in all_citations):
            all_citations.append(c)

    for item in ip_opps:
        for c in item.citations:
            if not any(existing.source_id == c.source_id and existing.section == c.section for existing in all_citations):
                all_citations.append(c)

    # Formulate Executive Summary
    summary = (
        f"Assessment for '{inv.title}' under {target_jurisdiction} regime: "
        f"Classified as {classification.category_display} with {int(classification.confidence * 100)}% confidence. "
        f"Prior-art analysis indicates {tk_res.similarity_degree} traditional knowledge overlap ({round(tk_res.similarity_score * 100)}%). "
        f"Biodiversity assessment: {bio_res.potential_abs_consideration}. "
        f"Regulatory pathway: {reg_res.licensing_pathway} ({reg_res.licensing_form}). "
        f"Overall compliance readiness score: {readiness_score}%."
    )

    result = FullAssessmentResult(
        summary=summary,
        jurisdiction=target_jurisdiction,
        confidence=ConfidenceBreakdown(
            evidence_quality="HIGH" if len(all_citations) >= 2 else "MEDIUM",
            classification_confidence="HIGH" if classification.confidence >= 0.85 else "MEDIUM",
            tk_confidence="HIGH" if tk_res.matched_formulations else "MEDIUM",
            abs_confidence="MEDIUM",
            legal_certainty_note="All assessments are decision-support indicators, not legal certification."
        ),
        classification=classification,
        ip_opportunities=ip_opps,
        tk_prior_art=tk_res,
        biodiversity_abs=bio_res,
        regulatory=reg_res,
        compliance_readiness_score=readiness_score,
        action_roadmap=actions,
        all_citations=all_citations,
        expert_review_recommended=True,
        expert_brief_summary=f"Dossier ready for Registered Patent Agent & AYUSH Regulatory Consultant review. Critical focus on Section 3(p) prior art and {reg_res.authority} licensing."
    )

    # Save or update Assessment in DB
    existing_assessment = db.query(AssessmentModel).filter_by(innovation_id=id, assessment_type="full").first()
    if existing_assessment:
        existing_assessment.result_json = result.model_dump()
        existing_assessment.score = float(readiness_score)
    else:
        new_assess = AssessmentModel(
            innovation_id=id,
            assessment_type="full",
            status="completed",
            score=float(readiness_score),
            confidence="high",
            result_json=result.model_dump()
        )
        db.add(new_assess)

    inv.status = "assessed"
    db.commit()

    return result

@router.get("/{id}/assessment", response_model=FullAssessmentResult)
def get_assessment(id: str, db: Session = Depends(get_db)):
    rec = db.query(AssessmentModel).filter_by(innovation_id=id, assessment_type="full").first()
    if not rec:
        raise HTTPException(status_code=404, detail="Assessment not found. Please run assessment first.")
    return FullAssessmentResult(**rec.result_json)

@router.get("/{id}/radar", response_model=RadarData)
def get_prior_art_radar(id: str, db: Session = Depends(get_db)):
    fp_rec = db.query(InnovationFingerprintModel).filter_by(innovation_id=id).first()
    if not fp_rec:
        raise HTTPException(status_code=404, detail="Innovation not found")

    fp = InnovationFingerprint(**fp_rec.data_json)
    tk_res = prior_art_engine.assess_tk_overlap(fp)
    return prior_art_engine.generate_radar_data(fp, tk_res)

@router.get("/{id}/timeline", response_model=List[TimelineItem])
def get_novelty_timeline(id: str, db: Session = Depends(get_db)):
    fp_rec = db.query(InnovationFingerprintModel).filter_by(innovation_id=id).first()
    if not fp_rec:
        raise HTTPException(status_code=404, detail="Innovation not found")

    fp = InnovationFingerprint(**fp_rec.data_json)
    tk_res = prior_art_engine.assess_tk_overlap(fp)
    return prior_art_engine.generate_timeline(fp, tk_res)

@router.get("/{id}/dependency-graph", response_model=DependencyGraph)
def get_dependency_graph(id: str, db: Session = Depends(get_db)):
    fp_rec = db.query(InnovationFingerprintModel).filter_by(innovation_id=id).first()
    if not fp_rec:
        raise HTTPException(status_code=404, detail="Innovation not found")

    fp = InnovationFingerprint(**fp_rec.data_json)
    cls = classification_engine.classify(fp)

    nodes = [
        DependencyNode(
            id="node_inv",
            label=f"Innovation: {fp.title[:25]}",
            category="innovation",
            status="completed",
            details=f"Formulation with {len(fp.ingredients)} detected botanical ingredients."
        ),
        DependencyNode(
            id="node_cls",
            label=f"Class: {cls.category_display}",
            category="classification",
            status="completed",
            details=cls.applicable_statute
        ),
        DependencyNode(
            id="node_ip",
            label="IP: Patents Act Sec 3(p) / TM",
            category="ip",
            status="warning" if not fp.preparation_method.modified else "completed",
            details="Traditional knowledge exclusion scrutiny; trademark recommended."
        ),
        DependencyNode(
            id="node_bio",
            label="Biodiversity: SBB Form I",
            category="biodiversity",
            status="required",
            details="Section 7 prior intimation for biological resource utilization."
        ),
        DependencyNode(
            id="node_reg",
            label="Regulatory: Form 25D / 158-B",
            category="regulatory",
            status="required",
            details="State AYUSH Licensing Authority manufacturing approval."
        )
    ]

    edges = [
        DependencyEdge(id="e1", source="node_inv", target="node_cls", label="Classifies Under"),
        DependencyEdge(id="e2", source="node_cls", target="node_ip", label="Governs Patentability", statutory_trigger="Sec 3(p)"),
        DependencyEdge(id="e3", source="node_inv", target="node_bio", label="Triggers ABS Review", statutory_trigger="Sec 7 BDA 2002"),
        DependencyEdge(id="e4", source="node_cls", target="node_reg", label="Mandates Licensing", statutory_trigger="Rule 158-B")
    ]

    return DependencyGraph(nodes=nodes, edges=edges)

@router.get("/{id}/passport")
def get_innovation_passport(id: str, db: Session = Depends(get_db)):
    inv = db.query(Innovation).filter_by(id=id).first()
    if not inv:
        raise HTTPException(status_code=404, detail="Innovation not found")

    fp_rec = db.query(InnovationFingerprintModel).filter_by(innovation_id=id).first()
    assess_rec = db.query(AssessmentModel).filter_by(innovation_id=id, assessment_type="full").first()

    return {
        "passport_version": "1.0",
        "passport_id": f"IPS-{inv.id[:8].upper()}",
        "generated_at": inv.created_at.isoformat(),
        "innovation": {
            "title": inv.title,
            "description": inv.description,
            "intended_use": inv.intended_use,
            "target_jurisdiction": inv.target_jurisdiction,
            "status": inv.status
        },
        "fingerprint": fp_rec.data_json if fp_rec else None,
        "assessment": assess_rec.result_json if assess_rec else None,
        "export_ready_expert_brief": {
            "title": f"Official Expert Consultation Brief: {inv.title}",
            "purpose": "Prepared for Registered Patent Attorney, Patent Agent, and AYUSH Regulatory Consultant Review.",
            "disclaimer": "This document contains evidence-backed decision support indicators generated by IP-SAKTI Sahayak. It is not formal legal certification."
        }
    }
