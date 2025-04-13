FROM php:8.2-fpm

# Dependencias necesarias
RUN apt-get update && apt-get install -y \
    git unzip zip libpq-dev libicu-dev \
    && docker-php-ext-install pdo pdo_pgsql intl

# Instala Composer
COPY --from=composer:2.6 /usr/bin/composer /usr/bin/composer

# Copia entrypoint
COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

# Establece directorio de trabajo
WORKDIR /var/www/html
COPY . .

# Establece el punto de entrada
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]

EXPOSE 9000
