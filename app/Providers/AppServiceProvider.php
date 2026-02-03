<?php

namespace App\Providers;

use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\URL; // <--- IMPORTANTE: Añade esta línea

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // 1. Forzar HTTPS en producción
        // Esto soluciona el error de "Mixed Content" y la pantalla en blanco
        if (config('app.env') === 'production') {
            URL::forceScheme('https');
        }

        // 2. Tu configuración original de prefetch
        Vite::prefetch(concurrency: 3);
    }
}