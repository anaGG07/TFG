FROM php:8.2-fpm

# Dependencias
RUN apt-get update && apt-get install -y \
    git unzip zip libpq-dev libicu-dev \
    && docker-php-ext-install pdo pdo_pgsql intl

# Instala Composer
COPY --from=composer:2.6 /usr/bin/composer /usr/bin/composer

# Copia el entrypoint
COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

# Directorio de trabajo
WORKDIR /var/www/html
COPY . .

# Permisos
RUN chown -R www-data:www-data /var/www/html

EXPOSE 9000

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
