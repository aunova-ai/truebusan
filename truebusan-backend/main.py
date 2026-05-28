from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

import models
import schemas
from database import engine, get_db

# DB 테이블 생성
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="TrueBusan MVP API", version="0.1.0")

# CORS 설정 (프론트엔드 localhost:3000 통신 허용)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # MVP 테스트용으로 모두 허용
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to TrueBusan Backend API"}

@app.get("/api/places", response_model=List[schemas.PlaceResponse])
def get_places(db: Session = Depends(get_db)):
    # TRASHED 상태인 데이터는 클라이언트(지도)에 보내지 않음!
    places = db.query(models.Place).filter(models.Place.status != models.PlaceStatus.TRASHED).all()
    return places

@app.post("/api/admin/places", response_model=schemas.PlaceResponse)
def create_place(place: schemas.PlaceCreate, db: Session = Depends(get_db)):
    db_place = models.Place(**place.model_dump())
    db.add(db_place)
    db.commit()
    db.refresh(db_place)
    return db_place

@app.delete("/api/admin/places/{place_id}")
def delete_place(place_id: int, db: Session = Depends(get_db)):
    db_place = db.query(models.Place).filter(models.Place.id == place_id).first()
    if not db_place:
        raise HTTPException(status_code=404, detail="Place not found")
    
    # 진짜 삭제가 아니라 소프트 딜리트(휴지통 상태로 변경) 처리
    db_place.status = models.PlaceStatus.TRASHED
    db.commit()
    return {"message": "Place moved to trash (Soft Deleted)"}
