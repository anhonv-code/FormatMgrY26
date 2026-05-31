from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from database import get_db
from models import DowntimeLog, Equipment
from schemas import DowntimeLogCreate, DowntimeLogOut, DowntimeSummary, DowntimeByEquipment
import uuid

router = APIRouter(prefix="/downtime", tags=["downtime"])

REVENUE_RATE_PER_HOUR = 3500.0  # THB/hr


def _generate_log_id(db: Session) -> str:
    count = db.query(DowntimeLog).count()
    return f"DT{str(count + 1).zfill(3)}"


@router.get("", response_model=List[DowntimeLogOut])
def list_downtime(db: Session = Depends(get_db)):
    return db.query(DowntimeLog).order_by(DowntimeLog.breakdown_datetime.desc()).all()


@router.post("", response_model=DowntimeLogOut, status_code=201)
def create_downtime(data: DowntimeLogCreate, db: Session = Depends(get_db)):
    equipment = db.query(Equipment).filter(Equipment.equipment_id == data.equipment_id).first()
    if not equipment:
        raise HTTPException(status_code=404, detail="Equipment not found")

    if data.repair_datetime <= data.breakdown_datetime:
        raise HTTPException(status_code=400, detail="Repair datetime must be after breakdown datetime")

    delta = data.repair_datetime - data.breakdown_datetime
    downtime_hours = round(delta.total_seconds() / 3600, 2)

    log = DowntimeLog(
        log_id=_generate_log_id(db),
        equipment_id=data.equipment_id,
        shop_name=equipment.shop_name,
        machine_type=equipment.machine_type,
        breakdown_datetime=data.breakdown_datetime,
        repair_datetime=data.repair_datetime,
        downtime_hours=downtime_hours,
        root_cause=data.root_cause,
        maintenance_cost=data.maintenance_cost,
        notes=data.notes,
    )
    db.add(log)
    db.commit()
    db.refresh(log)
    return log


@router.get("/summary", response_model=DowntimeSummary)
def get_summary(db: Session = Depends(get_db)):
    result = db.query(
        func.count(DowntimeLog.id).label("total_incidents"),
        func.sum(DowntimeLog.downtime_hours).label("total_hours"),
        func.sum(DowntimeLog.maintenance_cost).label("total_cost"),
    ).first()

    total_hours = float(result.total_hours or 0)
    total_incidents = int(result.total_incidents or 0)
    total_cost = float(result.total_cost or 0)
    revenue_loss = round(total_hours * REVENUE_RATE_PER_HOUR, 2)

    return DowntimeSummary(
        total_hours=round(total_hours, 2),
        total_incidents=total_incidents,
        total_cost=round(total_cost, 2),
        revenue_loss=revenue_loss,
    )


@router.get("/by-equipment", response_model=List[DowntimeByEquipment])
def get_by_equipment(db: Session = Depends(get_db)):
    rows = (
        db.query(
            DowntimeLog.equipment_id,
            DowntimeLog.shop_name,
            DowntimeLog.machine_type,
            func.count(DowntimeLog.id).label("total_incidents"),
            func.sum(DowntimeLog.downtime_hours).label("total_hours"),
            func.max(DowntimeLog.breakdown_datetime).label("last_incident"),
        )
        .group_by(DowntimeLog.equipment_id, DowntimeLog.shop_name, DowntimeLog.machine_type)
        .all()
    )

    return [
        DowntimeByEquipment(
            equipment_id=row.equipment_id,
            shop_name=row.shop_name,
            machine_type=row.machine_type,
            total_incidents=int(row.total_incidents),
            total_hours=round(float(row.total_hours or 0), 2),
            last_incident=row.last_incident,
        )
        for row in rows
    ]
