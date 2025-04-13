#!/bin/sh
set -e

echo "🔧 Instalando dependencias de Symfony..."
composer install --no-interaction --prefer-dist --optimize-autoloader

echo "Arrancando PHP-FPM..."
exec php-fpm
