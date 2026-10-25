from typing import List, Dict, Any
from app.schemas.fingerprint import InnovationFingerprint
from app.schemas.innovation import ClarificationQuestion

class ClarificationEngine:
    """
    Selects 1-3 minimum necessary questions that materially change
    statutory decision variables (Section 3(a) vs Rule 158B vs FSSAI; Section 3 vs 7 ABS).
    """

    def select_questions(self, fingerprint: InnovationFingerprint) -> List[ClarificationQuestion]:
        questions: List[ClarificationQuestion] = []

        # Question 1: Classical Origin vs Novel Formulation
        # Critical for Section 3(a) Classical Medicine vs Rule 158-B Proprietary Medicine vs Sec 3(p) Patent rejection
        questions.append(
            ClarificationQuestion(
                id="q_classical_origin",
                question="Is your formulation recipe taken directly from a classical Ayurvedic text (e.g. Charaka Samhita, Sharangadhara, AFI) without changes?",
                why_we_ask="Direct classical formulations are strictly excluded from patentability under Patents Act Section 3(p), but qualify for faster Drug Licensing under Section 3(a) without clinical trial requirements.",
                options=[
                    "Yes, manufactured exactly as per classical texts (First Schedule)",
                    "No, it combines classical herbs in a new ratio or modified process",
                    "It is a novel purified active phytochemical extract"
                ],
                impact_variable="classical_origin"
            )
        )

        # Question 2: Sourcing of Biological Resources
        # Critical for Biological Diversity Act 2023 exemptions vs Section 3 / Section 7 SBB/NBA mandates
        questions.append(
            ClarificationQuestion(
                id="q_resource_sourcing",
                question="How and where are the botanical biological resources sourced?",
                why_we_ask="Under the Biological Diversity (Amendment) Act 2023, certified cultivated medicinal plants with Certificate of Origin are exempt from State Biodiversity Board (SBB) ABS payments, whereas wild-harvested resources mandate prior intimation.",
                options=[
                    "Cultivated on private/contract farms with Certificate of Origin",
                    "Procured from wild harvest / forest areas in India",
                    "Imported from outside India"
                ],
                impact_variable="biological_sourcing"
            )
        )

        # Question 3: Commercial Target Market
        # Critical for Indian AYUSH vs International WIPO/PCT and US FDA Botanical / DSHEA rules
        if "INT" in fingerprint.target_markets or "US" in fingerprint.target_markets:
            questions.append(
                ClarificationQuestion(
                    id="q_target_market",
                    question="Do you plan to export to international markets like the United States or European Union?",
                    why_we_ask="Ayurvedic drugs exported to the US must comply with US FDA Botanical Drug Guidance (IND/NDA) or be marketed strictly as Dietary Supplements (DSHEA) with no therapeutic disease treatment claims.",
                    options=[
                        "Solely domestic commercialization in India",
                        "Export as Dietary Supplement / Wellness Food",
                        "Seeking US FDA / EMA botanical drug approval"
                    ],
                    impact_variable="target_market"
                )
            )

        return questions

clarification_engine = ClarificationEngine()
