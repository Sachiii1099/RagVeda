from typing import Dict, Any
from backend.models import ABSAssessmentRequest

class BiodiversityABSHelper:
    def __init__(self):
        pass

    def assess_compliance(self, req: ABSAssessmentRequest) -> Dict[str, Any]:
        # Case 1: AYUSH practitioner exemption
        if req.is_registered_ayush_practitioner_for_clinic:
            return {
                "governing_statute": "Biological Diversity Act, 2002 (amended by Biological Diversity (Amendment) Act, 2023)",
                "applicable_section": "Section 7 Proviso & Section 40 Exemptions",
                "is_exempt": True,
                "exemption_reason": "Registered AYUSH practitioners are statutorily EXEMPT from prior intimation to SBB under the 2023 Amendment when preparing formulations for own clinical dispensary practice.",
                "authority_to_approach": "None required for dispensary practice.",
                "required_form": "Statutory Exemption Certificate from State AYUSH Registration Board",
                "abs_cess_percentage": "0.0% (Exempt)",
                "mandatory_steps": [
                    "Maintain dispensary log proving preparation is for direct patient treatment.",
                    "Do not package for commercial OTC distribution without SBB intimation."
                ]
            }

        # Case 2: Foreign entity / NRI accessing resources
        if req.is_foreign_entity_or_has_foreign_equity or req.is_nri:
            return {
                "governing_statute": "Biological Diversity Act, 2002 (Section 3 & Section 19)",
                "applicable_section": "Section 3 read with Section 19 (Form I Approval)",
                "is_exempt": False,
                "exemption_reason": "Foreign individuals, NRIs, and Indian entities with foreign equity or management must obtain NBA prior approval.",
                "authority_to_approach": "National Biodiversity Authority (NBA), Chennai",
                "required_form": "NBA Form I (Access to Biological Resources)",
                "abs_cess_percentage": "3.0% to 5.0% of purchase price / ex-factory sale",
                "mandatory_steps": [
                    "Submit NBA Form I with prescribed application fee.",
                    "Execute Mutually Agreed Terms (MAT) benefit-sharing agreement.",
                    "Obtain NBA formal approval letter prior to physical access."
                ]
            }

        # Case 3: Applying for Patent / IPR
        if req.purpose == "ipr_patent_filing":
            return {
                "governing_statute": "Biological Diversity Act, 2002 (Section 6 & Section 19)",
                "applicable_section": "Section 6 (NBA Form III Approval)",
                "is_exempt": False,
                "exemption_reason": "Mandatory prior approval of NBA required before applying for or sealing any patent based on biological resources sourced from India.",
                "authority_to_approach": "National Biodiversity Authority (NBA), Chennai",
                "required_form": "NBA Form III (Application for IPR Clearance)",
                "abs_cess_percentage": "0.2% to 0.5% on commercial royalty revenue",
                "mandatory_steps": [
                    "File NBA Form III after provisional patent application or prior to patent grant.",
                    "Disclose source and geographical origin in patent complete specification (Section 10(4)(d)(ii))."
                ]
            }

        # Case 4: Indian Commercial Entity
        return {
            "governing_statute": "Biological Diversity Act, 2002 (Section 7)",
            "applicable_section": "Section 7 (SBB Prior Intimation)",
            "is_exempt": False,
            "exemption_reason": "Indian entities accessing biological resources for commercial utilization must intimate the concerned State Biodiversity Board.",
            "authority_to_approach": "State Biodiversity Board (SBB) of relevant State",
            "required_form": "SBB Form I (State Intimation Form)",
            "abs_cess_percentage": "0.1% to 0.5% of ex-factory gross sales turnover",
            "mandatory_steps": [
                "Submit prior intimation to State Biodiversity Board.",
                "Pay the prescribed ABS cess according to annual gross turnover bracket.",
                "Maintain traceability records from local Biodiversity Management Committees (BMCs)."
            ]
        }
