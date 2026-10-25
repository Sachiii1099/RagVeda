from typing import Dict, Any, List
from app.schemas.fingerprint import InnovationFingerprint
from app.schemas.assessment import ProductClassification, Citation
from app.retrieval.hybrid_search import retriever

class ProductClassificationEngine:
    """
    Classifies the innovation into statutory product categories
    based on ingredient composition, preparation method, and intended use,
    backed by retrieved Level 1 statutory citations.
    """

    def classify(self, fingerprint: InnovationFingerprint, answers: Dict[str, str] = None) -> ProductClassification:
        answers = answers or {}
        use_lower = fingerprint.intended_use.lower()
        form_lower = fingerprint.product_form.lower()
        classical_answer = answers.get("q_classical_origin", "")

        citations: List[Citation] = []
        reasons: List[str] = []

        # 1. Cosmetic Check
        if any(w in use_lower or w in form_lower for w in ["cosmetic", "cream", "serum", "complexion", "shampoo", "hair growth", "skincare"]):
            cit = retriever.search("Ayurvedic cosmetic Rule 158B Drugs and Cosmetics Act", jurisdiction="IN", limit=1)
            citations.extend(cit)
            return ProductClassification(
                category="cosmetic",
                category_display="Ayurvedic Cosmetic (ASU Cosmetic)",
                confidence=0.92,
                reasons=[
                    "Intended strictly for topical application for cleansing, beautifying, or altering appearance.",
                    "Formulated with herbal ingredients recognized in classical Ayurvedic texts without strong medicinal claims."
                ],
                applicable_statute="Drugs and Cosmetics Rules 1945, Rule 158-B (Licence for ASU Cosmetics)",
                needs_human_review=False,
                citations=citations
            )

        # 2. Ayush Aahar / Food Supplement Check
        if any(w in use_lower or w in form_lower for w in ["food", "nutrition", "dietary supplement", "beverage", "tea", "wellness snack"]):
            cit = retriever.search("Ayush Aahar FSSAI Regulations 2022 Schedule I", jurisdiction="IN", limit=1)
            citations.extend(cit)
            return ProductClassification(
                category="ayush_aahar",
                category_display="Ayush Aahar / Food Supplement",
                confidence=0.88,
                reasons=[
                    "Positioned as nutritional food or dietary supplement rather than a prescription therapeutic drug.",
                    "Must comply with FSSAI Ayush Aahar Regulations 2022 without making specific disease treatment claims."
                ],
                applicable_statute="Food Safety and Standards (Ayush Aahar) Regulations, 2022",
                needs_human_review=False,
                citations=citations
            )

        # 3. Phytopharmaceutical Check
        if ("phytopharmaceutical" in use_lower or 
            fingerprint.preparation_method.modified and any("fraction" in n or "nanotechnology" in n for n in fingerprint.preparation_method.novel_features)):
            cit = retriever.search("Phytopharmaceutical Drug CDSCO New Drug", jurisdiction="IN", limit=1)
            citations.extend(cit)
            return ProductClassification(
                category="phytopharmaceutical",
                category_display="Phytopharmaceutical Drug Candidate",
                confidence=0.85,
                reasons=[
                    "Involves purified, standardized botanical fractions or advanced nanotechnology delivery.",
                    "Requires New Drug approval under CDSCO guidelines rather than standard AYUSH state licensing."
                ],
                applicable_statute="Drugs and Cosmetics (Amendment) Rules, 2015 (Phytopharmaceutical Pathway)",
                needs_human_review=True,
                citations=citations
            )

        # 4. Classical Ayurvedic Medicine Check
        if ("exact" in classical_answer.lower() or 
            (fingerprint.preparation_method.traditional and not fingerprint.preparation_method.modified)):
            cit = retriever.search("Section 3a Ayurvedic drug First Schedule Drugs and Cosmetics Act", jurisdiction="IN", limit=1)
            citations.extend(cit)
            return ProductClassification(
                category="classical_ayurvedic",
                category_display="Classical Ayurvedic Medicine (Shastriya)",
                confidence=0.94,
                reasons=[
                    "Formulated and manufactured strictly in accordance with authoritative texts listed in the First Schedule.",
                    "Eligible for Form 25D manufacturing licence without requiring independent safety or clinical trial proof."
                ],
                applicable_statute="The Drugs and Cosmetics Act, 1940, Section 3(a)",
                needs_human_review=False,
                citations=citations
            )

        # 5. Default: Proprietary Ayurvedic Medicine
        cit = retriever.search("Rule 158B Patent or Proprietary Ayurvedic Medicine Drugs Cosmetics", jurisdiction="IN", limit=1)
        citations.extend(cit)
        return ProductClassification(
            category="proprietary_ayurvedic",
            category_display="Patent or Proprietary Ayurvedic Medicine (Anubhoota)",
            confidence=0.89,
            reasons=[
                "Contains ingredients recognized in the First Schedule authoritative texts, but uses a non-classical combination ratio, modified preparation, or novel indication.",
                "Requires submission of published scientific safety data or pilot clinical documentation under Rule 158-B."
            ],
            applicable_statute="The Drugs and Cosmetics Rules, 1945, Rule 158-B",
            needs_human_review=False,
            citations=citations
        )

classification_engine = ProductClassificationEngine()
