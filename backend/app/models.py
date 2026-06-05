from sqlalchemy import Column, Integer, String, Float, DateTime, Text, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class Company(Base):
    __tablename__ = "companies"
    id          = Column(Integer, primary_key=True)
    name        = Column(String, nullable=False)
    domain      = Column(String)
    notes       = Column(Text)

class Application(Base):
    __tablename__ = "applications"
    id           = Column(Integer, primary_key=True)
    company_id   = Column(Integer, ForeignKey("companies.id"))
    role         = Column(String, nullable=False)
    url          = Column(String)
    status       = Column(String, default="applied")
    # status options: applied, interview, rejected, offer
    match_score  = Column(Float, default=0.0)
    applied_date = Column(DateTime, default=datetime.utcnow)
    notes        = Column(Text)

class Analysis(Base):
    __tablename__ = "analyses"
    id                = Column(Integer, primary_key=True)
    application_id    = Column(Integer, ForeignKey("applications.id"))
    jd_text           = Column(Text)
    skills_extracted  = Column(Text)  # stored as JSON string
    match_score       = Column(Float)
    created_at        = Column(DateTime, default=datetime.utcnow)