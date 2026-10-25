import re
from typing import List, Dict, Any
from app.knowledge.corpus import BOTANICAL_DIRECTORY
from app.schemas.fingerprint import InnovationFingerprint, IngredientInfo, PreparationMethod

class InnovationFingerprintEngine:
    """
    Converts unstructured Ayurvedic innovation descriptions into a structured,
    normalized, and Pydantic-validated Innovation Fingerprint.
    """

    def build_fingerprint(
        self,
        title: str,
        description: str,
        intended_use: str = "Therapeutic treatment",
        target_jurisdiction: str = "IN",
        commercial_intent: bool = True
    ) -> InnovationFingerprint:
        desc_lower = (title + " " + description + " " + intended_use).lower()

        # 1. Botanical Ingredient Detection and Normalization
        detected_ingredients: List[IngredientInfo] = []
        bio_resources_list: List[str] = []

        for common_name, details in BOTANICAL_DIRECTORY.items():
            # Search for common name, scientific name or sanskrit name
            sci_name_lower = details["scientific_name"].lower()
            sanskrit_lower = details["sanskrit_name"].lower()

            if (re.search(rf"\b{re.escape(common_name)}\b", desc_lower) or
                re.search(rf"\b{re.escape(sci_name_lower)}\b", desc_lower) or
                re.search(rf"\b{re.escape(sanskrit_lower)}\b", desc_lower)):
                
                ing = IngredientInfo(
                    name=common_name.capitalize(),
                    normalized_name=details["sanskrit_name"],
                    scientific_name=details["scientific_name"],
                    biological_resource=True,
                    parts_used=details.get("parts_used"),
                    classical_reference=details.get("classical_indication"),
                    source_country="India",
                    is_threatened_or_endangered=details.get("is_threatened", False)
                )
                detected_ingredients.append(ing)
                bio_resources_list.append(f"{common_name.capitalize()} ({details['scientific_name']})")

        # Fallback if no known botanical matched directly in text
        if not detected_ingredients:
            # Check for general terms like herbs, plants, formulation
            detected_ingredients.append(
                IngredientInfo(
                    name="Ayurvedic Botanical Component",
                    normalized_name="Herbal Extract",
                    scientific_name="Botanical Material",
                    biological_resource=True,
                    source_country="India"
                )
            )
            bio_resources_list.append("Ayurvedic Botanical Component")

        # 2. Preparation Method Signals
        is_traditional = bool(re.search(r"\b(traditional|classical|decoction|kwatha|taila|ghrita|bhasma|churna|vati|lehyam|ayurvedic text|samhita)\b", desc_lower))
        is_modified = bool(re.search(r"\b(modified|novel|nanotechnology|nano|extract|fraction|ultrasonic|solvent|supercritical|liposomal|bioavailability|enhanced)\b", desc_lower))

        novel_features = []
        if "nano" in desc_lower or "nanotechnology" in desc_lower:
            novel_features.append("Nanoparticle / Nano-emulsion formulation")
        if "extract" in desc_lower or "solvent" in desc_lower:
            novel_features.append("Standardized selective solvent extraction")
        if "modified" in desc_lower:
            novel_features.append("Modified temperature / processing ratio")

        prep = PreparationMethod(
            traditional=is_traditional or not is_modified,
            modified=is_modified,
            details="Novel extraction / delivery system" if is_modified else "Codified classical processing",
            novel_features=novel_features
        )

        # 3. Product Form & Intended Use
        product_form = "Liquid Extract / Syrup" if any(w in desc_lower for w in ["oil", "syrup", "liquid", "taila", "kwatha"]) else (
            "Topical Cream / Serum" if any(w in desc_lower for w in ["cream", "serum", "gel", "lotion", "skin", "hair"]) else "Capsule / Tablet / Churna"
        )

        # 4. Claimed Novelties
        claimed_novelties = []
        if novel_features:
            claimed_novelties.extend(novel_features)
        if "synerg" in desc_lower:
            claimed_novelties.append("Synergistic bio-enhancing activity")
        if not claimed_novelties:
            claimed_novelties.append("Novel combination ratio for targeted therapeutic outcome")

        # 5. Traditional Knowledge Signal
        tk_signal = is_traditional or any(ing.classical_reference for ing in detected_ingredients)

        return InnovationFingerprint(
            title=title,
            summary=description[:250] + ("..." if len(description) > 250 else ""),
            ingredients=detected_ingredients,
            preparation_method=prep,
            intended_use=intended_use,
            product_form=product_form,
            product_category="unknown",
            claimed_novelty=claimed_novelties,
            traditional_knowledge_signal=tk_signal,
            biological_resources=bio_resources_list,
            source_location="India (Domestic sourcing)",
            commercial_intent=commercial_intent,
            target_markets=[target_jurisdiction],
            ip_targets=["Patent", "Trademark", "Trade Secret"] if is_modified else ["Trademark", "Geographical Indication", "Design"],
            is_complete=True
        )

fingerprint_engine = InnovationFingerprintEngine()
