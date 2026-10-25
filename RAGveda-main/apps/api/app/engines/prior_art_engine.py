import math
from typing import List, Dict, Any, Tuple
from app.knowledge.corpus import CLASSICAL_AYURVEDIC_REFERENCES
from app.schemas.fingerprint import InnovationFingerprint
from app.schemas.assessment import TKAssessment, MatchedClassicalFormulation, Citation
from app.schemas.radar import RadarNode, RadarData, TimelineItem
from app.retrieval.hybrid_search import retriever

class PriorArtTKEngine:
    """
    Evaluates potential Traditional Knowledge (TK) overlap against classical treatises
    (Charaka Samhita, Sharangadhara, AFI), builds the Prior-Art Radar graph nodes,
    and constructs the chronological Novelty Timeline.
    """

    def assess_tk_overlap(self, fingerprint: InnovationFingerprint) -> TKAssessment:
        detected_ing_names = [i.name.lower() for i in fingerprint.ingredients] + [i.scientific_name.lower() for i in fingerprint.ingredients if i.scientific_name]
        desc_lower = (fingerprint.title + " " + fingerprint.intended_use + " " + fingerprint.summary).lower()

        matched_formulations: List[MatchedClassicalFormulation] = []
        max_overlap = 0.0

        for ref in CLASSICAL_AYURVEDIC_REFERENCES:
            ref_ings = [r.lower() for r in ref["ingredients"]]
            common_ings = []
            for ing in detected_ing_names:
                for r_ing in ref_ings:
                    if r_ing in ing or ing in r_ing:
                        common_ings.append(r_ing.capitalize())
            common_ings = list(set(common_ings))

            # Trigger similarity check
            trigger_hits = sum(1 for t in ref.get("similarity_triggers", []) if t in desc_lower or any(t in i for i in detected_ing_names))

            if common_ings or trigger_hits > 0:
                sim = min(0.95, (len(common_ings) / max(1, len(ref_ings))) * 0.7 + (trigger_hits * 0.15))
                if sim > max_overlap:
                    max_overlap = sim
                matched_formulations.append(
                    MatchedClassicalFormulation(
                        name=ref["name"],
                        source_text=ref["source"],
                        overlapping_ingredients=common_ings if common_ings else ["Herb property overlap"],
                        traditional_indication=ref["indications"],
                        similarity_percentage=round(sim * 100, 1)
                    )
                )

        # Retrieve TKDL authoritative citation
        tkdl_citations = retriever.search(
            "TKDL prior art IPC A61K 36 Section 3p traditional knowledge Ayurvedic Formulary of India",
            jurisdiction="IN",
            limit=1
        )

        overlap_detected = max_overlap >= 0.40
        degree = "High" if max_overlap >= 0.75 else ("Moderate" if max_overlap >= 0.40 else "Low")

        explanation = (
            f"{degree} textual and ingredient overlap ({round(max_overlap*100, 1)}%) detected with classical codified Ayurvedic literature. "
            "Under Section 3(p) of the Patents Act, 1970 and TKDL search criteria, prior codified formulations preclude patent claims unless an unexpected synergistic effect, novel isolated bio-fraction, or inventive non-obvious process step is substantiated."
            if overlap_detected else
            "Low direct formulation overlap detected with primary classical formulations. However, individual ingredients possess codified traditional usages that patent examiners will cross-reference during examination."
        )

        return TKAssessment(
            overlap_detected=overlap_detected,
            similarity_degree=degree,
            similarity_score=round(max_overlap, 2),
            matched_formulations=matched_formulations,
            prior_art_signals=[
                f"Classical formulation match in {m.source_text} with {m.name}" for m in matched_formulations[:2]
            ],
            patentability_impact="High risk of Section 3(p) objection; formal prior-art clearance search advised" if overlap_detected else "Moderate prior-art scrutiny expected on individual herbal constituents",
            explanation=explanation,
            citations=tkdl_citations
        )

    def generate_radar_data(self, fingerprint: InnovationFingerprint, tk_assessment: TKAssessment) -> RadarData:
        nodes: List[RadarNode] = []

        # Center Innovation Node
        center_label = fingerprint.title or "Your Innovation"

        # 1. Classical TK Node (Charaka / Sharangadhara)
        sim_tk = max(0.45, tk_assessment.similarity_score)
        nodes.append(
            RadarNode(
                id="radar_node_tk",
                label="Codified Classical Treatise (TKDL / AFI)",
                category="tk",
                similarity=sim_tk,
                distance=round(1.0 - sim_tk, 2),
                angle=45.0,
                source_title="Traditional Knowledge Digital Library & Ayurvedic Formulary of India",
                section="IPC Class A61K 36/00",
                citation_id="TKDL_SEARCH_STANDARD",
                summary="Overlapping botanical components and therapeutic indications documented in ancient classical treatises."
            )
        )

        # 2. Academic Research Node (Bio-active Phytochemistry)
        nodes.append(
            RadarNode(
                id="radar_node_research",
                label="Peer-Reviewed Phytotherapy Publications",
                category="research",
                similarity=0.62,
                distance=0.38,
                angle=135.0,
                source_title="Journal of Ethnopharmacology / AYUSH Research Portal",
                section="Phytochemical extraction & Bioavailability",
                summary="Scientific studies demonstrating active marker compounds and known extraction benchmarks."
            )
        )

        # 3. Global Patent Landscape Node (WIPO / USPTO / EPO)
        nodes.append(
            RadarNode(
                id="radar_node_patent",
                label="Published Patent Landscape (IN / PCT / US)",
                category="patent",
                similarity=0.48,
                distance=0.52,
                angle=225.0,
                source_title="WIPO Patentscope & IP India Patent Database",
                section="Subclass A61K 36 (Herbal compositions)",
                summary="Prior patents claiming herbal extracts, synergistic adjuvants, and oral delivery matrices."
            )
        )

        # 4. Regulatory Standard Node (ASU Pharmacopoeia)
        nodes.append(
            RadarNode(
                id="radar_node_regulatory",
                label="Ayurvedic Pharmacopoeia of India (API Standards)",
                category="regulatory",
                similarity=0.78,
                distance=0.22,
                angle=315.0,
                source_title="Pharmacopoeia Commission for Indian Medicine & Homoeopathy (PCIM&H)",
                section="Monograph on Botanical Identification & Assay",
                summary="Official physicochemical standards, TLC/HPTLC profiles, and permissible heavy metal limits."
            )
        )

        return RadarData(
            center_label=center_label,
            nodes=nodes,
            max_similarity=sim_tk,
            high_risk_cluster=sim_tk > 0.70
        )

    def generate_timeline(self, fingerprint: InnovationFingerprint, tk_assessment: TKAssessment) -> List[TimelineItem]:
        matched_text = tk_assessment.matched_formulations[0].source_text if tk_assessment.matched_formulations else "Classical Ayurvedic Treatises (Brihat Trayi)"

        return [
            TimelineItem(
                id="time_1",
                title="Codified Classical Ayurvedic Documentation",
                era_or_date="c. 1000 BCE – 1500 CE",
                category="Classical Text",
                description=f"Initial therapeutic formulation and preparation codified in {matched_text}.",
                source_reference=matched_text,
                significance="Establishes prior art under Patents Act Section 3(p) and TKDL database."
            ),
            TimelineItem(
                id="time_2",
                title="Phytochemical Characterization & Pharmacopoeia Monograph",
                era_or_date="1980 – 2010",
                category="Modern Research",
                description="Identification of key bioactive withanolides, azadirachtins, and curcuminoids published in peer-reviewed literature.",
                source_reference="Ayurvedic Pharmacopoeia of India (PCIM&H)",
                significance="Defines public domain knowledge of active phytochemical markers."
            ),
            TimelineItem(
                id="time_3",
                title="WIPO Patent Disclosures & Formulation Prior Art",
                era_or_date="2012 – 2022",
                category="Prior Art Patent",
                description="Patent filings claiming standardized herbal extracts and multi-herbal combinations across Indian and PCT patent offices.",
                source_reference="Office of CGPDTM / WIPO Patentscope",
                significance="Represents intermediate patent examination benchmarks and cited prior art."
            ),
            TimelineItem(
                id="time_4",
                title="Innovator's Claimed Innovation Date",
                era_or_date="Present (Current Assessment Date)",
                category="Innovator Claim",
                description=f"User's proposed formulation: '{fingerprint.title}' with claimed novelty: {', '.join(fingerprint.claimed_novelty[:2])}.",
                source_reference="IP-SAKTI Innovation Intake",
                significance="Benchmark date for novelty and non-obviousness evaluation against preceding milestones."
            )
        ]

prior_art_engine = PriorArtTKEngine()
