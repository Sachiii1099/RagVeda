from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from app.core.database import get_db
from app.models.entities import Innovation, InnovationFingerprintModel, ScenarioModel
from app.schemas.fingerprint import InnovationFingerprint
from app.schemas.scenario import ScenarioCreate, ScenarioComparison
from app.engines.what_if_engine import what_if_engine

router = APIRouter(prefix="/scenarios", tags=["Scenarios"])

@router.post("/{innovation_id}/simulate", response_model=ScenarioComparison)
def simulate_scenario(innovation_id: str, data: ScenarioCreate, db: Session = Depends(get_db)):
    inv = db.query(Innovation).filter_by(id=id).first()
    fp_rec = db.query(InnovationFingerprintModel).filter_by(innovation_id=innovation_id).first()
    if not fp_rec:
        raise HTTPException(status_code=404, detail="Baseline innovation fingerprint not found")

    baseline_fp = InnovationFingerprint(**fp_rec.data_json)

    comparison = what_if_engine.simulate(
        innovation_id=innovation_id,
        baseline_fingerprint=baseline_fp,
        scenario_title=data.title,
        delta_params=data.delta_params
    )

    # Persist scenario
    scen_model = ScenarioModel(
        innovation_id=innovation_id,
        title=data.title,
        delta_params_json=data.delta_params,
        assessment_result_json=comparison.model_dump()
    )
    db.add(scen_model)
    db.commit()

    return comparison

@router.get("/{innovation_id}")
def list_scenarios(innovation_id: str, db: Session = Depends(get_db)):
    scens = db.query(ScenarioModel).filter_by(innovation_id=innovation_id).all()
    return [
        {
            "id": s.id,
            "title": s.title,
            "delta_params": s.delta_params_json,
            "result": s.assessment_result_json,
            "created_at": s.created_at
        } for s in scens
    ]
