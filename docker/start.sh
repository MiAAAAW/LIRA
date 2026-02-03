#!/bin/sh
set -e

echo "🚀 Starting Laravel application..."

# 1. Permisos de storage (Solo si es necesario, ya que el Dockerfile suele hacerlo)
# Pero lo mantenemos para mayor seguridad
chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache
chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# 2. Crear base de datos SQLite si no existe
# Importante: Laravel buscará en la ruta que defina DB_DATABASE
if [ ! -f /var/www/html/database/database.sqlite ]; then
    echo "📦 Creating SQLite database..."
    touch /var/www/html/database/database.sqlite
    chown www-data:www-data /var/www/html/database/database.sqlite
fi

# --- AQUÍ QUITÉ EL BLOQUE DE GENERAR APP_KEY ---
# La llave la debes poner manualmente en el panel de Coolify

# 3. Cache de configuración (Muy importante en producción)
echo "⚡ Caching configuration..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

# 4. Migraciones
echo "🗄️ Running migrations..."
php artisan migrate --force

# 5. Link de storage
echo "🔗 Linking storage..."
php artisan storage:link --force

echo "✅ Application ready!"

# 6. Iniciar supervisor
# Añadimos -n para que corra en primer plano (obligatorio para Docker)
exec /usr/bin/supervisord -n -c /etc/supervisor/conf.d/supervisord.conf