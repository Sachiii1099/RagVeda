import pytest
from app.engines.fingerprint_engine import fingerprint_engine
from app.engines.clarification_engine import clarification_engine
from app.engines.classification_engine import classification_engine
from app.engines.ip_engine import ip_engine
from app.engines.prior_art_engine import prior_art_engine
from app.engines.biodiversity_engine import biodiversity_engine
from app.engines.regulatory_engine import regulatory_navigator
from app.retrieval.hybrid_search import retriever

def test_fingerprint_botanical_resolution():
    text = "Herbal formulation with Ashwagandha and Neem using ultrasonic extraction for stress."
    fp = fingerprint_engine.build_fingerprint(
        title="Ashwagandha Neem Extract",
        description=text,
        intended_use="Stress relief"
    )
    assert len(fp.ingredients) >= 2
    names = [i.name for i in fp.ingredients]
    assert "Ashwagandha" in names
    assert "Neem" in names
    # Verify scientific names normalized
    sci_names = [i.scientific_name for i in fp.ingredients]
    assert "Withania somnifera" in sci_names
    assert "Azadirachta indica" in sci_names
    assert fp.preparation_method.modified is True

def test_hybrid_search_statutory_sources():
    # Test Patents Act Section 3(p) search
    citations = retriever.search("traditional knowledge Section 3p Patents Act", jurisdiction="IN", limit=3)
    assert len(citations) > 0
    assert any("Patents Act" in c.source_title for c in citations)
    assert citations[0].authority_level == 1  # Level 1 Primary Legislation

def test_ip_patentability_traditional_exclusion():
    # Classical formulation with no modified process
    fp = fingerprint_engine.build_fingerprint(
        title="Classical Churna",
        description="Traditional classical powder of Ashwagandha as per Sharangadhara Samhita",
        intended_use="General weakness"
    )
    fp.preparation_method.modified = False
    ip_opps = ip_engine.evaluate(fp)
    patent_item = next((i for i in ip_opps if i.category == "Patent"), None)
    assert patent_item is not None
    assert "High Risk" in patent_item.status

def test_biodiversity_abs_detection():
    fp = fingerprint_engine.build_fingerprint(
        title="Red Sanders Tonic",
        description="Extract using Red Sanders from Eastern Ghats forest",
        intended_use="Liver health"
    )
    bio_res = biodiversity_engine.evaluate(fp)
    assert bio_res.biological_resource_detected is True
    assert "YES" in bio_res.potential_abs_consideration
    assert "Section 7" in bio_res.statutory_provision

def test_regulatory_navigation_proprietary():
    fp = fingerprint_engine.build_fingerprint(
        title="Modified Extract",
        description="Novel ultrasonic extraction of Ashwagandha",
        intended_use="Cognitive support"
    )
    cls = classification_engine.classify(fp)
    assert "proprietary" in cls.category
    reg, readiness, actions = regulatory_navigator.navigate(fp, cls, "IN")
    assert "158-B" in reg.regulatory_framework or "Form 25D" in reg.licensing_form
    assert len(actions) > 0
    assert 0 <= readiness <= 100
