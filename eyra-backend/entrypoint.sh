#!/bin/sh
set -e

echo "Instalando dependencias..."
composer install --no-interaction --prefer-dist --optimize-autoloader

echo "Ejecutando migraciones Doctrine..."
php bin/console doctrine:migrations:migrate --no-interaction

echo "Arrancando PHP-FPM..."
exec php-fpm
