from typing import List
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import engine, Base, SessionLocal, get_db
from routers import equipment, downtime, sales
from seed_data import seed_database
import models  # ensure models are registered before create_all


app = FastAPI(title="FormatMgrY26 API", version="1.0.0")

# CORS – allow Vite dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create DB tables
Base.metadata.create_all(bind=engine)

# Seed on startup
@app.on_event("startup")
def on_startup():
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()


# Routers
app.include_router(equipment.router, prefix="/api")
app.include_router(downtime.router, prefix="/api")
app.include_router(sales.router, prefix="/api")


@app.get("/api/shops")
def list_shops(db: Session = Depends(get_db)):
    from models import Shop
    from schemas import ShopOut
    shops = db.query(Shop).all()
    return [ShopOut.model_validate(s) for s in shops]


@app.get("/api/health")
@app.get("/health")
def health():
    return {"status": "ok"}
