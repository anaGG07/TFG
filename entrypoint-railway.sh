#!/bin/sh
# ! 31/05/2025 - Entrypoint modificado para Railway deployment

set -e

# Define entorno si no se pasa desde fuera
export APP_ENV=${APP_ENV:-prod}
export APP_DEBUG=0

echo "===> 🚀 EYRA Backend - Railway Deployment"
echo "===> 🔧 Entorno: $APP_ENV"
echo "===> 🐳 Puerto: $PORT"

# Solo instalar dependencias si es necesario
if [ "$INSTALL_DEPS" = "true" ]; then
    echo "===> 📦 Instalando dependencias..."
    composer install --no-interaction --prefer-dist --optimize-autoloader
fi

# Solo configurar permisos si es necesario
if [ "$SET_PERMISSIONS" = "true" ]; then
    echo "===> 🔒 Configurando permisos..."
    mkdir -p var/cache var/log
    chown -R www-data:www-data var/ || echo "⚠️ No se pudieron cambiar permisos (normal en Railway)"
    chmod -R 775 var/ || echo "⚠️ No se pudieron cambiar permisos (normal en Railway)"
fi

# Solo ejecutar migraciones si es necesario
if [ "$RUN_MIGRATIONS" = "true" ]; then
    echo "===> 🗄️ Ejecutando migraciones Doctrine..."
    php bin/console doctrine:migrations:migrate --no-interaction --env=$APP_ENV || {
        echo "⚠️ ADVERTENCIA: Migraciones fallaron, continuando..."
    }
fi

# Solo limpiar caché si es necesario
if [ "$CLEAR_CACHE" = "true" ]; then
    echo "===> 🔄 Limpiando caché..."
    php bin/console cache:clear --env=$APP_ENV || echo "⚠️ Cache clear falló"
    php bin/console cache:warmup --env=$APP_ENV || echo "⚠️ Cache warmup falló"
fi

# Verificar configuración
echo "===> 🔍 Verificando configuración..."
php bin/console debug:container --env=$APP_ENV > /dev/null || {
    echo "❌ ERROR: Configuración de Symfony inválida"
    exit 1
}

echo "===> ✅ Configuración válida"
echo "===> 🌐 Arrancando servidor web en 0.0.0.0:$PORT"

# En lugar de PHP-FPM, usar servidor built-in para Railway
exec php -S 0.0.0.0:$PORT -t public/
