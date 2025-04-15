FROM php:8.2-fpm

# Instala dependencias necesarias del sistema
RUN apt-get update && apt-get install -y \
    git unzip zip libpq-dev libicu-dev nginx \
    && docker-php-ext-install pdo pdo_pgsql intl

# Instala Composer
COPY --from=composer:2.6 /usr/bin/composer /usr/bin/composer

# Copia archivos del proyecto
WORKDIR /var/www/html
COPY . .

# Copia configuración de Nginx personalizada
COPY nginx.conf /etc/nginx/nginx.conf

# Copia entrypoint
COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

# Exponer el puerto en el que Nginx escucha
EXPOSE 9000

# Establece entrypoint
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]

# Lanza nginx (php-fpm se lanza desde entrypoint)
CMD ["nginx", "-g", "daemon off;"]
