from typing import Dict, Any, List
from app.schemas.fingerprint import InnovationFingerprint
from app.schemas.assessment import BiodiversityAssessment, Citation
from app.retrieval.hybrid_search import retriever

class BiodiversityABSEngine:
    """
    Evaluates potential Access and Benefit Sharing (ABS) requirements under
    The Biological Diversity Act, 2002 and Biological Diversity (Amendment) Act, 2023.
    """

    def evaluate(self, fingerprint: InnovationFingerprint, answers: Dict[str, str] = None) -> BiodiversityAssessment:
        answers = answers or {}
        sourcing_answer = answers.get("q_resource_sourcing", "")
        has_bio_resources = len(fingerprint.biological_resources) > 0 or len(fingerprint.ingredients) > 0

        # Retrieve authentic statutory citations from Biological Diversity Act
        bda_citations = retriever.search(
            "Biological Diversity Act Section 3 Section 7 SBB intimation NBA approval ABS 2023 amendment",
            jurisdiction="IN",
            limit=2
        )

        threatened_species = [ing.name for ing in fingerprint.ingredients if ing.is_threatened_or_endangered]

        if not has_bio_resources:
            return BiodiversityAssessment(
                biological_resource_detected=False,
                potential_abs_consideration="NO",
                relevant_authority="Not Applicable",
                statutory_provision="Not Applicable",
                required_filings=[],
                what_to_verify=["Verify that no wild flora or micro-organisms are utilized in production."],
                statutory_warning="No biological resources detected in current formulation.",
                citations=[]
            )

        # Check for 2023 Amendment Cultivation Exemption
        is_cultivated_exempt = "cultivated" in sourcing_answer.lower()

        if is_cultivated_exempt and not threatened_species:
            return BiodiversityAssessment(
                biological_resource_detected=True,
                potential_abs_consideration="NO (Exemption Likely under 2023 Amendment)",
                relevant_authority="State Biodiversity Board (SBB) / National Biodiversity Authority (NBA)",
                statutory_provision="Biological Diversity (Amendment) Act 2023, Section 40 & Exemption Rules",
                required_filings=[
                    "Maintain verifiable Certificate of Origin from recognized farmers / cultivator societies",
                    "Keep purchase invoices and agricultural cultivation logs for regulatory audit"
                ],
                what_to_verify=[
                    "Confirm raw materials are purely farm-cultivated and not supplemented with wild-harvested biomass.",
                    "Obtain Certificate of Origin from the supplier or District Agriculture/Forest Department."
                ],
                statutory_warning=(
                    "Under the Biological Diversity (Amendment) Act 2023, cultivated medicinal plants with verifiable Certificate of Origin "
                    "are exempted from prior intimation to the State Biodiversity Board. "
                    "Note: Benefit-sharing percentages are NOT fixed by AI and must never be presumed without official determinations."
                ),
                citations=bda_citations
            )

        # Wild-harvested or unknown sourcing
        authority = "State Biodiversity Board (SBB)"
        statutory_provision = "Section 7, The Biological Diversity Act, 2002"
        filings = [
            "Form I prior intimation to the State Biodiversity Board (SBB) before commercial utilization",
            "Maintain traceability records of the local procurement source"
        ]

        if threatened_species:
            filings.append(f"Special transit and transit permit under Wildlife Protection / State Forest rules for endangered species: {', '.join(threatened_species)}")

        return BiodiversityAssessment(
            biological_resource_detected=True,
            potential_abs_consideration="YES - Prior Intimation to SBB Required",
            relevant_authority=authority,
            statutory_provision=statutory_provision,
            required_filings=filings,
            what_to_verify=[
                "Verify whether the accessing entity has any foreign equity participation or non-Indian directors (which triggers Section 3 NBA jurisdiction rather than Section 7 SBB).",
                "Ascertain the exact territorial origin of wild harvested botanical ingredients within the state.",
                "Verify whether local BMCs (Biodiversity Management Committees) have notified specific conservation levies."
            ],
            statutory_warning=(
                "Indian entities accessing biological resources from wild harvest for commercial utilization must submit prior intimation to the concerned State Biodiversity Board under Section 7. "
                "WARNING: IP-SAKTI does NOT assess or promise a specific ABS fee or percentage. ABS determinations are negotiated between the applicant and the SBB/NBA under statutory guidelines."
            ),
            citations=bda_citations
        )

biodiversity_engine = BiodiversityABSEngine()
