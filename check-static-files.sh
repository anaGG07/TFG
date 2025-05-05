#!/bin/bash
set -e

echo "Verificando archivos estáticos y configuración MIME..."

echo "1. Deteniendo contenedores si están en ejecución"
docker compose down

echo "2. Limpiando volúmenes frontend_build si existe"
docker volume rm eyra_frontend_build || true

echo "3. Reconstruyendo imágenes"
docker compose build --no-cache

echo "4. Iniciando contenedores"
docker compose up -d

echo "5. Esperando a que el build del frontend complete..."
sleep 10

echo "6. Verificando estructura del contenedor frontend"
docker exec eyra-web ls -la /app/dist/ || echo "El directorio /app/dist/ parece no existir"

echo "7. Verificando assets en el contenedor de frontend"
docker exec eyra-web find /app/dist/ -name "*.js" -o -name "*.css" | sort || echo "No se encontraron archivos .js o .css"

echo "8. Mostrando la lista de archivos en el contenedor Nginx"
docker exec eyra-proxy ls -la /usr/share/nginx/html/ || echo "El directorio /usr/share/nginx/html/ parece vacío"

echo "9. Verificando la existencia de archivos assets en Nginx"
docker exec eyra-proxy find /usr/share/nginx/html/ -name "*.js" -o -name "*.css" | sort || echo "No se encontraron archivos .js o .css"

echo "10. Comprobando la respuesta del servidor web para un archivo JS"
JS_FILE=$(docker exec eyra-proxy find /usr/share/nginx/html/ -name "*.js" | head -1)
if [ -n "$JS_FILE" ]; then
  JS_URI=${JS_FILE#/usr/share/nginx/html}
  echo "Verificando archivo: $JS_URI"
  curl -I "https://eyraclub.es$JS_URI" || echo "No se pudo obtener el header del archivo JS"
else
  echo "No se encontró ningún archivo JS para probar"
fi

echo "11. Verificando las configuraciones MIME en Nginx"
docker exec eyra-proxy nginx -T | grep mime.types || echo "No se encontró configuración de mime.types"
docker exec eyra-proxy nginx -T | grep "application/javascript" || echo "No se encontró configuración para JavaScript"

echo "12. Revisando logs de Nginx"
docker exec eyra-proxy cat /var/log/nginx/error.log || echo "No se pudo acceder al log de errores"

echo "Verificación completa. Revisa cualquier error mostrado arriba."
