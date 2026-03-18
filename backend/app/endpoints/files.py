import os
from fastapi import APIRouter, UploadFile, HTTPException, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.db.session import get_db
from app.db import models
from app.db.models import Document
from app.services.ai_service import generate_summary
from app.services.pdf_service import extract_text_from_pdf

router = APIRouter()
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


class DocumentUpdate(BaseModel):
    filename: str


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


@router.put("/files/{file_id}")
async def update_document_name(
    file_id: int, update_data: DocumentUpdate, db: Session = Depends(get_db)
):
    document = db.query(models.Document).filter(models.Document.id == file_id).first()
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")

    document.filename = update_data.filename
    db.commit()
    db.refresh(document)
    return document


@router.delete("/files/{file_id}")
async def delete_document(file_id: int, db: Session = Depends(get_db)):
    document = db.query(models.Document).filter(models.Document.id == file_id).first()
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")

    if os.path.exists(document.file_path):
        try:
            os.remove(document.file_path)
        except Exception:
            pass

    db.delete(document)
    db.commit()
    return {"message": "Document deleted"}


@router.post("/files/{file_id}/analyze")
async def analyze_file(file_id: int, db: Session = Depends(get_db)):
    document = db.query(models.Document).filter(models.Document.id == file_id).first()
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")

    if document.summary and document.status == "ANALYZED":
        return {"summary": document.summary, "status": "ALREADY_ANALYZED"}

    try:
        raw_text = extract_text_from_pdf(document.file_path)
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
    safe_filename = file.filename.replace(" ", "_")
    path = os.path.join(UPLOAD_DIR, safe_filename)

    with open(path, "wb") as f:
        f.write(await file.read())

    new_doc = models.Document(
        filename=file.filename,
        file_path=path,
        owner_id=1,
    )

    db.add(new_doc)
    db.commit()
    db.refresh(new_doc)

    return {"id": new_doc.id, "status": "success"}
