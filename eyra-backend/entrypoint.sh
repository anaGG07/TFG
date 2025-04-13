#!/bin/sh
set -e

echo "Instalando dependencias..."
composer install --no-interaction --prefer-dist --optimize-autoloader

echo "Ejecutando migraciones de base de datos..."
php bin/console doctrine:schema:update --force

echo "Arrancando PHP-FPM..."
exec php-fpm
