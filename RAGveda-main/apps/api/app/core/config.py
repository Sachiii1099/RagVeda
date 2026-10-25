import os
from pydantic import BaseModel

class Settings(BaseModel):
    PROJECT_NAME: str = "IP-SAKTI Sahayak"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./ip_sakti.db")
    LLM_API_KEY: str = os.getenv("LLM_API_KEY", "")
    STT_API_KEY: str = os.getenv("STT_API_KEY", "")
    DEFAULT_JURISDICTION: str = "IN"

settings = Settings()
