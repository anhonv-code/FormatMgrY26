import csv
import io
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from database import get_db
from models import SaleRecord, Shop
from schemas import (
    SaleRecordOut, SalesSummary, SalesByShop,
    SalesByCategory, SalesByChannel, ImportResult, ShopOut
)

router = APIRouter(prefix="/sales", tags=["sales"])


def _parse_datetime(val: str) -> datetime:
    for fmt in ("%Y-%m-%d %H:%M:%S", "%Y-%m-%d %H:%M", "%Y-%m-%d", "%d/%m/%Y %H:%M", "%d/%m/%Y"):
        try:
            return datetime.strptime(val.strip(), fmt)
        except ValueError:
            continue
    raise ValueError(f"Cannot parse date: {val}")


@router.post("/import", response_model=ImportResult)
async def import_csv(file: UploadFile = File(...), db: Session = Depends(get_db)):
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files are accepted")

    content = await file.read()
    text = content.decode("utf-8-sig")  # handle BOM
    reader = csv.DictReader(io.StringIO(text))

    rows_imported = 0
    rows_skipped = 0

    for row in reader:
        try:
            sale_date = _parse_datetime(row["Date"])
            shop_name = row["Shop Name"].strip()
            shop_id = row.get("Shop ID", "").strip() or None
            product_category = row["Product Category"].strip()
            product_name = row["Product Name"].strip()
            quantity = int(row["Quantity"])
            unit_price = float(row["Unit Price"])
            total_sales = float(row["Total Sales"])
            channel = row["Channel"].strip()
            shift_manager = row.get("Shift Manager", "").strip() or None

            sale = SaleRecord(
                sale_date=sale_date,
                shop_name=shop_name,
                shop_id=shop_id,
                product_category=product_category,
                product_name=product_name,
                quantity=quantity,
                unit_price=unit_price,
                total_sales=total_sales,
                channel=channel,
                shift_manager=shift_manager,
            )
            db.add(sale)
            rows_imported += 1
        except Exception:
            rows_skipped += 1

    db.commit()
    return ImportResult(
        rows_imported=rows_imported,
        rows_skipped=rows_skipped,
        message=f"Import complete. {rows_imported} rows imported, {rows_skipped} rows skipped."
    )


@router.get("/summary", response_model=SalesSummary)
def get_summary(db: Session = Depends(get_db)):
    result = db.query(
        func.count(SaleRecord.id).label("total_transactions"),
        func.sum(SaleRecord.total_sales).label("total_sales"),
    ).first()

    total_transactions = int(result.total_transactions or 0)
    total_sales = float(result.total_sales or 0)
    avg_per_transaction = round(total_sales / total_transactions, 2) if total_transactions > 0 else 0.0

    # Aggregate total target from shops
    total_target = db.query(func.sum(Shop.monthly_target)).scalar() or 0.0
    achievement_pct = round((total_sales / total_target) * 100, 2) if total_target > 0 else 0.0

    return SalesSummary(
        total_sales=round(total_sales, 2),
        avg_per_transaction=avg_per_transaction,
        total_transactions=total_transactions,
        achievement_pct=achievement_pct,
    )


@router.get("/by-shop", response_model=List[SalesByShop])
def get_by_shop(db: Session = Depends(get_db)):
    rows = (
        db.query(
            SaleRecord.shop_name,
            func.sum(SaleRecord.total_sales).label("total_sales"),
        )
        .group_by(SaleRecord.shop_name)
        .all()
    )

    shops = {s.shop_name: s.monthly_target for s in db.query(Shop).all()}

    return [
        SalesByShop(
            shop_name=row.shop_name,
            total_sales=round(float(row.total_sales or 0), 2),
            target=shops.get(row.shop_name, 0.0),
            achievement_pct=round((float(row.total_sales or 0) / shops.get(row.shop_name, 1)) * 100, 2)
            if shops.get(row.shop_name, 0) > 0 else 0.0,
        )
        for row in rows
    ]


@router.get("/by-category", response_model=List[SalesByCategory])
def get_by_category(db: Session = Depends(get_db)):
    total_sales = db.query(func.sum(SaleRecord.total_sales)).scalar() or 0.0
    rows = (
        db.query(
            SaleRecord.product_category,
            func.sum(SaleRecord.total_sales).label("total_sales"),
        )
        .group_by(SaleRecord.product_category)
        .order_by(func.sum(SaleRecord.total_sales).desc())
        .all()
    )

    return [
        SalesByCategory(
            category=row.product_category,
            total_sales=round(float(row.total_sales or 0), 2),
            percentage=round((float(row.total_sales or 0) / total_sales) * 100, 2) if total_sales > 0 else 0.0,
        )
        for row in rows
    ]


@router.get("/by-channel", response_model=List[SalesByChannel])
def get_by_channel(db: Session = Depends(get_db)):
    total_sales = db.query(func.sum(SaleRecord.total_sales)).scalar() or 0.0
    rows = (
        db.query(
            SaleRecord.channel,
            func.sum(SaleRecord.total_sales).label("total_sales"),
        )
        .group_by(SaleRecord.channel)
        .all()
    )

    return [
        SalesByChannel(
            channel=row.channel,
            total_sales=round(float(row.total_sales or 0), 2),
            percentage=round((float(row.total_sales or 0) / total_sales) * 100, 2) if total_sales > 0 else 0.0,
        )
        for row in rows
    ]
