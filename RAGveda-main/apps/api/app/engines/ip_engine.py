from typing import List, Dict, Any
from app.schemas.fingerprint import InnovationFingerprint
from app.schemas.assessment import IPItem, Citation
from app.retrieval.hybrid_search import retriever

class IPOpportunityEngine:
    """
    Evaluates applicable Intellectual Property categories across Indian and
    international regimes with rigorous Section 3(p) / Section 3(e) risk warnings.
    """

    def evaluate(self, fingerprint: InnovationFingerprint) -> List[IPItem]:
        items: List[IPItem] = []

        # 1. Patent Assessment
        patent_citations = retriever.search(
            "Section 3p Section 3e Section 10 traditional knowledge patentability Indian Patents Act",
            jurisdiction="IN",
            limit=2
        )

        if not fingerprint.preparation_method.modified:
            # Traditional unmodified formula: High risk of rejection under Section 3(p)
            items.append(
                IPItem(
                    category="Patent",
                    status="High Risk of Statutory Exclusion",
                    risk_level="High",
                    statutory_basis="Section 3(p) & Section 3(e), The Patents Act, 1970",
                    explanation=(
                        "Direct traditional formulations or aggregations of known herb properties are explicitly barred from patentability under Section 3(p). "
                        "Unless you demonstrate unexpected synergism, novel bioactive fraction extraction, or an inventive non-obvious process, a product patent is unlikely to be granted."
                    ),
                    recommendations=[
                        "Do not rely solely on product patent protection for a classical formulation.",
                        "If you have developed a proprietary extraction or processing technique, evaluate whether a 'Process Patent' is feasible with empirical comparative data.",
                        "Protect the commercial identity via Trademark and packaging via Industrial Design instead."
                    ],
                    citations=patent_citations
                )
            )
        else:
            # Modified method or novel delivery
            items.append(
                IPItem(
                    category="Patent",
                    status="Investigate with Prior-Art Assessment",
                    risk_level="Medium",
                    statutory_basis="Section 2(1)(j), Section 3(d), Section 3(e) & Section 10(4)(ii)(D), The Patents Act, 1970",
                    explanation=(
                        "The claimed modification (such as novel delivery or standardized extraction) may possess patentable subject matter. "
                        "However, you must establish an 'inventive step' proving non-obvious enhanced efficacy over existing traditional literature (Section 3(d)) and unexpected synergism over mere admixture (Section 3(e)). "
                        "Furthermore, Section 10(4)(ii)(D) mandates prior approval from the National Biodiversity Authority (NBA) before patent grant if biological resources from India are used."
                    ),
                    recommendations=[
                        "Commission a formal prior-art clearance search against TKDL and global patent databases.",
                        "Document synergistic data through in-vitro / in-vivo comparative trials against individual herbal extracts.",
                        "File Form III with the National Biodiversity Authority prior to patent examination."
                    ],
                    citations=patent_citations
                )
            )

        # 2. Trademark Assessment
        tm_citations = retriever.search("Trademark brand registration AYUSH certification mark", jurisdiction="IN", limit=1)
        items.append(
            IPItem(
                category="Trademark",
                status="Highly Recommended",
                risk_level="Low",
                statutory_basis="The Trade Marks Act, 1999 (Nice Classification Classes 5, 3, 30)",
                explanation=(
                    "Trademark registration secures your distinctive brand name, logo, and commercial reputation in the Ayurvedic marketplace. "
                    "Unlike patents, trademark protection is not restricted by traditional knowledge and can be renewed indefinitely every 10 years."
                ),
                recommendations=[
                    "Conduct a trademark availability search in Class 5 (Ayurvedic pharmaceuticals) and Class 3 (Cosmetics/skincare).",
                    "Avoid purely generic descriptive Sanskrit names (e.g. 'Ashwagandha Rasayana') which face objections under Section 9 of Trade Marks Act.",
                    "Adopt an arbitrary or coined brand name for strongest legal defensibility."
                ],
                citations=tm_citations
            )
        )

        # 3. Trade Secret Assessment
        items.append(
            IPItem(
                category="Trade Secret",
                status="Potentially Relevant",
                risk_level="Low",
                statutory_basis="Common Law Breach of Confidence & Contract Law (Indian Contract Act, 1872)",
                explanation=(
                    "Proprietary manufacturing conditions (such as specific extraction ratios, temperature control, maceration durations, and enzyme digestion protocols) can be protected as trade secrets without public disclosure."
                ),
                recommendations=[
                    "Execute robust Non-Disclosure Agreements (NDAs) with manufacturing partners, lab researchers, and raw material suppliers.",
                    "Restrict facility access and compartmentalize formulation recipes across production stages."
                ],
                citations=[]
            )
        )

        # 4. Industrial Design Protection
        items.append(
            IPItem(
                category="Industrial Design",
                status="Relevant for Packaging",
                risk_level="Low",
                statutory_basis="The Designs Act, 2000",
                explanation=(
                    "Novel, aesthetic container designs, custom dispenser bottles, applicator tips, or unique blister packing shapes can be registered to prevent market look-alikes."
                ),
                recommendations=[
                    "Ensure the container or applicator shape is registered prior to public marketing or commercial launch."
                ],
                citations=[]
            )
        )

        # 5. Geographical Indications (GI) / Plant Varieties
        if any(ing.is_threatened_or_endangered for ing in fingerprint.ingredients):
            items.append(
                IPItem(
                    category="Geographical Indications & Conservation",
                    status="Investigate Compliance",
                    risk_level="Medium",
                    statutory_basis="Geographical Indications of Goods Act, 1999 & Biological Diversity Act, 2002",
                    explanation=(
                        "One or more biological ingredients in your formulation belong to threatened or geographically sensitive species. "
                        "Verify whether authorized GI user certification or sustainable harvest permits apply."
                    ),
                    recommendations=[
                        "Procure certified raw materials from recognized cultivators to maintain legal traceability."
                    ],
                    citations=[]
                )
            )

        return items

ip_engine = IPOpportunityEngine()
