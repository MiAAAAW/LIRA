# Dockerfile para Laravel + Inertia + React
# Optimizado para Coolify

# ============================================
# Stage 1: Build de assets (Node.js)
# ============================================
FROM node:22-alpine AS node-builder

WORKDIR /app

# Copiar package files
COPY package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar código fuente
COPY . .

# Build de producción
RUN npm run build

# ============================================
# Stage 2: Build de PHP
# ============================================
FROM php:8.3-fpm-alpine AS php-builder

# Instalar dependencias del sistema
RUN apk add --no-cache \
    git \
    curl \
    libpng-dev \
    libxml2-dev \
    zip \
    unzip \
    oniguruma-dev \
    sqlite-dev

# Instalar extensiones PHP
RUN docker-php-ext-install pdo pdo_mysql pdo_sqlite mbstring exif pcntl bcmath gd

# Instalar Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /app

# Copiar composer files primero (para cache)
COPY composer.json composer.lock ./

# Instalar dependencias PHP (sin dev)
RUN composer install --no-dev --no-scripts --no-autoloader --prefer-dist

# Copiar el resto del código
COPY . .

# Copiar assets compilados del stage anterior
COPY --from=node-builder /app/public/build ./public/build

# Generar autoloader optimizado
RUN composer dump-autoload --optimize

# ============================================
# Stage 3: Imagen final de producción
# ============================================
FROM php:8.3-fpm-alpine

# Instalar dependencias runtime
RUN apk add --no-cache \
    nginx \
    supervisor \
    libpng \
    sqlite-libs \
    curl

# Instalar extensiones PHP
RUN docker-php-ext-install pdo pdo_mysql pdo_sqlite mbstring bcmath gd opcache

# Configurar PHP para producción
RUN mv "$PHP_INI_DIR/php.ini-production" "$PHP_INI_DIR/php.ini"

# Configurar OPcache para producción
RUN echo "opcache.enable=1" >> /usr/local/etc/php/conf.d/opcache.ini && \
    echo "opcache.memory_consumption=128" >> /usr/local/etc/php/conf.d/opcache.ini && \
    echo "opcache.interned_strings_buffer=8" >> /usr/local/etc/php/conf.d/opcache.ini && \
    echo "opcache.max_accelerated_files=4000" >> /usr/local/etc/php/conf.d/opcache.ini && \
    echo "opcache.revalidate_freq=2" >> /usr/local/etc/php/conf.d/opcache.ini && \
    echo "opcache.fast_shutdown=1" >> /usr/local/etc/php/conf.d/opcache.ini

WORKDIR /var/www/html

# Copiar aplicación desde builder
COPY --from=php-builder /app .

# Crear directorios necesarios
RUN mkdir -p storage/framework/{sessions,views,cache} \
    && mkdir -p storage/logs \
    && mkdir -p bootstrap/cache \
    && mkdir -p database

# Permisos
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 775 storage bootstrap/cache

# Configuración de Nginx
COPY docker/nginx.conf /etc/nginx/http.d/default.conf

# Configuración de Supervisor
COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Script de inicio
COPY docker/start.sh /start.sh
RUN chmod +x /start.sh

EXPOSE 80

CMD ["/start.sh"]
