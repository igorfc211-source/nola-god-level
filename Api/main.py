# main.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime

app = FastAPI(title="Nola Challenge API")

def get_conn():
    return psycopg2.connect(
        dbname="challenge_db",
        user="challenge",
        password="challenge_2024",
        host="localhost",
        port=5432
    )

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # em produção: restrinja
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------- MODELOS ----------------
class Sale(BaseModel):
    id: int
    store_id: int
    channel_id: int
    total_amount: float
    created_at: datetime
    sale_status_desc: str
    delivery_fee: float

class Store(BaseModel):
    id: int
    name: str
    city: str
    state: str
    is_active: bool

# ---------------- ROTAS ----------------
@app.get("/")
def root():
    return {"message": "API ativa"}

@app.get("/sales", response_model=list[Sale])
def list_sales(limit: int = 100):
    conn = get_conn()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    cur.execute("""
        SELECT id, store_id, channel_id, total_amount, created_at, delivery_fee, sale_status_desc
        FROM sales
        ORDER BY created_at DESC
        LIMIT %s
    """, (limit,))
    rows = cur.fetchall()
    conn.close()
    return rows

@app.get("/stores", response_model=list[Store])
def list_stores():
    conn = get_conn()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    cur.execute("SELECT id, name, city, state, is_active FROM stores")
    stores = cur.fetchall()
    conn.close()
    return stores
