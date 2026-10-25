import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, Integer, Float, Boolean, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.core.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class Innovation(Base):
    __tablename__ = "innovations"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    intended_use = Column(String(255), nullable=True)
    product_category = Column(String(100), nullable=True)
    commercial_intent = Column(Boolean, default=True)
    target_jurisdiction = Column(String(20), default="IN")
    status = Column(String(50), default="draft")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    fingerprints = relationship("InnovationFingerprintModel", back_populates="innovation", cascade="all, delete-orphan")
    assessments = relationship("AssessmentModel", back_populates="innovation", cascade="all, delete-orphan")
    scenarios = relationship("ScenarioModel", back_populates="innovation", cascade="all, delete-orphan")
    messages = relationship("ConversationMessageModel", back_populates="innovation", cascade="all, delete-orphan")

class InnovationFingerprintModel(Base):
    __tablename__ = "innovation_fingerprints"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    innovation_id = Column(String(36), ForeignKey("innovations.id"), nullable=False)
    data_json = Column(JSON, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    innovation = relationship("Innovation", back_populates="fingerprints")

class AssessmentModel(Base):
    __tablename__ = "assessments"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    innovation_id = Column(String(36), ForeignKey("innovations.id"), nullable=False)
    assessment_type = Column(String(50), nullable=False)  # full, ip, tk, biodiversity, regulatory, classification
    status = Column(String(50), default="completed")
    score = Column(Float, default=0.0)
    confidence = Column(String(20), default="medium")
    result_json = Column(JSON, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    innovation = relationship("Innovation", back_populates="assessments")

class ScenarioModel(Base):
    __tablename__ = "scenarios"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    innovation_id = Column(String(36), ForeignKey("innovations.id"), nullable=False)
    title = Column(String(255), nullable=False)
    parent_scenario_id = Column(String(36), nullable=True)
    delta_params_json = Column(JSON, nullable=False)
    assessment_result_json = Column(JSON, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    innovation = relationship("Innovation", back_populates="scenarios")

class ConversationMessageModel(Base):
    __tablename__ = "conversation_messages"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    innovation_id = Column(String(36), ForeignKey("innovations.id"), nullable=False)
    role = Column(String(20), nullable=False)  # user, assistant, system
    content = Column(Text, nullable=False)
    metadata_json = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    innovation = relationship("Innovation", back_populates="messages")

class SourceModel(Base):
    __tablename__ = "sources"

    id = Column(String(50), primary_key=True)
    title = Column(String(255), nullable=False)
    publisher = Column(String(255), nullable=False)
    authority_level = Column(Integer, default=1)  # 1 (legislation) to 6 (secondary)
    source_type = Column(String(100), nullable=False)
    url = Column(String(500), nullable=True)
    jurisdiction = Column(String(20), default="IN")  # IN or INT
    language = Column(String(10), default="en")
    publication_date = Column(String(50), nullable=True)
    effective_date = Column(String(50), nullable=True)
    content_hash = Column(String(64), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    chunks = relationship("ChunkModel", back_populates="source", cascade="all, delete-orphan")

class ChunkModel(Base):
    __tablename__ = "chunks"

    id = Column(String(50), primary_key=True)
    source_id = Column(String(50), ForeignKey("sources.id"), nullable=False)
    section = Column(String(255), nullable=True)
    heading = Column(String(255), nullable=True)
    text = Column(Text, nullable=False)
    page_number = Column(Integer, nullable=True)
    language = Column(String(10), default="en")
    metadata_json = Column(JSON, nullable=True)

    source = relationship("SourceModel", back_populates="chunks")
