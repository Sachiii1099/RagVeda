import copy
from typing import Dict, Any, List
from app.schemas.fingerprint import InnovationFingerprint
from app.schemas.scenario import ScenarioComparison, ScenarioDiffItem
from app.engines.classification_engine import classification_engine
from app.engines.ip_engine import ip_engine
from app.engines.biodiversity_engine import biodiversity_engine
from app.engines.regulatory_engine import regulatory_navigator

class WhatIfEngine:
    """
    Clones baseline innovation fingerprint, applies parameter modifications,
    runs the deterministic decision pipeline, and computes side-by-side comparative diffs.
    """

    def simulate(
        self,
        innovation_id: str,
        baseline_fingerprint: InnovationFingerprint,
        scenario_title: str,
        delta_params: Dict[str, Any]
    ) -> ScenarioComparison:
        # Clone baseline fingerprint
        modified_fp = copy.deepcopy(baseline_fingerprint)

        # Apply deltas
        diff_items: List[ScenarioDiffItem] = []

        # 1. Preparation Method Delta (e.g. Traditional -> Modified Novel Extraction)
        if "preparation_method" in delta_params:
            pm_delta = delta_params["preparation_method"]
            old_mod = baseline_fingerprint.preparation_method.modified
            new_mod = pm_delta.get("modified", old_mod)
            modified_fp.preparation_method.modified = new_mod
            if "novel_features" in pm_delta:
                modified_fp.preparation_method.novel_features = pm_delta["novel_features"]
                modified_fp.claimed_novelty.extend(pm_delta["novel_features"])

            diff_items.append(
                ScenarioDiffItem(
                    area="Patentability & Inventive Step",
                    parameter="Preparation Method",
                    baseline_value="Codified Traditional Method" if not old_mod else "Modified",
                    scenario_value="Novel Proprietary Extraction / Nanotechnology" if new_mod else "Traditional",
                    impact_summary="Section 3(p) strict exclusion overcome; now eligible to claim Process Patent subject to proving unexpected efficacy.",
                    risk_change="Decreased" if new_mod else "Neutral"
                )
            )

        # 2. Biological Resource Origin Delta (e.g. Wild Harvested -> Certified Cultivated)
        if "biological_sourcing" in delta_params:
            src_val = delta_params["biological_sourcing"]
            diff_items.append(
                ScenarioDiffItem(
                    area="Biodiversity & ABS Obligations",
                    parameter="Raw Material Sourcing",
                    baseline_value="Domestic Wild Harvest / Unspecified",
                    scenario_value=f"Certified Cultivated: {src_val}",
                    impact_summary="Qualifies for ABS payment exemption under Biological Diversity (Amendment) Act 2023 with verified Certificate of Origin.",
                    risk_change="Decreased"
                )
            )

        # 3. Target Jurisdiction Delta (e.g. India Only -> Export to USA)
        if "target_markets" in delta_params:
            new_markets = delta_params["target_markets"]
            old_markets = baseline_fingerprint.target_markets
            modified_fp.target_markets = new_markets

            diff_items.append(
                ScenarioDiffItem(
                    area="Regulatory & Market Access",
                    parameter="Target Jurisdiction",
                    baseline_value=", ".join(old_markets),
                    scenario_value=", ".join(new_markets),
                    impact_summary="Triggers US FDA Botanical Drug Guidance or DSHEA dietary supplement compliance; requires WIPO PCT patent filing.",
                    risk_change="Increased"
                )
            )

        # Run comparative assessment
        baseline_cls = classification_engine.classify(baseline_fingerprint)
        _, baseline_readiness, _ = regulatory_navigator.navigate(baseline_fingerprint, baseline_cls, baseline_fingerprint.target_markets[0] if baseline_fingerprint.target_markets else "IN")

        sim_cls = classification_engine.classify(modified_fp)
        sim_target = modified_fp.target_markets[0] if modified_fp.target_markets else "IN"
        _, scenario_readiness, _ = regulatory_navigator.navigate(modified_fp, sim_cls, sim_target)

        # Recommendation
        rec = "The modified scenario improves patent viability while shifting regulatory documentation requirements." if diff_items else "No substantial change in statutory outcomes."

        return ScenarioComparison(
            innovation_id=innovation_id,
            scenario_id="sim_" + str(hash(scenario_title))[:8],
            title=scenario_title,
            baseline_readiness=baseline_readiness,
            scenario_readiness=scenario_readiness,
            diff_items=diff_items,
            recommendation=rec
        )

what_if_engine = WhatIfEngine()
