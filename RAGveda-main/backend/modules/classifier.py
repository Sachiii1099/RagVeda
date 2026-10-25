from typing import Dict, Any, List
from backend.models import ClassificationRequest

class FormulationDecisionTree:
    def __init__(self):
        pass

    def evaluate_formulation(self, request: ClassificationRequest) -> Dict[str, Any]:
        # Category 1: Classical ASU Medicine
        if request.is_classical_text_recipe and not request.has_ingredient_modifications and not request.is_purified_standardized_fraction:
            return {
                "category_id": "classical_asu",
                "category_name": "Classical Ayurvedic (ASU) Medicine",
                "statutory_category": "Classical Formulation under Section 3(a) of Drugs and Cosmetics Act, 1940",
                "governing_act": "The Drugs and Cosmetics Act, 1940 & Rules 1945",
                "governing_section_or_rule": "Section 3(a) read with First Schedule & Rule 158B Table I",
                "licensing_authority": "State AYUSH Licensing Authority",
                "licensing_form": "Form 24D / Form 25D (AYUSH Drug Manufacturing License)",
                "mandatory_compliance_checks": [
                    f"Must strictly adhere to formula in {request.classical_text_name or 'First Schedule 54 Authoritative Books'}.",
                    "Exempt from safety toxicity and clinical efficacy trials under Rule 158B Table I.",
                    "Must comply with Ayurvedic Pharmacopoeia of India (API) standards.",
                    "Good Manufacturing Practices (GMP) compliance under Schedule T mandatory."
                ],
                "ip_patentability_risk": "VERY HIGH (Section 3(p) Traditional Knowledge Bar)",
                "ip_strategy_recommendations": [
                    "Cannot be patented as a composition of matter due to Section 3(p) of Patents Act.",
                    "Protect via Coined Word Trademark (Class 5).",
                    "Protect novel delivery applicator or device packaging under Designs Act 2000."
                ],
                "prohibited_claims": [
                    "Cannot make claims for diseases prohibited under Drugs and Magic Remedies (Objectionable Advertisements) Act 1954."
                ]
            }

        # Category 2: Phytopharmaceutical Drug
        if request.is_purified_standardized_fraction or request.bioactive_markers_count >= 4:
            return {
                "category_id": "phytopharmaceutical",
                "category_name": "Phytopharmaceutical Drug",
                "statutory_category": "Phytopharmaceutical under Rule 122E / New Drugs and Clinical Trials Rules 2019",
                "governing_act": "The Drugs and Cosmetics Act, 1940 read with New Drugs and Clinical Trials Rules, 2019",
                "governing_section_or_rule": "Rule 122E and Chapter IV (CDSCO Clearance)",
                "licensing_authority": "Drugs Controller General of India (DCGI / CDSCO) Central Clearance + State SLA",
                "licensing_form": "Form CT-18 / Form CT-20 (New Drug Clearance)",
                "mandatory_compliance_checks": [
                    "Minimum 4 bioactive/chromatographic marker compounds identified and quantified.",
                    "Phase I, II, and III Clinical Trials required.",
                    "Published botanical safety data and chromatographic fingerprinting (HPLC/LC-MS) required."
                ],
                "ip_patentability_risk": "LOW TO MODERATE (Strong Patentability Pathway)",
                "ip_strategy_recommendations": [
                    "Eligible for Patenting under Section 3(p) if novel selective extraction process or synergistic bioactive profile is established.",
                    "File NBA Form III prior to patent filing under Section 6 of Biological Diversity Act.",
                    "International patent filing via PCT System under Rule 51bis with WIPO GRATK origin disclosure."
                ],
                "prohibited_claims": [
                    "Strictly governed by approved CDSCO package insert claims."
                ]
            }

        # Category 3: Ayurveda-Aahar
        if request.intended_use == "dietary_nutrition":
            return {
                "category_id": "ayurveda_aahar",
                "category_name": "Ayurveda Aahar (Traditional Dietary Food)",
                "statutory_category": "Ayurveda Aahar under FSSAI Regulations 2022",
                "governing_act": "Food Safety and Standards (Ayurveda Aahar) Regulations, 2022",
                "governing_section_or_rule": "FSSAI Ayurveda Aahar Regulations 2022 (Reg 3, 4, 8)",
                "licensing_authority": "Food Safety and Standards Authority of India (FSSAI)",
                "licensing_form": "FSSAI Central / State Food License with Ayurveda Aahar Logo",
                "mandatory_compliance_checks": [
                    "Must be prepared in accordance with recipes or ingredients recognized in authoritative Ayurvedic texts.",
                    "Must NOT contain any synthetic vitamins, synthetic minerals, or synthetic amino acids.",
                    "Must prominently display the official Ayurveda Aahar logo and advisory: 'NOT FOR MEDICINAL USE'."
                ],
                "ip_patentability_risk": "HIGH",
                "ip_strategy_recommendations": [
                    "Protect distinctive branding, recipes, and packaging trade dress under Trade Marks Act 1999 (Class 29/30/32).",
                    "Do not seek composition patents unless synergistic dietary combinations can be scientifically validated."
                ],
                "prohibited_claims": [
                    "Strictly PROHIBITED from claiming treatment, cure, or mitigation of any disease or disorder."
                ]
            }

        # Category 4: Ayurvedic Cosmetic
        if request.intended_use == "external_beauty":
            return {
                "category_id": "ayurvedic_cosmetic",
                "category_name": "Ayurvedic Cosmetic (Saundarya Prasadana)",
                "statutory_category": "Cosmetic with Ayurvedic Ingredients under Cosmetics Rules 2020",
                "governing_act": "Cosmetics Rules, 2020 / Drugs and Cosmetics Act 1940",
                "governing_section_or_rule": "Cosmetics Rules 2020 Rule 12 / Form COS-8",
                "licensing_authority": "State Licensing Authority (Cosmetics Division)",
                "licensing_form": "Form COS-8 (Cosmetics Manufacturing License)",
                "mandatory_compliance_checks": [
                    "Must comply with BIS Standards for cosmetics (IS 4707).",
                    "Heavy metals limit testing (Lead, Arsenic, Mercury).",
                    "Microbiological burden compliance testing mandatory."
                ],
                "ip_patentability_risk": "MODERATE",
                "ip_strategy_recommendations": [
                    "Patenting novel cosmetic delivery vehicles (liposomal, serum formulations) possible if stability/transdermal absorption is demonstrated.",
                    "Trademark protection under Class 3 (Cosmetics & Perfumery)."
                ],
                "prohibited_claims": [
                    "Cannot claim therapeutic treatment for skin disorders like eczema or psoriasis without drug licensing."
                ]
            }

        # Default Category 5: Patent / Proprietary ASU Medicine
        return {
            "category_id": "patent_proprietary_asu",
            "category_name": "Patent / Proprietary Ayurvedic (ASU) Medicine",
            "statutory_category": "Patent or Proprietary Medicine under Section 3(h) of Drugs and Cosmetics Act, 1940",
            "governing_act": "The Drugs and Cosmetics Act, 1940 & Rules 1945",
            "governing_section_or_rule": "Section 3(h) read with Rule 158B Table II & Table III",
            "licensing_authority": "State AYUSH Licensing Authority",
            "licensing_form": "Form 24D / Form 25D (Proprietary ASU License)",
            "mandatory_compliance_checks": [
                "All botanical ingredients must be listed in authoritative texts of First Schedule.",
                "Published safety/toxicity literature or acute/sub-acute animal toxicity studies required under Rule 158B Table II.",
                "Proof of therapeutic efficacy required via pilot clinical trial or published literature."
            ],
            "ip_patentability_risk": "HIGH (Section 3(p) & 3(e) Aggregation Bar)",
            "ip_strategy_recommendations": [
                "To overcome Section 3(p) & 3(e), applicant must prove synergistic interaction (Combination Index CI < 0.7) or novel extraction process.",
                "File NBA Form III prior to patent filing if using biological resources from India.",
                "Class 5 Trademark protection for proprietary coined brand name."
            ],
            "prohibited_claims": [
                "Cannot claim treatment for diseases prohibited under Drugs and Magic Remedies Act 1954."
            ]
        }
