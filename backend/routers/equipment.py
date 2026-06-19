from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models import Equipment
from schemas import EquipmentCreate, EquipmentOut

router = APIRouter(prefix="/equipment", tags=["equipment"])


@router.get("", response_model=List[EquipmentOut])
def list_equipment(db: Session = Depends(get_db)):
    return db.query(Equipment).all()


@router.get("/{equipment_id}", response_model=EquipmentOut)
def get_equipment(equipment_id: str, db: Session = Depends(get_db)):
    item = db.query(Equipment).filter(Equipment.equipment_id == equipment_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Equipment not found")
    return item


@router.post("", response_model=EquipmentOut, status_code=201)
def create_equipment(data: EquipmentCreate, db: Session = Depends(get_db)):
    existing = db.query(Equipment).filter(Equipment.equipment_id == data.equipment_id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Equipment ID already exists")
    item = Equipment(**data.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.put("/{equipment_id}", response_model=EquipmentOut)
def update_equipment(equipment_id: str, data: EquipmentCreate, db: Session = Depends(get_db)):
    item = db.query(Equipment).filter(Equipment.equipment_id == equipment_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Equipment not found")
    for key, value in data.model_dump().items():
        setattr(item, key, value)
    db.commit()
    db.refresh(item)
    return item


@router.delete("/{equipment_id}", status_code=204)
def delete_equipment(equipment_id: str, db: Session = Depends(get_db)):
    item = db.query(Equipment).filter(Equipment.equipment_id == equipment_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Equipment not found")
    db.delete(item)
    db.commit()
