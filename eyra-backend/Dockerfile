FROM php:8.2-fpm

# Instala dependencias necesarias del sistema
RUN apt-get update && apt-get install -y \
    git unzip zip libpq-dev libicu-dev \
    && docker-php-ext-install pdo pdo_pgsql intl

# Instala Composer
COPY --from=composer:2.6 /usr/bin/composer /usr/bin/composer

# Establece el directorio de trabajo
WORKDIR /var/www/html

# Copia archivos del proyecto
COPY . .

# Asegura permisos y entrada
COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

# Usa entrypoint que lanza php-fpm
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]

# Expone el puerto interno para PHP-FPM (solo para Nginx interno)
EXPOSE 9000

# Comando por defecto: lanza el servidor PHP-FPM
CMD ["php-fpm"]
