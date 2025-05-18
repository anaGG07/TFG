FROM php:8.2-fpm

# Instala dependencias del sistema
RUN apt-get update && apt-get install -y \
    git unzip zip libpq-dev libicu-dev \
    && docker-php-ext-install pdo pdo_pgsql intl

# Composer
COPY --from=composer:2.6 /usr/bin/composer /usr/bin/composer

# Ajuste PHP-FPM para escuchar en puerto 9000
COPY php-fpm.conf /usr/local/etc/php-fpm.conf

# Establece directorio de trabajo
WORKDIR /var/www/html

# Copia proyecto
COPY . .

# Copia entrypoint y da permisos
COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

# Expone puerto para PHP-FPM
EXPOSE 9000

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["php-fpm"]
