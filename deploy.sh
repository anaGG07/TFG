#!/bin/bash

# Script de despliegue seguro para EYRA
# Este script reconstruye la aplicación y verifica que no haya referencias a localhost

echo "===== EYRA - Script de Despliegue Seguro ====="
echo "Iniciando proceso de despliegue..."

# 1. Verificar las variables de entorno
echo "Verificando variables de entorno..."
if grep -q "VITE_API_URL=https://eyraclub.es/api" .env; then
  echo "✅ Variable VITE_API_URL configurada correctamente."
else
  echo "⚠️ La variable VITE_API_URL no parece estar configurada correctamente."
  echo "Valor actual:"
  grep "VITE_API_URL" .env || echo "No encontrada"
  echo ""
  echo "¿Deseas continuar de todos modos? [s/N]"
  read -r continue
  
  if [[ ! "$continue" =~ ^[sS]$ ]]; then
    echo "Operación cancelada. Corrige el archivo .env primero."
    exit 1
  fi
fi

# 2. Detener y reconstruir contenedores
echo ""
echo "Deteniendo contenedores..."
docker-compose down

echo ""
echo "Reconstruyendo contenedores sin caché..."
docker-compose build --no-cache

echo ""
echo "Iniciando contenedores..."
docker-compose up -d

# 3. Verificar archivos compilados
echo ""
echo "Esperando a que los archivos compilados estén disponibles..."
sleep 10

echo ""
echo "Verificando archivos compilados en busca de referencias a localhost:8000..."
if grep -r "localhost:8000" ./eyra-frontend/dist/ > /dev/null; then
  echo "⚠️ ¡Se encontraron referencias a localhost:8000 en los archivos compilados!"
  echo "Aplicando corrección automática..."
  
  find ./eyra-frontend/dist -type f -name "*.js" -exec sed -i 's|http://localhost:8000|https://eyraclub.es|g' {} \;
  
  if grep -r "localhost:8000" ./eyra-frontend/dist/ > /dev/null; then
    echo "❌ La corrección automática falló. Todavía hay referencias a localhost:8000."
    grep -r "localhost:8000" ./eyra-frontend/dist/ | head -5
  else
    echo "✅ Corrección aplicada exitosamente. No quedan referencias a localhost:8000."
  fi
else
  echo "✅ No se encontraron referencias a localhost:8000. ¡Todo correcto!"
fi

# 4. Verificar configuración de nginx
echo ""
echo "Verificando configuración de nginx..."
if [ -f ./nginx/default.conf ]; then
  if grep -q "eyraclub.es" ./nginx/default.conf; then
    echo "✅ Configuración de nginx parece correcta."
  else
    echo "⚠️ La configuración de nginx podría no estar configurada correctamente para eyraclub.es."
  fi
else
  echo "❌ No se encontró el archivo de configuración de nginx."
fi

# 5. Mostrar contenedores en ejecución
echo ""
echo "Contenedores en ejecución:"
docker-compose ps

echo ""
echo "===== Despliegue completado ====="
echo "Recuerda verificar la aplicación en el navegador accediendo a https://eyraclub.es"
echo ""
