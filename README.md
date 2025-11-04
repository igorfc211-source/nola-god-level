# 🧠 Nola Data Insight — Food Analytics Platform

> Desenvolvido para o **🏆 God Level Coder Challenge** — solução de analytics para donos de restaurantes.  
> Backend: `/api` (FastAPI) · Frontend: `/frontend` (Next.js)

---

![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs)
![Docker](https://img.shields.io/badge/Docker-0db7ed?style=for-the-badge&logo=docker&logoColor=white)
![React](https://img.shields.io/badge/React-61dafb?style=for-the-badge&logo=react&logoColor=000)

---

## 🍔 O Problema: Analytics para Restaurantes

### Contexto

Você foi contratado como tech lead para resolver um problema crítico que afeta 10.000+ restaurantes no Brasil.

### A Persona — Maria (dona de restaurantes)

- 3 restaurantes em São Paulo
- 5 canais de venda (balcão, iFood, Rappi, WhatsApp, app) 
- 200+ produtos no cardápio  
- ~1.500 pedidos/semana  
- Tomada de decisão diária sobre estoque, preços, promoções

### Dores que Maria não conseguia responder (antes)

- “Qual produto vende mais na quinta à noite no iFood?”  
- “Meu ticket médio está caindo. É por canal ou por loja?”  
- “Quais produtos têm menor margem e devo repensar o preço?”  
- “Meu tempo de entrega piorou. Em quais dias/horários?”  
- “Quais clientes compraram 3+ vezes mas não voltam há 30 dias?”

> **Ela tem os dados — mas não consegue explorá-los livremente.** Dashboards estáticos não respondem perguntas ad-hoc; Power BI é genérico/complexo.

---

## ✅ O Desafio (resumido)

Criar uma plataforma que permita donos de restaurante:
- Explorar dados sem escrever SQL
- Criar visualizações customizadas
- Comparar períodos/lojas/canais
- Extrair insights acionáveis rapidamente

**Restrição:** usar o banco PostgreSQL fornecido (500k vendas).

---

## 🎯 Status: Problema tratado (o que entreguei)

Este repositório procura uma **solução funcional** que resolve — na prática — a maior parte das necessidades da persona Maria:

### Funcionalidades (resolvem as dores)
- ✅ **Visão geral de faturamento por período** (mês, semana, dia) — `ActivityChart.tsx`  
  — Maria pode ver faturamento do mês em segundos (critério 1).
- ✅ **Ranking de produtos e lojas** — via agregação `/api/sales` e componentes de leaderboard  
  — Permite identificar os 10 produtos mais vendidos no delivery (critério 2).
- ✅ **Comparativo entre duas lojas** (`LeaderboardSection.tsx`) — receita, pedidos e ticket médio lado a lado (critério 3).
- ✅ **Back-end robusto** — FastAPI (`/api`) que serve `stores` e `sales` com `created_at` em ISO; pronto para Docker.
- ✅ **Containerização** — Docker Compose para levantar Postgres + FastAPI + (opcional) frontend.

---

## 🏗️ Arquitetura & Onde ficam as coisas

📂 nola-god-level/
├── api/ # Backend (FastAPI)
│ ├── main.py # endpoints: /api/sales, /api/stores, /api/sales/{id}
│ ├── models.py
│ ├── database.py
│ └── Dockerfile
│
├── frontend/ # Next.js + TypeScript
│ ├── app/
│ │ ├── components/ # ActivityChart.tsx, LeaderboardSection.tsx, etc.
├── docker-compose.yml
└── README.md

yaml
Copy code

---

## 🧠 Tecnologias Utilizadas (por que cada uma)

| Tecnologia | Uso no projeto |
|---|---|
| **FastAPI** | Backend leve e rápido, serialização automática de datetimes e docs em `/api/docs`. |
| **PostgreSQL** | Banco relacional para armazenar 500k vendas; robusto para analytics com índices. |
| **Docker + Docker Compose** | Facilita deploy local e padroniza ambiente entre desenvolvedores. |
| **Next.js (React + TypeScript)** | Frontend moderno, SSR/SSG se necessário e boa performance. |
| **Tailwind CSS + Shadcn/UI** | Estilização rápida e componentes prontos. |
| **Recharts** | Visualização de dados (gráficos dinâmicos). |
| **psycopg2 / RealDictCursor** | Conexão PostgreSQL no backend para retornar dicionários JSON-friendly. |
| **Pandas (opcional no backend)** | (Usado em scripts de análise/ETL; opcional em runtime) |

---

## ⚙️ Como Rodar (local — `api` como pasta do backend)

### Pré-requisitos
- Docker & Docker Compose  
- Node.js 18+ (caso rode o frontend localmente)

### Passos rápidos

```bash
# clone
git clone https://github.com/igorfcg/nola-god-level.git
cd nola-god-level

# sobe serviços (Postgres + API)
docker compose up --build

# opcional: rodar frontend localmente
cd frontend
npm install
npm run dev
Acesse:

Frontend: http://localhost:3000

FastAPI docs: http://localhost:8000/api/docs

Postgres: localhost:5432 (credenciais no docker-compose)

Observação: o backend está servido sob o caminho /api (ex.: http://localhost:8000/api/sales).

📚 Endpoints Principais (API em /api)
GET /api/stores — lista de lojas

GET /api/sales?limit=1000 — últimas vendas (limit configurável)

GET /api/sales/{id} — detalhes de uma venda

Formato created_at: ISO-8601 (ex: 2025-11-03T21:15:00) — pronto para new Date() no frontend.

🔍 Como a solução responde às perguntas da Maria
“Qual produto vende mais na quinta à noite no iFood?”

→ Comparativo entre lojas/canais com série temporal no ActivityChart e LeaderboardSection.

“Quais produtos têm menor margem?”
→ Suporte no schema para custos; rota de métricas calcula margem (precisa popular dados de custo).

Observação: todas essas análises são possíveis via API + frontend — algumas exigem dados complementares (custos, timestamps precisos) para análise de margem e churn.

📈 Demonstração & Prints
Inspiração da UI: ./docs/insp.jpg

Tela do projeto: ./docs/tel.jpg 

Vídeo demonstrativo:
👉 https://youtu.be/KYlrPxPsHcw

💭 Reflexão Final — Transparência sobre o tempo
Desenvolvi a solução com foco nos requisitos principais do desafio e na integração entre Docker, FastAPI e PostgreSQL.
Nem tudo foi concluído por limitação de tempo — há recursos prototipados que exigem maturação.

Ainda estou aprendendo — cada entrega é um passo à frente. Se você avaliará saiba que fiz muito aprendendo, então apesar de tudo foi uma honra❤️

🧑‍💻 Contato / Autor
Desenvolvido por: Igor frança
📧 Email: Igorfc211@gmail.com

```
📈 Demonstração & Prints
Inspiração da UI: ./docs/insp.jpg

Tela do projeto: ./docs/tel.jpg 

Vídeo demonstrativo:
👉 https://youtu.be/KYlrPxPsHcw

