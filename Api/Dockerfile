#alterei o Docker file para funcionar com FastAPI

# Usa a imagem base do Python 3.12
FROM python:3.12-slim

# Define diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos de dependências
COPY requirements.txt .

# Instala as dependências
RUN pip install --no-cache-dir -r requirements.txt

# Copia o código da API
COPY . /app

# Expõe a porta 8000
EXPOSE 8000

# Comando para rodar a API
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
