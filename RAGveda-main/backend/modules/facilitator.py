import datetime
import uuid
from typing import Dict, Any
from backend.models import EscalationTicketRequest

class AIIAFacilitator:
    def __init__(self):
        self.tickets: Dict[str, Dict[str, Any]] = {}

    def create_ticket(self, req: EscalationTicketRequest) -> Dict[str, Any]:
        ticket_id = f"AIIA-IP-{str(uuid.uuid4())[:8].upper()}"
        now_str = datetime.datetime.utcnow().isoformat() + "Z"

        ticket_data = {
            "ticket_id": ticket_id,
            "status": "OPEN",
            "created_at": now_str,
            "user_name": req.user_name,
            "email": req.email,
            "organization": req.organization or "Independent Innovator",
            "formulation_name": req.formulation_name,
            "category": req.category,
            "issue_description": req.issue_description,
            "last_query": req.last_query,
            "assigned_cell": "All India Institute of Ayurveda (AIIA) IP & Commercialization Facilitation Cell",
            "estimated_response_hours": 48
        }
        self.tickets[ticket_id] = ticket_data
        return ticket_data

    def get_ticket(self, ticket_id: str) -> Dict[str, Any]:
        return self.tickets.get(ticket_id, {})
