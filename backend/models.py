from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime


class Equipment(Base):
    __tablename__ = "equipment"

    id = Column(Integer, primary_key=True, index=True)
    equipment_id = Column(String, unique=True, index=True, nullable=False)
    shop_name = Column(String, nullable=False)
    machine_type = Column(String, nullable=False)
    status = Column(String, default="Active")

    downtime_logs = relationship("DowntimeLog", back_populates="equipment")


class DowntimeLog(Base):
    __tablename__ = "downtime_logs"

    id = Column(Integer, primary_key=True, index=True)
    log_id = Column(String, unique=True, index=True, nullable=False)
    equipment_id = Column(String, ForeignKey("equipment.equipment_id"), nullable=False)
    shop_name = Column(String, nullable=False)
    machine_type = Column(String, nullable=False)
    breakdown_datetime = Column(DateTime, nullable=False)
    repair_datetime = Column(DateTime, nullable=False)
    downtime_hours = Column(Float, nullable=False)
    root_cause = Column(String, nullable=False)
    maintenance_cost = Column(Float, default=0.0)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    equipment = relationship("Equipment", back_populates="downtime_logs")


class Shop(Base):
    __tablename__ = "shops"

    id = Column(Integer, primary_key=True, index=True)
    shop_id = Column(String, unique=True, index=True, nullable=False)
    shop_name = Column(String, nullable=False)
    area = Column(String, nullable=True)
    manager = Column(String, nullable=True)
    monthly_target = Column(Float, default=0.0)

    sales = relationship("SaleRecord", back_populates="shop")


class SaleRecord(Base):
    __tablename__ = "sales"

    id = Column(Integer, primary_key=True, index=True)
    sale_date = Column(DateTime, nullable=False)
    shop_name = Column(String, nullable=False)
    shop_id = Column(String, ForeignKey("shops.shop_id"), nullable=True)
    product_category = Column(String, nullable=False)
    product_name = Column(String, nullable=False)
    quantity = Column(Integer, default=1)
    unit_price = Column(Float, nullable=False)
    total_sales = Column(Float, nullable=False)
    channel = Column(String, nullable=False)
    shift_manager = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    shop = relationship("Shop", back_populates="sales")
