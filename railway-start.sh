#!/bin/bash
# ! 31/05/2025 - Script de inicio MEJORADO para Railway con Docker

set -e  # Salir si hay errores

echo "🚀 EYRA Backend v0.6.0 - Railway Docker Deployment"
echo "📅 $(date)"
echo "🔧 Entorno: ${APP_ENV:-prod}"
echo "🐳 Puerto: ${PORT:-8000}"
echo "📦 Build: Docker"

# Verificar que estamos en el directorio correcto
if [ ! -f "bin/console" ]; then
    echo "❌ ERROR: No se encuentra bin/console. ¿Estamos en el directorio correcto?"
    ls -la
    exit 1
fi

# Verificar que las variables críticas existen
if [ -z "$DATABASE_URL" ]; then
    echo "❌ ERROR: DATABASE_URL no está configurada"
    echo "🔍 Variables disponibles:"
    env | grep -E "(DATABASE|APP_|JWT_)" || echo "No hay variables relacionadas"
    exit 1
fi

echo "✅ DATABASE_URL configurada correctamente"

# Verificar claves JWT
if [ ! -f "config/jwt/private.pem" ] || [ ! -f "config/jwt/public.pem" ]; then
    echo "⚠️ ADVERTENCIA: Claves JWT no encontradas, intentando generar..."
    mkdir -p config/jwt
    openssl genpkey -out config/jwt/private.pem -algorithm rsa -pkcs8 -bits 4096 2>/dev/null || {
        echo "❌ ERROR: No se pudieron generar claves JWT"
        exit 1
    }
    openssl pkey -in config/jwt/private.pem -out config/jwt/public.pem -pubout 2>/dev/null
    chmod 600 config/jwt/private.pem
    chmod 644 config/jwt/public.pem
    echo "✅ Claves JWT generadas correctamente"
else
    echo "✅ Claves JWT encontradas"
fi

# Ejecutar migraciones si estamos en producción
if [ "${APP_ENV:-prod}" = "prod" ]; then
    echo "🗄️ Ejecutando migraciones de base de datos..."
    php bin/console doctrine:migrations:migrate --no-interaction --allow-no-migration 2>&1 || {
        echo "⚠️ ADVERTENCIA: Migraciones fallaron, continuando..."
        echo "📊 Estado de la base de datos:"
        php bin/console doctrine:migrations:status --no-interaction 2>&1 || echo "No se pudo obtener estado"
    }
    
    echo "🔄 Limpiando cache de producción..."
    php bin/console cache:clear --env=prod --no-debug 2>&1 || {
        echo "⚠️ ADVERTENCIA: Cache clear falló"
    }
    php bin/console cache:warmup --env=prod --no-debug 2>&1 || {
        echo "⚠️ ADVERTENCIA: Cache warmup falló"
    }
fi

# Verificar que la aplicación está configurada correctamente
echo "🔍 Verificando configuración de Symfony..."
php bin/console debug:container --env=prod > /dev/null 2>&1 || {
    echo "❌ ERROR: Configuración de Symfony inválida"
    echo "🔧 Intentando diagnóstico:"
    php bin/console debug:config framework --env=prod 2>&1 || echo "No se pudo obtener configuración"
    exit 1
}

echo "✅ Configuración de Symfony válida"

# Verificar puerto
PORT=${PORT:-8000}
if ! [[ "$PORT" =~ ^[0-9]+$ ]] || [ "$PORT" -lt 1 ] || [ "$PORT" -gt 65535 ]; then
    echo "⚠️ ADVERTENCIA: Puerto $PORT inválido, usando 8000"
    PORT=8000
fi

echo "🌐 Iniciando servidor web en 0.0.0.0:$PORT"
echo "📍 Document root: $(pwd)/public"
echo "🔗 Health check: http://0.0.0.0:$PORT/api/health"
echo "⏰ $(date) - Servidor listo"

# Iniciar servidor web
exec php -S 0.0.0.0:$PORT -t public/
