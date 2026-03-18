import os
import shutil
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.db import models
from app.db.models import Document
from app.services.ai_service import generate_summary
from app.services.pdf_service import extract_text_from_pdf

router = APIRouter()
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.get("/files")
async def list_files(db: Session = Depends(get_db)):
    documents = db.query(Document).all()
    return {"files": documents}


@router.get("/files/{file_id}")
async def get_file_details(file_id: int, db: Session = Depends(get_db)):
    document = db.query(models.Document).filter(models.Document.id == file_id).first()

    if not document:
        raise HTTPException(status_code=404, detail="Document not found")

    return document


@router.post("/files/{file_id}/analyze")
async def analyze_file(file_id: int, db: Session = Depends(get_db)):
    document = db.query(models.Document).filter(models.Document.id == file_id).first()

    if not document:
        raise HTTPException(status_code=404, detail="Document not found")

    if document.summary and document.status == "ANALYZED":
        return {"summary": document.summary, "status": "ALREADY_ANALYZED"}

    try:
        file_full_path = os.path.join(UPLOAD_DIR, os.path.basename(document.file_path))

        raw_text = extract_text_from_pdf(file_full_path)
        summary_text = await generate_summary(raw_text)

        document.summary = summary_text
        document.status = "ANALYZED"

        db.add(document)
        db.commit()
        db.refresh(document)

        return {"summary": document.summary, "status": document.status}

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/upload")
async def upload_file(file: UploadFile, db: Session = Depends(get_db)):
    path = f"uploads/{file.filename}"
    with open(path, "wb") as f:
        f.write(await file.read())

    new_doc = models.Document(
        filename=file.filename,
        file_path=path,
        owner_id=1,  # lasam asa pana facem login
    )

    db.add(new_doc)
    db.commit()
    db.refresh(new_doc)

    return {"id": new_doc.id, "status": "Succes"}
