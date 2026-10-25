from typing import List, Dict, Any, Tuple
from app.schemas.fingerprint import InnovationFingerprint
from app.schemas.assessment import RegulatoryAssessment, ProductClassification, ComplianceAction, Citation
from app.retrieval.hybrid_search import retriever

class RegulatoryNavigator:
    """
    Connects the product classification to statutory licensing forms,
    Rule 158-B proof requirements, testing monographs, and compliance action checklists.
    """

    def navigate(
        self,
        fingerprint: InnovationFingerprint,
        classification: ProductClassification,
        jurisdiction: str = "IN"
    ) -> Tuple[RegulatoryAssessment, int, List[ComplianceAction]]:
        citations: List[Citation] = []
        actions: List[ComplianceAction] = []

        if jurisdiction == "INT":
            # International Regulatory Path (US FDA / EU)
            citations = retriever.search(
                "US FDA Guidance Botanical Drug Development Dietary Supplement DSHEA WIPO",
                jurisdiction="INT",
                limit=2
            )
            assessment = RegulatoryAssessment(
                regulatory_framework="US FDA 21 CFR Part 312 (Botanical Drug) / DSHEA (Dietary Supplement)",
                authority="US Food and Drug Administration (FDA) / European Medicines Agency (EMA)",
                licensing_pathway="Dietary Supplement Pre-Market Notification (NDI) or Botanical Investigational New Drug (IND)",
                licensing_form="FDA Form 1571 (IND) or 75-Day NDI Notification",
                rule_158b_applicable=False,
                safety_evidence_required="Batch-to-batch chemical fingerprinting (HPLC/LC-MS) and heavy metal testing per USP limits.",
                clinical_trial_required=True if "drug" in classification.category else False,
                labelling_advertising_guidelines=[
                    "Dietary supplements CANNOT make disease claims ('cures diabetes', 'treats cancer') - only structure/function claims allowed.",
                    "Must bear FDA disclaimer: 'This statement has not been evaluated by the Food and Drug Administration.'",
                    "Mandatory testing for USP elemental impurities (Lead, Arsenic, Cadmium, Mercury)."
                ],
                checkpoints=[
                    "Facility registration under US FDA Bioterrorism Act",
                    "Certificate of Analysis for each raw botanical consignment",
                    "Validation of solvent residue and pesticide limits"
                ],
                citations=citations
            )

            actions = [
                ComplianceAction(
                    id="act_int_1",
                    title="US FDA Dietary Supplement vs Botanical Drug Decision",
                    priority="CRITICAL",
                    status="pending",
                    category="Regulatory",
                    description="Decide whether to enter US as a wellness dietary supplement (no disease claims) or invest in botanical IND clinical trials.",
                    authority="US FDA CDER",
                    recommended_timeline="Within 30 days"
                ),
                ComplianceAction(
                    id="act_int_2",
                    title="Standardized Chemical Fingerprinting & Traceability Monograph",
                    priority="HIGH",
                    status="pending",
                    category="Regulatory",
                    description="Develop HPLC/HPTLC batch fingerprinting to satisfy US FDA botanical raw material consistency guidelines.",
                    authority="Accredited Testing Laboratory",
                    recommended_timeline="Within 60 days"
                ),
                ComplianceAction(
                    id="act_int_3",
                    title="WIPO PCT Patent International Search",
                    priority="MEDIUM",
                    status="pending",
                    category="IP",
                    description="If seeking international patent, file PCT application within 12 months of Indian provisional priority date.",
                    authority="WIPO International Bureau",
                    recommended_timeline="Prior to 12-month priority deadline"
                )
            ]
            readiness_score = 45
            return assessment, readiness_score, actions

        # Domestic Indian Jurisdiction
        if classification.category == "ayush_aahar":
            citations = retriever.search("Ayush Aahar Regulations 2022 FSSAI License Schedule I", jurisdiction="IN", limit=2)
            assessment = RegulatoryAssessment(
                regulatory_framework="Food Safety and Standards (Ayush Aahar) Regulations, 2022",
                authority="Food Safety and Standards Authority of India (FSSAI) & State Food Safety Department",
                licensing_pathway="Central / State FSSAI License under Food Category 13 (Ayush Aahar)",
                licensing_form="FSSAI FoSCoS Online Application Form B",
                rule_158b_applicable=False,
                safety_evidence_required="Nutritional profiling, microbial parameters, and shelf-life stability per FSSAI standards.",
                clinical_trial_required=False,
                labelling_advertising_guidelines=[
                    "Prominent display of the official green 'Ayush Aahar' logo.",
                    "No therapeutic medicinal disease treatment claims are permitted.",
                    "Clear warning: 'Not for medicinal use / Not a substitute for a balanced diet'."
                ],
                checkpoints=[
                    "Verify ingredients match authoritative classical recipes per Schedule A of Ayush Aahar regulations",
                    "FSSAI FoSCoS manufacturing premises audit",
                    "Food packaging migration testing"
                ],
                citations=citations
            )
            actions = [
                ComplianceAction(
                    id="act_aa_1",
                    title="FSSAI FoSCoS Ayush Aahar License Application",
                    priority="HIGH",
                    status="pending",
                    category="Regulatory",
                    description="Submit online application under Category 13 (Ayush Aahar) with classical recipe references.",
                    authority="FSSAI",
                    recommended_timeline="Within 3 weeks"
                ),
                ComplianceAction(
                    id="act_aa_2",
                    title="Packaging and Label Review for Disease Claim Exclusions",
                    priority="CRITICAL",
                    status="pending",
                    category="Regulatory",
                    description="Audit marketing copy and cartons to ensure zero prohibited disease claims under FSSAI Advertising Regulations.",
                    authority="Legal & Regulatory Reviewer",
                    recommended_timeline="Prior to commercial print run"
                )
            ]
            readiness_score = 70
            return assessment, readiness_score, actions

        elif classification.category == "cosmetic":
            citations = retriever.search("Ayurvedic cosmetic Rule 158B Drugs and Cosmetics Rules Form 32A", jurisdiction="IN", limit=2)
            assessment = RegulatoryAssessment(
                regulatory_framework="The Drugs and Cosmetics Rules, 1945 (Part XIII: Manufacture of Cosmetics)",
                authority="State Licensing Authority (Ayush / Food & Drug Administration)",
                licensing_pathway="Grant of Manufacturing License for Ayurvedic Cosmetics",
                licensing_form="Form 31A / Form 32A (Cosmetic Manufacturing License)",
                rule_158b_applicable=True,
                safety_evidence_required="Skin irritation test (Draize test / patch test) and heavy metal screening (Lead < 20ppm, Arsenic < 2ppm).",
                clinical_trial_required=False,
                labelling_advertising_guidelines=[
                    "Label statement: 'Ayurvedic Proprietary Cosmetic' or 'For External Cleansing/Beautifying Only'.",
                    "Full ingredient disclosure with botanical nomenclature.",
                    "No disease treatment claims (e.g. cures psoriasis/alopecia)."
                ],
                checkpoints=[
                    "GMP certified cosmetic manufacturing facility",
                    "Preservative efficacy testing",
                    "Stability testing at room temperature and accelerated conditions"
                ],
                citations=citations
            )
            actions = [
                ComplianceAction(
                    id="act_cos_1",
                    title="Skin Safety & Patch Testing Certification",
                    priority="HIGH",
                    status="pending",
                    category="Regulatory",
                    description="Conduct dermatological patch testing at an accredited GLP testing laboratory.",
                    authority="State FDA / Accredited Lab",
                    recommended_timeline="Within 30 days"
                ),
                ComplianceAction(
                    id="act_cos_2",
                    title="State Licensing Authority Cosmetic Manufacturing Filing",
                    priority="HIGH",
                    status="pending",
                    category="Regulatory",
                    description="Submit Form 31A with product master formula and packaging layout.",
                    authority="State Licensing Authority (AYUSH)",
                    recommended_timeline="Within 45 days"
                )
            ]
            readiness_score = 65
            return assessment, readiness_score, actions

        elif classification.category == "classical_ayurvedic":
            citations = retriever.search("Section 3a Drugs and Cosmetics Act First Schedule Form 25D classical medicine", jurisdiction="IN", limit=2)
            assessment = RegulatoryAssessment(
                regulatory_framework="The Drugs and Cosmetics Act, 1940 (Chapter IV-A) & Rules, 1945",
                authority="State Licensing Authority (AYUSH / Indian Systems of Medicine)",
                licensing_pathway="Standard Classical ASU Drug Manufacturing License",
                licensing_form="Form 24D (Application) & Form 25D (Licence Grant)",
                rule_158b_applicable=False,
                safety_evidence_required="Reference citation to First Schedule authoritative text (e.g. AFI, Charaka, Sharangadhara). No independent clinical trial mandated.",
                clinical_trial_required=False,
                labelling_advertising_guidelines=[
                    "Prominent text: 'For Ayurvedic Treatment Only' (Rule 161).",
                    "Official Sanskrit name followed by botanical name of all active ingredients.",
                    "Manufacturing licence number, batch number, date of mfg and expiry."
                ],
                checkpoints=[
                    "Compliance with Schedule T Good Manufacturing Practices (GMP)",
                    "In-house testing facility for identity, purity, and assay",
                    "Approved Technical Staff holding recognized Ayurvedic qualification"
                ],
                citations=citations
            )
            actions = [
                ComplianceAction(
                    id="act_cla_1",
                    title="Schedule T GMP Verification of Facility",
                    priority="CRITICAL",
                    status="pending",
                    category="Regulatory",
                    description="Ensure manufacturing unit conforms to Schedule T sanitary and machinery guidelines.",
                    authority="State AYUSH Inspectorate",
                    recommended_timeline="Immediate"
                ),
                ComplianceAction(
                    id="act_cla_2",
                    title="Submission of Form 24D with First Schedule Textual Citations",
                    priority="HIGH",
                    status="pending",
                    category="Regulatory",
                    description="File Form 24D citing exact sloka / page references from authoritative classical pharmacopoeia.",
                    authority="State AYUSH Licensing Authority",
                    recommended_timeline="Within 30 days"
                )
            ]
            readiness_score = 75
            return assessment, readiness_score, actions

        else:
            # Proprietary Ayurvedic Medicine (Rule 158-B)
            citations = retriever.search("Rule 158B Patent or Proprietary Ayurvedic Medicine Form 25D proof of effectiveness", jurisdiction="IN", limit=2)
            assessment = RegulatoryAssessment(
                regulatory_framework="The Drugs and Cosmetics Act, 1940 & Rules, 1945 (Rule 158-B)",
                authority="State Licensing Authority (AYUSH)",
                licensing_pathway="Patent or Proprietary (P&P) Ayurvedic Drug Manufacturing License",
                licensing_form="Form 24D (Application) & Form 25D (Licence Grant with Rule 158-B Annexure)",
                rule_158b_applicable=True,
                safety_evidence_required=(
                    "Rule 158-B proof of safety: If traditional ingredients in new ratios: published pharmacological/safety literature. "
                    "If new therapeutic indications or novel extraction: acute/sub-chronic animal toxicity studies and published pilot clinical evidence."
                ),
                clinical_trial_required=True if fingerprint.preparation_method.modified else False,
                labelling_advertising_guidelines=[
                    "Label statement: 'Patent or Proprietary Ayurvedic Medicine' (Rule 161).",
                    "Display of all active ingredients with Ayurvedic and botanical names.",
                    "Strict prohibition against advertising claims of cure for Schedule J incurable conditions."
                ],
                checkpoints=[
                    "Certificate of Analysis for active ingredients matching Ayurvedic Pharmacopoeia standards",
                    "Rule 158-B Safety and Efficacy Dossier submission",
                    "Schedule T GMP compliance audit by Drug Inspector"
                ],
                citations=citations
            )
            actions = [
                ComplianceAction(
                    id="act_prop_1",
                    title="Compile Rule 158-B Proof of Safety and Effectiveness Dossier",
                    priority="CRITICAL",
                    status="pending",
                    category="Regulatory",
                    description="Compile published scientific studies, monograph references, and accelerated stability data required under Rule 158-B.",
                    authority="State AYUSH Licensing Authority",
                    recommended_timeline="Within 30 days"
                ),
                ComplianceAction(
                    id="act_prop_2",
                    title="Form I Intimation to State Biodiversity Board (SBB)",
                    priority="HIGH",
                    status="pending",
                    category="Biodiversity",
                    description="Submit prior intimation for commercial utilization of wild biological resources under Section 7 of BDA 2002.",
                    authority="State Biodiversity Board",
                    recommended_timeline="Within 45 days"
                ),
                ComplianceAction(
                    id="act_prop_3",
                    title="Trademark Availability Clearance in Class 5",
                    priority="MEDIUM",
                    status="pending",
                    category="IP",
                    description="Search IP India trademark records and file trademark application for brand protection.",
                    authority="Trade Marks Registry (CGPDTM)",
                    recommended_timeline="Within 60 days"
                )
            ]
            readiness_score = 60
            return assessment, readiness_score, actions

regulatory_navigator = RegulatoryNavigator()
