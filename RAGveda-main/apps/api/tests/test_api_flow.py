import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_check():
    res = client.get("/health")
    assert res.status_code == 200
    assert res.json()["status"] == "healthy"

def test_demo_cases():
    res = client.get("/api/v1/innovations/demo-cases")
    assert res.status_code == 200
    cases = res.json()
    assert len(cases) == 5
    assert cases[0]["id"] == "demo_case_a"

def test_end_to_end_assessment_flow():
    # 1. Create innovation
    payload = {
        "title": "Nano-Ashwagandha Stress Elixir",
        "description": "Novel formulation of Ashwagandha and Neem utilizing ultrasonic extraction to achieve enhanced bioavailability.",
        "intended_use": "Stress and cognitive rejuvenation",
        "commercial_intent": True,
        "target_jurisdiction": "IN"
    }
    create_res = client.post("/api/v1/innovations", json=payload)
    assert create_res.status_code == 200
    data = create_res.json()
    inv_id = data["innovation_id"]
    assert "fingerprint" in data
    assert len(data["clarifying_questions"]) > 0

    # 2. Submit clarifications
    clarify_res = client.post(
        f"/api/v1/innovations/{inv_id}/clarify",
        json={"answers": {"q_classical_origin": "No, it combines classical herbs in a new ratio or modified process"}}
    )
    assert clarify_res.status_code == 200

    # 3. Run full multi-domain assessment
    assess_res = client.post(f"/api/v1/innovations/{inv_id}/assess?jurisdiction=IN")
    assert assess_res.status_code == 200
    result = assess_res.json()
    assert "summary" in result
    assert result["classification"]["category"] in ["proprietary_ayurvedic", "phytopharmaceutical"]
    assert len(result["ip_opportunities"]) >= 3
    assert "potential_abs_consideration" in result["biodiversity_abs"]
    assert len(result["all_citations"]) > 0

    # 4. Fetch radar and timeline
    radar_res = client.get(f"/api/v1/innovations/{inv_id}/radar")
    assert radar_res.status_code == 200
    assert len(radar_res.json()["nodes"]) == 4

    timeline_res = client.get(f"/api/v1/innovations/{inv_id}/timeline")
    assert timeline_res.status_code == 200
    assert len(timeline_res.json()) == 4

    # 5. Fetch Dependency Graph
    dep_res = client.get(f"/api/v1/innovations/{inv_id}/dependency-graph")
    assert dep_res.status_code == 200
    assert len(dep_res.json()["nodes"]) == 5

    # 6. Fetch Innovation Passport
    pass_res = client.get(f"/api/v1/innovations/{inv_id}/passport")
    assert pass_res.status_code == 200
    assert pass_res.json()["passport_id"].startswith("IPS-")
