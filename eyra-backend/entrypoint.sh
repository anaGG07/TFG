#!/bin/sh
set -e

# Define entorno si no se pasa desde fuera
export APP_ENV=${APP_ENV:-prod}
export APP_DEBUG=0

echo "===> Entorno: $APP_ENV"
echo "===> Instalando dependencias..."
composer install --no-interaction --prefer-dist --optimize-autoloader

echo "===> Configurando permisos..."
chown -R www-data:www-data /var/www/html/var
chmod -R 775 /var/www/html/var

echo "===> Ejecutando migraciones Doctrine..."
php bin/console doctrine:migrations:migrate --no-interaction --env=$APP_ENV

echo "===> Limpiando caché..."
php bin/console cache:clear --env=$APP_ENV

echo "===> Arrancando PHP-FPM..."
exec php-fpm
