import os
import shutil
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.db import models
from app.db.models import Document

router = APIRouter()
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.get("/files")
async def list_files(db: Session = Depends(get_db)):
    documents = db.query(Document).all()
    return {"files": documents}


@router.get("/download/{filename}")
async def download_file(filename: str):
    file_path = os.path.join(UPLOAD_DIR, filename)
    if os.path.exists(file_path):
        return FileResponse(file_path, filename=filename)
    raise HTTPException(status_code=404, detail="Fisierul nu a fost gasit")


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
