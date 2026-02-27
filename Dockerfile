# ============================================
# Stage 1: Build de assets (Node.js)
# ============================================
FROM node:22-alpine AS node-builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ============================================
# Stage 2: Build de PHP (Aquí compilamos TODO)
# ============================================
FROM php:8.3-fpm-alpine AS php-builder

# Instalamos dependencias de compilación
RUN apk add --no-cache \
    git \
    curl \
    libpng-dev \
    libjpeg-turbo-dev \
    libwebp-dev \
    freetype-dev \
    libxml2-dev \
    zip \
    unzip \
    oniguruma-dev \
    sqlite-dev \
    postgresql-dev \
    linux-headers

# Configurar GD con soporte JPEG, WebP y Freetype
RUN docker-php-ext-configure gd --with-jpeg --with-webp --with-freetype

# Compilamos TODAS las extensiones necesarias UNA SOLA VEZ
RUN docker-php-ext-install pdo pdo_mysql pdo_sqlite pdo_pgsql mbstring exif pcntl bcmath gd opcache

# Instalamos Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /app
COPY composer.json composer.lock ./
RUN composer install --no-dev --no-scripts --no-autoloader --prefer-dist
COPY . .
COPY --from=node-builder /app/public/build ./public/build
RUN composer dump-autoload --optimize

# ============================================
# Stage 3: Imagen final (Copiamos lo ya compilado)
# ============================================
FROM php:8.3-fpm-alpine

# Instalamos solo librerías de ejecución (runtime), NO compiladores
RUN apk add --no-cache \
    nginx \
    supervisor \
    libpng \
    libjpeg-turbo \
    libwebp \
    freetype \
    oniguruma \
    sqlite-libs \
    libpq \
    curl

# TRUCO MAESTRO: Copiamos las extensiones ya compiladas desde el builder
# Así evitamos ejecutar docker-php-ext-install de nuevo
COPY --from=php-builder /usr/local/lib/php/extensions/ /usr/local/lib/php/extensions/
COPY --from=php-builder /usr/local/etc/php/conf.d/ /usr/local/etc/php/conf.d/

# Configurar PHP y OPcache
RUN mv "$PHP_INI_DIR/php.ini-production" "$PHP_INI_DIR/php.ini"

# Límites de subida para PDFs grandes
RUN printf "upload_max_filesize=256M\npost_max_size=256M\nmemory_limit=512M\nmax_execution_time=300\nmax_input_time=300\n" \
    > "$PHP_INI_DIR/conf.d/uploads.ini"

WORKDIR /var/www/html

# Copiar aplicación limpia desde el builder
COPY --from=php-builder --chown=www-data:www-data /app .

# Directorios y permisos en una sola capa para ahorrar espacio
RUN mkdir -p storage/framework/{sessions,views,cache} storage/logs bootstrap/cache \
    && chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

COPY docker/nginx.conf /etc/nginx/http.d/default.conf
COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf
COPY docker/start.sh /start.sh
RUN chmod +x /start.sh

EXPOSE 80
CMD ["/start.sh"]