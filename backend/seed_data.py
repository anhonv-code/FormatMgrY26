from datetime import datetime
from sqlalchemy.orm import Session
from models import Equipment, DowntimeLog, Shop, SaleRecord


def seed_database(db: Session):
    """Seed the database with initial data if empty."""

    # Seed Equipment
    if db.query(Equipment).count() == 0:
        equipment_list = [
            Equipment(equipment_id="CM001", shop_name="Shell Cafe Central", machine_type="Espresso Machine", status="Active"),
            Equipment(equipment_id="CM002", shop_name="Shell Cafe Central", machine_type="Grinder", status="Active"),
            Equipment(equipment_id="CM003", shop_name="Shell Cafe BTS", machine_type="Espresso Machine", status="Active"),
            Equipment(equipment_id="CM004", shop_name="Shell Cafe BTS", machine_type="Steamer", status="Active"),
            Equipment(equipment_id="CM005", shop_name="Shell Cafe Silom", machine_type="Espresso Machine", status="Active"),
            Equipment(equipment_id="CM006", shop_name="Shell Cafe Silom", machine_type="Grinder", status="Active"),
        ]
        db.add_all(equipment_list)
        db.commit()

    # Seed Downtime Logs
    if db.query(DowntimeLog).count() == 0:
        downtime_list = [
            DowntimeLog(
                log_id="DT001",
                equipment_id="CM001",
                shop_name="Shell Cafe Central",
                machine_type="Espresso Machine",
                breakdown_datetime=datetime(2024, 1, 10, 10, 30),
                repair_datetime=datetime(2024, 1, 10, 14, 0),
                downtime_hours=3.5,
                root_cause="Pump failure",
                maintenance_cost=2500.0,
            ),
            DowntimeLog(
                log_id="DT002",
                equipment_id="CM002",
                shop_name="Shell Cafe Central",
                machine_type="Grinder",
                breakdown_datetime=datetime(2024, 1, 12, 9, 15),
                repair_datetime=datetime(2024, 1, 12, 11, 45),
                downtime_hours=2.5,
                root_cause="Burr alignment",
                maintenance_cost=1200.0,
            ),
            DowntimeLog(
                log_id="DT003",
                equipment_id="CM003",
                shop_name="Shell Cafe BTS",
                machine_type="Espresso Machine",
                breakdown_datetime=datetime(2024, 1, 15, 14, 20),
                repair_datetime=datetime(2024, 1, 16, 9, 0),
                downtime_hours=18.67,
                root_cause="Boiler issue",
                maintenance_cost=5800.0,
            ),
            DowntimeLog(
                log_id="DT004",
                equipment_id="CM001",
                shop_name="Shell Cafe Central",
                machine_type="Espresso Machine",
                breakdown_datetime=datetime(2024, 1, 20, 11, 10),
                repair_datetime=datetime(2024, 1, 20, 13, 30),
                downtime_hours=2.33,
                root_cause="Valve cleaning",
                maintenance_cost=800.0,
            ),
            DowntimeLog(
                log_id="DT005",
                equipment_id="CM005",
                shop_name="Shell Cafe Silom",
                machine_type="Espresso Machine",
                breakdown_datetime=datetime(2024, 2, 1, 15, 45),
                repair_datetime=datetime(2024, 2, 1, 17, 15),
                downtime_hours=1.5,
                root_cause="Gasket replacement",
                maintenance_cost=600.0,
            ),
            DowntimeLog(
                log_id="DT006",
                equipment_id="CM004",
                shop_name="Shell Cafe BTS",
                machine_type="Steamer",
                breakdown_datetime=datetime(2024, 2, 5, 8, 30),
                repair_datetime=datetime(2024, 2, 6, 10, 30),
                downtime_hours=26.0,
                root_cause="Water pipe leak",
                maintenance_cost=3200.0,
            ),
        ]
        db.add_all(downtime_list)
        db.commit()

    # Seed Shops
    if db.query(Shop).count() == 0:
        shops = [
            Shop(shop_id="SC001", shop_name="Shell Cafe Central", area="Bangkok Central", manager="Somchai", monthly_target=450000.0),
            Shop(shop_id="SC002", shop_name="Shell Cafe BTS", area="BTS Silom", manager="Niran", monthly_target=520000.0),
            Shop(shop_id="SC003", shop_name="Shell Cafe Silom", area="Silom Area", manager="Pattaya", monthly_target=580000.0),
        ]
        db.add_all(shops)
        db.commit()

    # Seed Sales Records
    if db.query(SaleRecord).count() == 0:
        sales = [
            # Shell Cafe Central – Feb 2024
            SaleRecord(sale_date=datetime(2024, 2, 1, 8, 15), shop_name="Shell Cafe Central", shop_id="SC001", product_category="Coffee", product_name="Espresso", quantity=3, unit_price=60.0, total_sales=180.0, channel="Dine-in", shift_manager="Somchai"),
            SaleRecord(sale_date=datetime(2024, 2, 1, 9, 30), shop_name="Shell Cafe Central", shop_id="SC001", product_category="Coffee", product_name="Cappuccino", quantity=5, unit_price=85.0, total_sales=425.0, channel="Takeaway", shift_manager="Somchai"),
            SaleRecord(sale_date=datetime(2024, 2, 3, 10, 0), shop_name="Shell Cafe Central", shop_id="SC001", product_category="Food", product_name="Croissant", quantity=8, unit_price=40.0, total_sales=320.0, channel="Dine-in", shift_manager="Somchai"),
            SaleRecord(sale_date=datetime(2024, 2, 5, 11, 45), shop_name="Shell Cafe Central", shop_id="SC001", product_category="Coffee", product_name="Americano", quantity=10, unit_price=55.0, total_sales=550.0, channel="Takeaway", shift_manager="Somchai"),
            SaleRecord(sale_date=datetime(2024, 2, 7, 13, 20), shop_name="Shell Cafe Central", shop_id="SC001", product_category="Food", product_name="Sandwich", quantity=6, unit_price=65.0, total_sales=390.0, channel="Dine-in", shift_manager="Somchai"),
            SaleRecord(sale_date=datetime(2024, 2, 10, 8, 0), shop_name="Shell Cafe Central", shop_id="SC001", product_category="Beverage", product_name="Green Tea Latte", quantity=4, unit_price=75.0, total_sales=300.0, channel="Dine-in", shift_manager="Somchai"),
            SaleRecord(sale_date=datetime(2024, 2, 12, 14, 30), shop_name="Shell Cafe Central", shop_id="SC001", product_category="Coffee", product_name="Cappuccino", quantity=12, unit_price=85.0, total_sales=1020.0, channel="Dine-in", shift_manager="Somchai"),
            SaleRecord(sale_date=datetime(2024, 2, 15, 9, 0), shop_name="Shell Cafe Central", shop_id="SC001", product_category="Food", product_name="Croissant", quantity=15, unit_price=40.0, total_sales=600.0, channel="Takeaway", shift_manager="Somchai"),
            SaleRecord(sale_date=datetime(2024, 2, 18, 11, 0), shop_name="Shell Cafe Central", shop_id="SC001", product_category="Coffee", product_name="Americano", quantity=20, unit_price=55.0, total_sales=1100.0, channel="Takeaway", shift_manager="Somchai"),
            SaleRecord(sale_date=datetime(2024, 2, 20, 16, 0), shop_name="Shell Cafe Central", shop_id="SC001", product_category="Others", product_name="Mineral Water", quantity=10, unit_price=25.0, total_sales=250.0, channel="Dine-in", shift_manager="Somchai"),

            # Shell Cafe BTS – Feb 2024
            SaleRecord(sale_date=datetime(2024, 2, 1, 7, 30), shop_name="Shell Cafe BTS", shop_id="SC002", product_category="Coffee", product_name="Espresso", quantity=5, unit_price=60.0, total_sales=300.0, channel="Takeaway", shift_manager="Niran"),
            SaleRecord(sale_date=datetime(2024, 2, 2, 8, 45), shop_name="Shell Cafe BTS", shop_id="SC002", product_category="Coffee", product_name="Cappuccino", quantity=8, unit_price=85.0, total_sales=680.0, channel="Takeaway", shift_manager="Niran"),
            SaleRecord(sale_date=datetime(2024, 2, 4, 10, 15), shop_name="Shell Cafe BTS", shop_id="SC002", product_category="Food", product_name="Sandwich", quantity=10, unit_price=65.0, total_sales=650.0, channel="Dine-in", shift_manager="Niran"),
            SaleRecord(sale_date=datetime(2024, 2, 6, 12, 0), shop_name="Shell Cafe BTS", shop_id="SC002", product_category="Coffee", product_name="Americano", quantity=15, unit_price=55.0, total_sales=825.0, channel="Takeaway", shift_manager="Niran"),
            SaleRecord(sale_date=datetime(2024, 2, 8, 9, 30), shop_name="Shell Cafe BTS", shop_id="SC002", product_category="Beverage", product_name="Iced Matcha", quantity=7, unit_price=80.0, total_sales=560.0, channel="Takeaway", shift_manager="Niran"),
            SaleRecord(sale_date=datetime(2024, 2, 11, 13, 0), shop_name="Shell Cafe BTS", shop_id="SC002", product_category="Coffee", product_name="Cappuccino", quantity=18, unit_price=85.0, total_sales=1530.0, channel="Dine-in", shift_manager="Niran"),
            SaleRecord(sale_date=datetime(2024, 2, 13, 15, 0), shop_name="Shell Cafe BTS", shop_id="SC002", product_category="Food", product_name="Croissant", quantity=12, unit_price=40.0, total_sales=480.0, channel="Takeaway", shift_manager="Niran"),
            SaleRecord(sale_date=datetime(2024, 2, 16, 8, 0), shop_name="Shell Cafe BTS", shop_id="SC002", product_category="Coffee", product_name="Espresso", quantity=20, unit_price=60.0, total_sales=1200.0, channel="Takeaway", shift_manager="Niran"),
            SaleRecord(sale_date=datetime(2024, 2, 19, 11, 30), shop_name="Shell Cafe BTS", shop_id="SC002", product_category="Others", product_name="Mineral Water", quantity=15, unit_price=25.0, total_sales=375.0, channel="Dine-in", shift_manager="Niran"),
            SaleRecord(sale_date=datetime(2024, 2, 22, 14, 0), shop_name="Shell Cafe BTS", shop_id="SC002", product_category="Food", product_name="Sandwich", quantity=8, unit_price=65.0, total_sales=520.0, channel="Dine-in", shift_manager="Niran"),

            # Shell Cafe Silom – Feb 2024
            SaleRecord(sale_date=datetime(2024, 2, 1, 9, 0), shop_name="Shell Cafe Silom", shop_id="SC003", product_category="Coffee", product_name="Cappuccino", quantity=10, unit_price=85.0, total_sales=850.0, channel="Dine-in", shift_manager="Pattaya"),
            SaleRecord(sale_date=datetime(2024, 2, 3, 10, 30), shop_name="Shell Cafe Silom", shop_id="SC003", product_category="Coffee", product_name="Americano", quantity=12, unit_price=55.0, total_sales=660.0, channel="Takeaway", shift_manager="Pattaya"),
            SaleRecord(sale_date=datetime(2024, 2, 5, 8, 0), shop_name="Shell Cafe Silom", shop_id="SC003", product_category="Food", product_name="Croissant", quantity=20, unit_price=40.0, total_sales=800.0, channel="Dine-in", shift_manager="Pattaya"),
            SaleRecord(sale_date=datetime(2024, 2, 7, 12, 0), shop_name="Shell Cafe Silom", shop_id="SC003", product_category="Coffee", product_name="Espresso", quantity=8, unit_price=60.0, total_sales=480.0, channel="Takeaway", shift_manager="Pattaya"),
            SaleRecord(sale_date=datetime(2024, 2, 9, 14, 0), shop_name="Shell Cafe Silom", shop_id="SC003", product_category="Beverage", product_name="Thai Tea Latte", quantity=15, unit_price=70.0, total_sales=1050.0, channel="Takeaway", shift_manager="Pattaya"),
            SaleRecord(sale_date=datetime(2024, 2, 12, 11, 0), shop_name="Shell Cafe Silom", shop_id="SC003", product_category="Food", product_name="Sandwich", quantity=10, unit_price=65.0, total_sales=650.0, channel="Dine-in", shift_manager="Pattaya"),
            SaleRecord(sale_date=datetime(2024, 2, 14, 9, 30), shop_name="Shell Cafe Silom", shop_id="SC003", product_category="Coffee", product_name="Cappuccino", quantity=25, unit_price=85.0, total_sales=2125.0, channel="Dine-in", shift_manager="Pattaya"),
            SaleRecord(sale_date=datetime(2024, 2, 17, 13, 0), shop_name="Shell Cafe Silom", shop_id="SC003", product_category="Coffee", product_name="Americano", quantity=18, unit_price=55.0, total_sales=990.0, channel="Takeaway", shift_manager="Pattaya"),
            SaleRecord(sale_date=datetime(2024, 2, 20, 15, 0), shop_name="Shell Cafe Silom", shop_id="SC003", product_category="Others", product_name="Mineral Water", quantity=20, unit_price=25.0, total_sales=500.0, channel="Dine-in", shift_manager="Pattaya"),
            SaleRecord(sale_date=datetime(2024, 2, 23, 10, 0), shop_name="Shell Cafe Silom", shop_id="SC003", product_category="Food", product_name="Croissant", quantity=30, unit_price=40.0, total_sales=1200.0, channel="Takeaway", shift_manager="Pattaya"),
        ]
        db.add_all(sales)
        db.commit()
