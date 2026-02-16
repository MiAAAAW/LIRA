#!/bin/sh
# El 'set -e' hace que si algo falla, el script se detenga y no siga rompiendo cosas
set -e

echo "🚀 Starting Laravel application..."

# 1. CREAR DIRECTORIOS DE LOGS (Esto soluciona tu error actual)
# Creamos las carpetas y los archivos vacíos para que Supervisor no llore
mkdir -p /var/log/supervisor
mkdir -p /var/log/nginx
touch /var/log/supervisor/supervisord.log
touch /var/log/nginx/access.log
touch /var/log/nginx/error.log

# 2. PERMISOS DE CARPETAS
# Aseguramos que el usuario www-data pueda escribir en storage y logs
chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache /var/log/supervisor /var/log/nginx
chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# 3. ESPERAR A QUE POSTGRES ESTÉ LISTO
echo "🐘 Waiting for PostgreSQL..."
MAX_RETRIES=30
RETRY=0
until php -r "new PDO('pgsql:host='.getenv('DB_HOST').';port='.getenv('DB_PORT').';dbname='.getenv('DB_DATABASE'), getenv('DB_USERNAME'), getenv('DB_PASSWORD'));" 2>/dev/null; do
    RETRY=$((RETRY + 1))
    if [ $RETRY -ge $MAX_RETRIES ]; then
        echo "❌ Could not connect to PostgreSQL after $MAX_RETRIES attempts"
        exit 1
    fi
    echo "⏳ PostgreSQL not ready yet... retry $RETRY/$MAX_RETRIES"
    sleep 2
done
echo "✅ PostgreSQL is ready!"

# 4. CACHE DE PRODUCCIÓN
echo "⚡ Caching configuration..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

# 5. MIGRACIONES
echo "🗄️ Running migrations..."
php artisan migrate --force

# 6. STORAGE LINK
echo "🔗 Linking storage..."
# Usamos || true para que si el link ya existe no rompa el despliegue
php artisan storage:link --force || true

echo "✅ Application ready!"

# 7. INICIAR SUPERVISOR
# -n: Corre en primer plano para que el contenedor no se cierre
# -c: Ruta al archivo de configuración
echo "🎬 Starting Supervisor..."
exec /usr/bin/supervisord -n -c /etc/supervisor/conf.d/supervisord.conf