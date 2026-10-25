import os
import json
import re
from typing import Dict, Any, List
from backend.models import TKDLScanRequest

class TKDLScanner:
    def __init__(self, data_path: str = None):
        if not data_path:
            base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
            data_path = os.path.join(base_dir, "data", "statutes", "tkdl_codified_database.json")
        self.data_path = data_path
        self.records: List[Dict[str, Any]] = []
        self._load_records()

    def _load_records(self):
        if os.path.exists(self.data_path):
            try:
                with open(self.data_path, "r", encoding="utf-8") as f:
                    self.records = json.load(f)
            except Exception as e:
                print(f"Error loading TKDL data: {e}")

    def scan_formulation(self, request: TKDLScanRequest) -> Dict[str, Any]:
        text_lower = request.formulation_text.lower()
        matched = []

        for rec in self.records:
            is_match = False
            # Check ingredients match
            for ing in rec.get("ingredients", []):
                if ing.lower() in text_lower:
                    is_match = True
                    break
            
            # Check classical names
            if rec.get("classical_name", "").lower() in text_lower or rec.get("sanskrit_name", "").lower() in text_lower:
                is_match = True

            if is_match:
                matched.append({
                    "tkdl_id": rec.get("tkdl_id"),
                    "classical_name": rec.get("classical_name"),
                    "sanskrit_name": rec.get("sanskrit_name"),
                    "authoritative_source": rec.get("authoritative_source"),
                    "indications": rec.get("indications", []),
                    "sec_3p_patent_risk": rec.get("sec_3p_patent_risk", "HIGH"),
                    "patent_filing_status": rec.get("patent_filing_status"),
                    "allowable_ip_avenues": rec.get("allowable_ip_avenues", [])
                })

        risk = "HIGH (Direct Classical Match Found)" if matched else "MODERATE (Novel Modification Claimed)"

        return {
            "query_formulation": request.formulation_text,
            "total_matches_found": len(matched),
            "risk_level": risk,
            "matches": matched,
            "strategic_advice": [
                "Under Section 3(p) of Patents Act, 1970, pure classical formulations listed in TKDL are non-patentable.",
                "To overcome TKDL 3(p) objections, applicant must prove synergistic interaction (CI < 0.7) or novel extraction process.",
                "Brand names can be registered under Class 5 of the Trade Marks Act, 1999."
            ]
        }
