#!/bin/bash
# ! 31/05/2025 - Script de inicio para Railway con Docker

set -e  # Salir si hay errores

echo "🚀 Iniciando EYRA Backend en Railway..."
echo "🔧 Entorno: $APP_ENV"
echo "🐳 Puerto: $PORT"

# Verificar que las variables críticas existen
if [ -z "$DATABASE_URL" ]; then
    echo "❌ ERROR: DATABASE_URL no está configurada"
    exit 1
fi

# Ejecutar migraciones si estamos en producción
if [ "$APP_ENV" = "prod" ]; then
    echo "🗄️ Ejecutando migraciones de base de datos..."
    php bin/console doctrine:migrations:migrate --no-interaction || {
        echo "⚠️ ADVERTENCIA: Migraciones fallaron, continuando..."
    }
    
    echo "🔄 Limpiando cache de producción..."
    php bin/console cache:clear --env=prod --no-debug
    php bin/console cache:warmup --env=prod --no-debug
fi

# Verificar que la aplicación está configurada correctamente
echo "🔍 Verificando configuración..."
php bin/console debug:container --env=prod > /dev/null || {
    echo "❌ ERROR: Configuración de Symfony inválida"
    exit 1
}

echo "✅ Configuración válida"
echo "🌐 Iniciando servidor web en 0.0.0.0:$PORT"

# Iniciar servidor web
exec php -S 0.0.0.0:$PORT -t public/
