# Etapa de construcción
FROM node:20 AS builder

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar archivos de configuración e instalar dependencias
COPY package*.json ./
RUN npm install

# Copiar el resto del código fuente
COPY . .

# Asegurarse de que el directorio dist existe
RUN mkdir -p /app/dist

# Build de producción (genera /app/dist)
RUN npm run build

# Verificar el contenido generado
RUN ls -la /app/dist

# Configurar permisos
RUN chmod -R 755 /app/dist
RUN chown -R node:node /app/dist

# Etapa de producción (opcional, si quieres un contenedor más ligero)
FROM nginx:1.25-alpine AS production

# Copiar los archivos estáticos generados
COPY --from=builder /app/dist /usr/share/nginx/html

# Exponer el puerto 80
EXPOSE 80

# Comando por defecto
CMD ["nginx", "-g", "daemon off;"]
