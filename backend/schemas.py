from pydantic import BaseModel, field_validator
from typing import Optional
from datetime import datetime


# Equipment Schemas
class EquipmentBase(BaseModel):
    equipment_id: str
    shop_name: str
    machine_type: str
    status: str = "Active"


class EquipmentCreate(EquipmentBase):
    pass


class EquipmentOut(EquipmentBase):
    id: int

    model_config = {"from_attributes": True}


# Downtime Schemas
class DowntimeLogBase(BaseModel):
    equipment_id: str
    breakdown_datetime: datetime
    repair_datetime: datetime
    root_cause: str
    maintenance_cost: float = 0.0
    notes: Optional[str] = None


class DowntimeLogCreate(DowntimeLogBase):
    pass


class DowntimeLogOut(BaseModel):
    id: int
    log_id: str
    equipment_id: str
    shop_name: str
    machine_type: str
    breakdown_datetime: datetime
    repair_datetime: datetime
    downtime_hours: float
    root_cause: str
    maintenance_cost: float
    notes: Optional[str] = None
    created_at: datetime

    model_config = {"from_attributes": True}


class DowntimeSummary(BaseModel):
    total_hours: float
    total_incidents: int
    total_cost: float
    revenue_loss: float


class DowntimeByEquipment(BaseModel):
    equipment_id: str
    shop_name: str
    machine_type: str
    total_incidents: int
    total_hours: float
    last_incident: Optional[datetime]


# Shop Schemas
class ShopBase(BaseModel):
    shop_id: str
    shop_name: str
    area: Optional[str] = None
    manager: Optional[str] = None
    monthly_target: float = 0.0


class ShopCreate(ShopBase):
    pass


class ShopOut(ShopBase):
    id: int

    model_config = {"from_attributes": True}


# Sales Schemas
class SaleRecordOut(BaseModel):
    id: int
    sale_date: datetime
    shop_name: str
    shop_id: Optional[str]
    product_category: str
    product_name: str
    quantity: int
    unit_price: float
    total_sales: float
    channel: str
    shift_manager: Optional[str]

    model_config = {"from_attributes": True}


class SalesSummary(BaseModel):
    total_sales: float
    avg_per_transaction: float
    total_transactions: int
    achievement_pct: float


class SalesByShop(BaseModel):
    shop_name: str
    total_sales: float
    target: float
    achievement_pct: float


class SalesByCategory(BaseModel):
    category: str
    total_sales: float
    percentage: float


class SalesByChannel(BaseModel):
    channel: str
    total_sales: float
    percentage: float


class ImportResult(BaseModel):
    rows_imported: int
    rows_skipped: int
    message: str
