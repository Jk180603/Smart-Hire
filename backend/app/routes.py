from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from . import models
from .databases import get_db
from .schemas import ApplicationCreate, ApplicationUpdate, AnalyseRequest
from .ai_engine import analyse_jd, compute_match_score, generate_feedback
import json

router = APIRouter()


# ── POST /applications ─────────────────────────────────────
@router.post("/applications", status_code=201)
def add_application(data: ApplicationCreate, db: Session = Depends(get_db)):

    # Get or create company
    company = db.query(models.Company).filter(
        models.Company.name == data.company_name
    ).first()

    if not company:
        company = models.Company(name=data.company_name)
        db.add(company)
        db.commit()
        db.refresh(company)

    app = models.Application(
        company_id  = company.id,
        role        = data.role,
        url         = data.url,
        notes       = data.notes,
        status      = "applied",
        match_score = 0.0
    )
    db.add(app)
    db.commit()
    db.refresh(app)

    return {"id": app.id, "message": "Application added", "role": app.role}


# ── GET /applications ──────────────────────────────────────
@router.get("/applications")
def list_applications(db: Session = Depends(get_db)):
    apps = db.query(models.Application).all()
    result = []
    for a in apps:
        company = db.query(models.Company).filter(
            models.Company.id == a.company_id
        ).first()
        result.append({
            "id":           a.id,
            "company":      company.name if company else "Unknown",
            "role":         a.role,
            "status":       a.status,
            "match_score":  a.match_score,
            "applied_date": str(a.applied_date),
            "url":          a.url
        })
    return result


# ── POST /analyse ──────────────────────────────────────────
@router.post("/analyse")
def analyse_application(data: AnalyseRequest, db: Session = Depends(get_db)):

    app = db.query(models.Application).filter(
        models.Application.id == data.application_id
    ).first()

    if not app:
        raise HTTPException(status_code=404, detail="Application not found")

    # Run AI analysis
    jd_analysis = analyse_jd(data.jd_text)
    score       = compute_match_score(data.cv_text, data.jd_text)
    feedback    = generate_feedback(data.cv_text, data.jd_text)

    # Save analysis to DB
    analysis = models.Analysis(
        application_id   = data.application_id,
        jd_text          = data.jd_text,
        skills_extracted = json.dumps(jd_analysis),
        match_score      = score
    )
    db.add(analysis)

    # Update match score on application
    app.match_score = score
    db.commit()

    return {
        "match_score":  score,
        "jd_analysis":  jd_analysis,
        "feedback":     feedback
    }


# ── PUT /applications/{id} ─────────────────────────────────
@router.put("/applications/{app_id}")
def update_application(
    app_id: int,
    data: ApplicationUpdate,
    db: Session = Depends(get_db)
):
    app = db.query(models.Application).filter(
        models.Application.id == app_id
    ).first()

    if not app:
        raise HTTPException(status_code=404, detail="Application not found")

    if data.status:
        app.status = data.status
    if data.notes:
        app.notes = data.notes

    db.commit()
    return {"message": "Updated", "id": app_id, "status": app.status}


# ── GET /dashboard/stats ───────────────────────────────────
@router.get("/dashboard/stats")
def get_stats(db: Session = Depends(get_db)):
    total      = db.query(models.Application).count()
    applied    = db.query(models.Application).filter_by(status="applied").count()
    interviews = db.query(models.Application).filter_by(status="interview").count()
    offers     = db.query(models.Application).filter_by(status="offer").count()
    rejected   = db.query(models.Application).filter_by(status="rejected").count()

    avg_score = db.query(
        func.avg(models.Application.match_score)
    ).scalar() or 0.0

    return {
        "total":          total,
        "applied":        applied,
        "interviews":     interviews,
        "offers":         offers,
        "rejected":       rejected,
        "avg_match_score": round(float(avg_score), 1)
    }