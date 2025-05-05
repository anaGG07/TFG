#!/bin/bash
set -e

echo "Verificando permisos y estructura del proyecto..."

echo "1. Deteniendo contenedores si están en ejecución"
docker compose down

echo "2. Limpiando volúmenes frontend_build si existe"
docker volume rm eyra_frontend_build || true

echo "3. Reconstruyendo imágenes"
docker compose build --no-cache

echo "4. Iniciando contenedores"
docker compose up -d

echo "5. Verificando estructura del contenedor de frontend"
docker exec eyra-web ls -la /app/dist || echo "El directorio /app/dist parece no existir"

echo "6. Verificando estructura del contenedor de Nginx"
docker exec eyra-proxy ls -la /usr/share/nginx/html || echo "El directorio /usr/share/nginx/html parece vacío"

echo "7. Verificando logs de Nginx"
docker exec eyra-proxy cat /var/log/nginx/error.log || echo "No se pudo acceder al log de errores"

echo "8. Verificando que el servidor responde correctamente"
curl -I http://localhost || echo "No se pudo conectar al servidor local"

echo "Verificación completa. Revisa cualquier error mostrado arriba."
