# Etapa de construcción
FROM node:20 AS builder

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar archivos de configuración e instalar dependencias
COPY package*.json ./
RUN npm install

# Copiar el resto del código fuente
COPY . .

# Build de producción (genera /app/dist)
RUN npm run build
