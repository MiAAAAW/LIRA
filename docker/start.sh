#!/bin/sh
set -e

echo "🚀 Starting Laravel application..."

# Crear directorios de logs
mkdir -p /var/log/supervisor /var/log/nginx

# Asegurar permisos de storage
chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache
chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# Crear base de datos SQLite si no existe
if [ ! -f /var/www/html/database/database.sqlite ]; then
    echo "📦 Creating SQLite database..."
    touch /var/www/html/database/database.sqlite
    chown www-data:www-data /var/www/html/database/database.sqlite
fi

# Generar APP_KEY si no existe
if [ -z "$APP_KEY" ]; then
    echo "🔑 Generating APP_KEY..."
    php artisan key:generate --force
fi

# Cache de configuración (producción)
echo "⚡ Caching configuration..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Migraciones
echo "🗄️ Running migrations..."
php artisan migrate --force

# Link de storage
php artisan storage:link --force 2>/dev/null || true

echo "✅ Application ready!"

# Iniciar supervisor (nginx + php-fpm)
exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
