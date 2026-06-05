from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class CompanyCreate(BaseModel):
    name: str
    domain: Optional[str] = None
    notes: Optional[str] = None


class ApplicationCreate(BaseModel):
    company_name: str
    role: str
    url: Optional[str] = None
    notes: Optional[str] = None


class ApplicationUpdate(BaseModel):
    status: Optional[str] = None
    notes: Optional[str] = None


class AnalyseRequest(BaseModel):
    application_id: int
    jd_text: str
    cv_text: str


class ApplicationResponse(BaseModel):
    id: int
    role: str
    status: str
    match_score: float
    applied_date: datetime
    notes: Optional[str]

    class Config:
        from_attributes = True