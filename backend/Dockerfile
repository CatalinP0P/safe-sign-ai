# Imaginea de bază
FROM python:3.11-slim

# Setăm directorul de lucru
WORKDIR /app

# Instalăm dependințele necesare (libpq pentru postgres)
RUN apt-get update && apt-get install -y \
    libpq-dev \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copiem fișierul de cerințe și instalăm pachetele
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiem tot codul din folderul backend în container
COPY . .

# Expunem portul pentru FastAPI
EXPOSE 8000

# Comanda de start
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
