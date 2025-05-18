#!/bin/sh
set -e

# Define entorno si no se pasa desde fuera
export APP_ENV=${APP_ENV:-prod}
export APP_DEBUG=0

echo "===> Entorno: $APP_ENV"

# Solo instalar dependencias si es necesario
if [ "$INSTALL_DEPS" = "true" ]; then
    echo "===> Instalando dependencias..."
    composer install --no-interaction --prefer-dist --optimize-autoloader
fi

# Solo configurar permisos si es necesario
if [ "$SET_PERMISSIONS" = "true" ]; then
    echo "===> Configurando permisos..."
    chown -R www-data:www-data /var/www/html/var
    chmod -R 775 /var/www/html/var
fi

# Solo ejecutar migraciones si es necesario
if [ "$RUN_MIGRATIONS" = "true" ]; then
    echo "===> Ejecutando migraciones Doctrine..."
    php bin/console doctrine:migrations:migrate --no-interaction --env=$APP_ENV
fi

# Solo limpiar caché si es necesario
if [ "$CLEAR_CACHE" = "true" ]; then
    echo "===> Limpiando caché..."
    php bin/console cache:clear --env=$APP_ENV
fi

echo "===> Arrancando PHP-FPM..."
exec php-fpm
