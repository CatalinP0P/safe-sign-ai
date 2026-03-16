# Imaginea de bază pentru Node.js
FROM node:20-alpine

# Setăm directorul de lucru
WORKDIR /app

# Copiem fișierele de configurare pentru npm
COPY package*.json ./

# Instalăm dependințele
RUN npm install

# Copiem restul codului
COPY . .

# Expunem portul pentru Next.js
EXPOSE 3000

# Comanda de start
CMD ["npm", "run", "dev"]
