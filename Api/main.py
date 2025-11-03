from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import psycopg2
from psycopg2.extras import RealDictCursor

app = FastAPI(title="Nola Challenge API")

def get_conn():
    return psycopg2.connect(
        dbname="challenge_db",
        user="challenge",
        password="challenge_2024",
        host="localhost",  # <<< importante
        port=5432
    )

# ------------ MODELOS ------------------------


#Modelo de venda(s)
class Sale(BaseModel):
    id: int
    store_id: int
    channel_id: int
    total_amount: float
    created_at: str
    sale_status_desc: str
    delivery_fee: float





# ------------------------------------ ROTAS -----------------------------------------------------
@app.get("/")
def root():
    return {"message": "🚀 API da Nola Challenge ativa!"}


from datetime import datetime

#Forte alteração nessa rota para resolver os problemas de compatibilidade, espcificamente o "datatime"

#rota de vendas
@app.get("/sales", response_model=list[Sale])
def list_sales(limit: int = 50):
    """Lista as últimas vendas"""
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

    # converte datetime para string ISO
    for row in rows:
        if isinstance(row["created_at"], datetime):
            row["created_at"] = row["created_at"].isoformat()

    return rows


#Rota de vendas especificas
@app.get("/sales/{sale_id}")
def get_sale(sale_id: int):
    """Detalhes de uma venda específica"""
    conn = get_conn()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    cur.execute("""
        SELECT * FROM sales WHERE id = %s
    """, (sale_id,))
    sale = cur.fetchone()
    conn.close()
    if not sale:
        raise HTTPException(status_code=404, detail="Venda não encontrada")
    return sale


"""Lista de lojas"""
@app.get("/stores")
def list_stores():
    conn = get_conn()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    cur.execute("SELECT id, name, city, state, is_active FROM stores LIMIT 100")
    stores = cur.fetchall()
    conn.close()
    return stores
