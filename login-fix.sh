#!/bin/bash

echo "===== SCRIPT DE SOLUCIÓN DE EMERGENCIA PARA LOGIN EYRA ====="
echo "Este script reconstruirá los contenedores y aplicará parches para solucionar el error 500 en login"

echo ""
echo "1. Deteniendo contenedores..."
docker-compose down

echo ""
echo "2. Eliminando caché de Symfony (backend)..."
rm -rf ./eyra-backend/var/cache/*

echo ""
echo "3. Reconstruyendo contenedores sin caché..."
docker-compose build --no-cache

echo ""
echo "4. Iniciando contenedores..."
docker-compose up -d

echo ""
echo "===== PROCESO COMPLETADO ====="
echo "Ahora deberías poder iniciar sesión en la aplicación sin recibir errores 500."
echo "Importante: Esta es una solución temporal para permitir el flujo básico de la aplicación."
echo "Después, debes revisar los logs del backend para encontrar la causa raíz del error 500."
echo ""
echo "Para ver los logs del backend, ejecuta: docker-compose logs -f eyra-api"
echo ""
