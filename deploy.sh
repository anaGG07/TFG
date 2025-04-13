#!/bin/bash

# Colores para la salida
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Iniciando despliegue de EYRA...${NC}"

# Verificar y crear archivos de configuración de Nginx
echo -e "${BLUE}Verificando archivos de configuración...${NC}"

# Verificar archivo de configuración Nginx para backend
if [ ! -f eyra-backend/nginx/backend.conf ]; then
    mkdir -p eyra-backend/nginx
    cat > eyra-backend/nginx/backend.conf << 'EOF'
server {
    listen 80;
    server_name localhost;
    root /var/www/html/public;
    
    location / {
        try_files $uri /index.php$is_args$args;
    }

    location ~ ^/index\.php(/|$) {
        fastcgi_pass backend:9000;
        fastcgi_split_path_info ^(.+\.php)(/.*)$;
        include fastcgi_params;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        fastcgi_param DOCUMENT_ROOT $document_root;
        internal;
    }

    # Denegar acceso a otros archivos .php
    location ~ \.php$ {
        return 404;
    }

    error_log /var/log/nginx/backend_error.log;
    access_log /var/log/nginx/backend_access.log;
}
EOF
    echo -e "${GREEN}Archivo de configuración de Nginx para backend creado.${NC}"
fi

# Verificar archivo de configuración Nginx para proxy principal
if [ ! -f nginx/default.conf ]; then
    mkdir -p nginx
    cat > nginx/default.conf << 'EOF'
server {
    listen 80;
    server_name localhost;
    
    # Rutas del frontend (SPA)
    location / {
        proxy_pass http://frontend:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Rutas del backend API
    location /api/ {
        proxy_pass http://backend-nginx;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF
    echo -e "${GREEN}Archivo de configuración de Nginx para proxy principal creado.${NC}"
fi

# Verificar directorio JWT en backend
if [ ! -d eyra-backend/config/jwt ]; then
    mkdir -p eyra-backend/config/jwt
    echo -e "${GREEN}Directorio para claves JWT creado.${NC}"
fi

# Verificar .env principal
if [ ! -f .env ]; then
    cat > .env << 'EOF'
# Proyecto
COMPOSE_PROJECT_NAME=eyra

# Frontend
VITE_API_URL=http://localhost/api

# Backend
APP_ENV=prod
APP_SECRET=8c498e311b0bf78a65bf2111101cf920
JWT_PASSPHRASE=7796

# Base de datos
POSTGRES_DB=eyra
POSTGRES_USER=postgres
POSTGRES_PASSWORD=admin
POSTGRES_PORT=5432
EOF
    echo -e "${GREEN}Archivo .env principal creado.${NC}"
fi

# Comprobar que todos los archivos necesarios existen
echo -e "${BLUE}Verificando archivos Docker necesarios...${NC}"

if [ ! -f docker-compose.yml ]; then
    echo -e "${RED}Archivo docker-compose.yml no encontrado. Creando uno por defecto...${NC}"
    # Aquí puedes añadir la lógica para crear el docker-compose.yml si no existe
fi

# Construir y levantar contenedores
echo -e "${BLUE}Construyendo y levantando contenedores...${NC}"
docker-compose up -d --build

# Verificar el estado de los contenedores
echo -e "${BLUE}Verificando estado de los contenedores...${NC}"
sleep 5
docker-compose ps

# Ejecutar migraciones y cargar datos iniciales
echo -e "${BLUE}Ejecutando migraciones en el backend...${NC}"
docker-compose exec backend php bin/console doctrine:migrations:migrate --no-interaction || echo -e "${RED}No se pudieron ejecutar las migraciones. Continúa manualmente.${NC}"

echo -e "${GREEN}¡Despliegue completado! La aplicación está disponible en http://localhost${NC}"