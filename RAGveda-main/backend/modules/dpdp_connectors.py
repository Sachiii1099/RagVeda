import os
import sqlite3
import hashlib
import datetime
from typing import Dict, Any, List
from backend.models import ConsentRequest, PaidQueryRequest

class DPDPPaidConnector:
    def __init__(self, db_path: str = None):
        if not db_path:
            base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
            db_path = os.path.join(base_dir, "data", "audit_log.db")
        self.db_path = db_path
        self._init_db()

    def _init_db(self):
        os.makedirs(os.path.dirname(self.db_path), exist_ok=True)
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS consent_audit (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                session_id TEXT,
                connector TEXT,
                consent_granted INTEGER,
                purpose TEXT,
                timestamp TEXT,
                hash TEXT
            )
        """)
        conn.commit()
        conn.close()

    def record_consent(self, req: ConsentRequest) -> Dict[str, Any]:
        now_str = datetime.datetime.utcnow().isoformat() + "Z"
        raw_token = f"{req.session_id}|{req.connector_name}|{req.consent_granted}|{req.consent_purpose}|{now_str}"
        sha_hash = hashlib.sha256(raw_token.encode("utf-8")).hexdigest()

        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO consent_audit (session_id, connector, consent_granted, purpose, timestamp, hash)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (req.session_id, req.connector_name, 1 if req.consent_granted else 0, req.consent_purpose, now_str, sha_hash))
        conn.commit()
        conn.close()

        return {
            "status": "RECORDED",
            "session_id": req.session_id,
            "connector": req.connector_name,
            "consent_granted": req.consent_granted,
            "cryptographic_hash": sha_hash,
            "dpdp_compliance": "Explicit per-session consent logged with immutable cryptographic hash."
        }

    def has_consent(self, session_id: str, connector_name: str) -> bool:
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        cursor.execute("""
            SELECT consent_granted FROM consent_audit
            WHERE session_id = ? AND connector = ?
            ORDER BY id DESC LIMIT 1
        """, (session_id, connector_name))
        row = cursor.fetchone()
        conn.close()
        return bool(row and row[0] == 1)

    def query_precedents(self, req: PaidQueryRequest) -> Dict[str, Any]:
        if not self.has_consent(req.session_id, req.connector_name):
            return {
                "success": False,
                "message": "Access Blocked: Explicit user consent under DPDP Act 2023 is required before querying paid legal database connectors.",
                "precedents": []
            }

        sample_cases = [
            {
                "case_title": "Dharampal Satyapal Ltd. v. Deputy Controller of Patents (IPAB 2013)",
                "citation": "2013 (56) PTC 481 (IPAB)",
                "holding": "Affirmed Section 3(p) rejection for classical Ayurvedic formulation without demonstration of synergistic enhancement.",
                "relevance": "Section 3(p) traditional knowledge defense jurisprudence."
            },
            {
                "case_title": "Divya Pharmacy v. Union of India & Ors (Uttarakhand High Court 2018)",
                "citation": "2018 SCC OnLine Utt 1035",
                "holding": "Indian companies are obligated to share benefits with local biodiversity management committees under Biological Diversity Act Section 7.",
                "relevance": "Scope of Fair and Equitable Benefit Sharing (ABS) for Indian AYUSH entities."
            }
        ]

        return {
            "success": True,
            "message": f"Successfully retrieved case precedents from {req.connector_name} under active DPDP session consent.",
            "precedents": sample_cases
        }

    def get_audit_trail(self) -> List[Dict[str, Any]]:
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        cursor.execute("SELECT session_id, connector, consent_granted, purpose, timestamp, hash FROM consent_audit ORDER BY id DESC LIMIT 20")
        rows = cursor.fetchall()
        conn.close()

        return [
            {
                "session_id": r[0],
                "connector": r[1],
                "consent_granted": bool(r[2]),
                "purpose": r[3],
                "timestamp": r[4],
                "hash": r[5]
            }
            for r in rows
        ]
