#!/bin/bash
set -e

echo "Asegurando que los contenedores estén detenidos..."
docker compose down

echo "Limpiando caché de Symfony..."
rm -rf eyra-backend/var/cache/*

echo "Verificando cambios realizados..."
git status

echo "Iniciando contenedores sin ejecutar migraciones..."
SKIP_AUTO_MIGRATIONS=true docker compose up -d eyra-db
sleep 10 # Esperar a que la base de datos esté lista
SKIP_AUTO_MIGRATIONS=true docker compose up -d eyra-api

echo "Ejecutando migraciones manualmente con correcciones..."
docker exec -it eyra-api bash -c '
  php bin/console doctrine:schema:update --force
  php bin/console cache:clear
  # Verificar que el campo existe y añadirlo manualmente si es necesario
  php bin/console doctrine:query:sql "DO \$\$ 
  BEGIN 
      BEGIN
          ALTER TABLE \"user\" ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN NOT NULL DEFAULT FALSE;
      EXCEPTION
          WHEN duplicate_column THEN 
              -- La columna ya existe, no hacer nada
      END;
  END \$\$;"
'

echo "Reiniciando contenedores..."
docker compose restart eyra-api
docker compose up -d

echo "¡Proceso completado! Verifica los logs para asegurarte que todo esté funcionando:"
docker logs eyra-api
