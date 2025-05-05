#!/bin/sh
set -e

echo "Instalando dependencias..."
composer install --no-interaction --prefer-dist --optimize-autoloader

echo "Configurando permisos..."
chown -R www-data:www-data /var/www/html/var
chmod -R 775 /var/www/html/var

echo "Ejecutando migraciones Doctrine..."
php bin/console doctrine:migrations:migrate --no-interaction

echo "Limpiando cache..."
php bin/console cache:clear --env=prod

echo "Arrancando PHP-FPM..."
exec php-fpm
