from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict, Any, Optional
from app.core.database import get_db
from app.models.entities import Innovation, InnovationFingerprintModel, ConversationMessageModel
from app.schemas.innovation import (
    InnovationCreate,
    InnovationResponse,
    ClarificationQuestion,
    ClarificationSubmission,
)
from app.schemas.fingerprint import InnovationFingerprint
from app.engines.fingerprint_engine import fingerprint_engine
from app.engines.clarification_engine import clarification_engine

router = APIRouter(prefix="/innovations", tags=["Innovations"])

# 5 Preloaded Benchmark Cases from SIH 2026 specification
DEMO_BENCHMARK_CASES = [
    {
        "id": "demo_case_a",
        "title": "Case A — Classical Overlap (Ashwagandhadi Ghrita Formulation)",
        "description": "A traditional churned Ayurvedic ghrita (clarified butter) containing Ashwagandha and cow milk prepared strictly according to Sharangadhara Samhita recipes for general debility and fatigue.",
        "intended_use": "Balya / Rejuvenator for general debility and stamina",
        "target_jurisdiction": "IN",
        "commercial_intent": True,
        "category_hint": "Classical Ayurvedic Medicine",
        "key_issue": "Strict patent exclusion under Section 3(p) as codified traditional knowledge; eligible for Form 25D classical drug licence without clinical trial requirements."
    },
    {
        "id": "demo_case_b",
        "title": "Case B — Modified Formulation (Ashwagandha & Neem Nano-Emulsion)",
        "description": "An innovative topical nano-emulsion combining standardized bioactive extracts of Ashwagandha (Withania somnifera) and Neem (Azadirachta indica) prepared with an ultrasonic cavitation technique that improves transdermal bioavailability by 300% for chronic inflammatory skin conditions.",
        "intended_use": "Topical treatment for inflammatory eczema and dermatological conditions",
        "target_jurisdiction": "IN",
        "commercial_intent": True,
        "category_hint": "Patent or Proprietary Ayurvedic Medicine",
        "key_issue": "Process patent potential if synergistic enhancement proven under Section 3(d)/3(e); requires Rule 158-B safety evidence dossier."
    },
    {
        "id": "demo_case_c",
        "title": "Case C — Biological-Resource Issue (Wild Red Sanders & Himalayan Kutki Formulation)",
        "description": "A proprietary herbal hepatoprotective tonic utilizing wild-harvested Red Sanders (Pterocarpus santalinus) from Eastern Ghats and Picrorhiza kurroa (Kutki) from high-altitude Himalayan forests for liver support.",
        "intended_use": "Hepatoprotective and metabolic liver rejuvenation",
        "target_jurisdiction": "IN",
        "commercial_intent": True,
        "category_hint": "Proprietary Medicine with High Conservation Herbs",
        "key_issue": "Mandatory prior intimation to State Biodiversity Board under Section 7 of Biological Diversity Act; strictly regulated wild harvest permits and transit permits required."
    },
    {
        "id": "demo_case_d",
        "title": "Case D — International Commercialization (Herbal Glucose Regulator for US Market)",
        "description": "An Ayurvedic multi-herbal formulation containing Turmeric (Curcuma longa), Shilajit, and Guggulu intended for export and commercial launch across the United States and European Union as a metabolic health optimizer.",
        "intended_use": "Metabolic wellness and glucose metabolism support",
        "target_jurisdiction": "INT",
        "commercial_intent": True,
        "category_hint": "Dietary Supplement / Botanical Drug Candidate",
        "key_issue": "US FDA Dietary Supplement DSHEA compliance (no disease claims permitted) or multi-million dollar Botanical Drug IND pathway; WIPO PCT patent search required."
    },
    {
        "id": "demo_case_e",
        "title": "Case E — Brand Protection & Proprietary Packaging (Ayurvedic Radiance Face Elixir)",
        "description": "A luxury Ayurvedic facial serum infused with Saffron, Manjistha, and cold-pressed Sesame oil in a custom double-walled airless glass dropper designed to prevent botanical oxidation.",
        "intended_use": "Ayurvedic cosmetic skin radiance and complexional beautification",
        "target_jurisdiction": "IN",
        "commercial_intent": True,
        "category_hint": "Ayurvedic Cosmetic (ASU Cosmetic)",
        "key_issue": "Licensed as ASU Cosmetic under Rule 158-B; high potential for Trademark Class 3 and Industrial Design packaging protection under Designs Act 2000."
    }
]

@router.get("/demo-cases")
def get_demo_cases():
    return DEMO_BENCHMARK_CASES

@router.post("", response_model=Dict[str, Any])
def create_innovation(data: InnovationCreate, db: Session = Depends(get_db)):
    # 1. Create DB Innovation
    inv = Innovation(
        title=data.title,
        description=data.description,
        intended_use=data.intended_use,
        commercial_intent=data.commercial_intent,
        target_jurisdiction=data.target_jurisdiction,
        status="fingerprinted"
    )
    db.add(inv)
    db.commit()
    db.refresh(inv)

    # 2. Extract and Save Structured Fingerprint
    fp = fingerprint_engine.build_fingerprint(
        title=data.title,
        description=data.description,
        intended_use=data.intended_use or "Therapeutic treatment",
        target_jurisdiction=data.target_jurisdiction,
        commercial_intent=data.commercial_intent
    )

    fp_model = InnovationFingerprintModel(
        innovation_id=inv.id,
        data_json=fp.model_dump()
    )
    db.add(fp_model)
    db.commit()

    # 3. Select Adaptive Minimum Clarifying Questions
    questions = clarification_engine.select_questions(fp)

    return {
        "innovation_id": inv.id,
        "title": inv.title,
        "target_jurisdiction": inv.target_jurisdiction,
        "fingerprint": fp,
        "clarifying_questions": questions
    }

@router.get("", response_model=List[Dict[str, Any]])
def list_innovations(db: Session = Depends(get_db)):
    invs = db.query(Innovation).order_by(Innovation.created_at.desc()).all()
    results = []
    for inv in invs:
        fp_rec = db.query(InnovationFingerprintModel).filter_by(innovation_id=inv.id).first()
        results.append({
            "id": inv.id,
            "title": inv.title,
            "description": inv.description,
            "intended_use": inv.intended_use,
            "target_jurisdiction": inv.target_jurisdiction,
            "status": inv.status,
            "created_at": inv.created_at,
            "has_fingerprint": bool(fp_rec),
            "fingerprint": fp_rec.data_json if fp_rec else None
        })
    return results

@router.get("/{id}")
def get_innovation(id: str, db: Session = Depends(get_db)):
    inv = db.query(Innovation).filter_by(id=id).first()
    if not inv:
        raise HTTPException(status_code=404, detail="Innovation not found")
    fp_rec = db.query(InnovationFingerprintModel).filter_by(innovation_id=inv.id).first()
    return {
        "id": inv.id,
        "title": inv.title,
        "description": inv.description,
        "intended_use": inv.intended_use,
        "target_jurisdiction": inv.target_jurisdiction,
        "status": inv.status,
        "created_at": inv.created_at,
        "fingerprint": fp_rec.data_json if fp_rec else None
    }

@router.post("/{id}/clarify")
def submit_clarifications(id: str, submission: ClarificationSubmission, db: Session = Depends(get_db)):
    inv = db.query(Innovation).filter_by(id=id).first()
    if not inv:
        raise HTTPException(status_code=404, detail="Innovation not found")

    fp_rec = db.query(InnovationFingerprintModel).filter_by(innovation_id=inv.id).first()
    if not fp_rec:
        raise HTTPException(status_code=400, detail="Innovation fingerprint not yet built")

    fp_data = fp_rec.data_json

    # Update fingerprint based on answers
    answers = submission.answers
    if "q_classical_origin" in answers:
        ans = answers["q_classical_origin"]
        if "exact" in ans.lower():
            fp_data["preparation_method"]["traditional"] = True
            fp_data["preparation_method"]["modified"] = False
        else:
            fp_data["preparation_method"]["modified"] = True

    if "q_resource_sourcing" in answers:
        ans = answers["q_resource_sourcing"]
        fp_data["source_location"] = ans

    if "q_target_market" in answers:
        ans = answers["q_target_market"]
        if "export" in ans.lower() or "us" in ans.lower():
            fp_data["target_markets"] = ["INT", "US"]

    fp_rec.data_json = fp_data
    inv.status = "clarified"
    db.commit()

    return {
        "message": "Clarifications saved and fingerprint updated",
        "fingerprint": fp_data
    }

@router.patch("/{id}/fingerprint")
def update_fingerprint(id: str, updated_fp: Dict[str, Any], db: Session = Depends(get_db)):
    fp_rec = db.query(InnovationFingerprintModel).filter_by(innovation_id=id).first()
    if not fp_rec:
        raise HTTPException(status_code=404, detail="Fingerprint not found")
    fp_rec.data_json = updated_fp
    db.commit()
    return {"message": "Fingerprint updated successfully", "fingerprint": fp_rec.data_json}
