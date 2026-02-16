<?php

use App\Http\Controllers\LandingController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\Ley24325Controller;
use App\Http\Controllers\Admin\BaseLegalController;
use App\Http\Controllers\Admin\RegistroIndecopiController;
use App\Http\Controllers\Admin\EstandarteController;
use App\Http\Controllers\Admin\PresidenteController;
use App\Http\Controllers\Admin\VideoController;
use App\Http\Controllers\Admin\AudioController;
use App\Http\Controllers\Admin\DistincionController;
use App\Http\Controllers\Admin\PublicacionController;
use App\Http\Controllers\Admin\ComunicadoController;
use App\Http\Controllers\Admin\SettingsController;
use App\Http\Controllers\Admin\MiembroController;
use App\Http\Controllers\Admin\EventoController;
use App\Http\Controllers\Admin\SancionController;
use App\Http\Controllers\Admin\AsistenciaReportController;
use App\Http\Controllers\Admin\HeroConfigController;
use App\Http\Controllers\Admin\MusicConfigController;
use App\Http\Controllers\Api\DirectUploadController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Landing Page (connects to database via LandingController)
|--------------------------------------------------------------------------
*/

Route::get('/', [LandingController::class, 'index'])->name('landing');

/*
|--------------------------------------------------------------------------
| User Dashboard (Default)
|--------------------------------------------------------------------------
*/

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

/*
|--------------------------------------------------------------------------
| Profile Routes
|--------------------------------------------------------------------------
*/

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

/*
|--------------------------------------------------------------------------
| Admin Panel Routes
|--------------------------------------------------------------------------
*/

Route::prefix('admin')
    ->middleware(['auth', 'verified'])
    ->name('admin.')
    ->group(function () {

        // Dashboard
        Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

        // Settings
        Route::get('/settings', [SettingsController::class, 'index'])->name('settings');
        Route::post('/settings/toggle-section', [SettingsController::class, 'toggleSection'])->name('settings.toggle-section');

        // Direct Upload API (para subir archivos grandes a R2)
        Route::post('/upload/presigned', [DirectUploadController::class, 'getPresignedUrl'])->name('upload.presigned');
        Route::post('/upload/confirm', [DirectUploadController::class, 'confirmUpload'])->name('upload.confirm');

        // Grupo 1: Marco Legal e Historia (modal-based: sin create/edit pages)
        Route::resource('ley24325', Ley24325Controller::class)->only(['index', 'store', 'update', 'destroy']);
        Route::resource('base-legal', BaseLegalController::class)->only(['index', 'store', 'update', 'destroy'])->parameters(['base-legal' => 'baseLegal']);
        Route::resource('indecopi', RegistroIndecopiController::class)->only(['index', 'store', 'update', 'destroy']);
        Route::resource('estandartes', EstandarteController::class)->only(['index', 'store', 'update', 'destroy']);
        Route::resource('presidentes', PresidenteController::class)->only(['index', 'store', 'update', 'destroy']);

        // Grupo 2: Multimedia y Comunicación (modal-based: sin create/edit pages)
        Route::resource('videos', VideoController::class)->only(['index', 'store', 'update', 'destroy']);
        Route::resource('audios', AudioController::class)->only(['index', 'store', 'update', 'destroy']);
        Route::resource('distinciones', DistincionController::class)->only(['index', 'store', 'update', 'destroy'])->parameters(['distinciones' => 'distincion']);
        Route::resource('publicaciones', PublicacionController::class)->only(['index', 'store', 'update', 'destroy'])->parameters(['publicaciones' => 'publicacion']);
        Route::resource('comunicados', ComunicadoController::class)->only(['index', 'store', 'update', 'destroy']);

        // Hero Config (Landing Page)
        Route::resource('hero-config', HeroConfigController::class)->only(['index', 'store', 'update', 'destroy'])->parameters(['hero-config' => 'heroConfig']);

        // Music Config (Landing Page - Música de Fondo)
        Route::resource('music-config', MusicConfigController::class)->only(['index', 'store', 'update', 'destroy'])->parameters(['music-config' => 'musicConfig']);

        // Grupo 3: Miembros y Asistencia
        Route::resource('miembros', MiembroController::class)->only(['index', 'store', 'update', 'destroy']);
        Route::resource('eventos', EventoController::class)->only(['index', 'store', 'update', 'destroy']);
        Route::resource('sanciones', SancionController::class)->only(['index', 'store', 'update', 'destroy'])->parameters(['sanciones' => 'sancion']);

        // Asistencia (rutas custom del EventoController)
        Route::get('eventos/{evento}/asistencia', [EventoController::class, 'asistencia'])->name('eventos.asistencia');
        Route::post('eventos/{evento}/asistencia', [EventoController::class, 'marcarAsistencia'])->name('eventos.marcar-asistencia');
        Route::post('eventos/{evento}/quick-add-miembro', [EventoController::class, 'quickAddMiembro'])->name('eventos.quick-add-miembro');
        Route::post('eventos/{evento}/cerrar-lista', [EventoController::class, 'cerrarLista'])->name('eventos.cerrar-lista');
        Route::post('eventos/{evento}/reabrir-lista', [EventoController::class, 'reabrirLista'])->name('eventos.reabrir-lista');

        // Reportes de Asistencia
        Route::get('reportes/asistencia', [AsistenciaReportController::class, 'index'])->name('reportes.asistencia');
        Route::get('reportes/asistencia/miembro/{miembro}', [AsistenciaReportController::class, 'porMiembro'])->name('reportes.asistencia.miembro');

        // Acciones adicionales
        Route::post('ley24325/{ley24325}/toggle-publish', [Ley24325Controller::class, 'togglePublish'])->name('ley24325.toggle-publish');
        Route::post('base-legal/{baseLegal}/toggle-publish', [BaseLegalController::class, 'togglePublish'])->name('base-legal.toggle-publish');
        Route::post('indecopi/{indecopi}/toggle-publish', [RegistroIndecopiController::class, 'togglePublish'])->name('indecopi.toggle-publish');
        Route::post('estandartes/{estandarte}/toggle-publish', [EstandarteController::class, 'togglePublish'])->name('estandartes.toggle-publish');
        Route::post('presidentes/{presidente}/toggle-publish', [PresidenteController::class, 'togglePublish'])->name('presidentes.toggle-publish');
        Route::post('videos/{video}/toggle-publish', [VideoController::class, 'togglePublish'])->name('videos.toggle-publish');
        Route::post('audios/{audio}/toggle-publish', [AudioController::class, 'togglePublish'])->name('audios.toggle-publish');
        Route::post('distinciones/{distincion}/toggle-publish', [DistincionController::class, 'togglePublish'])->name('distinciones.toggle-publish');
        Route::post('publicaciones/{publicacion}/toggle-publish', [PublicacionController::class, 'togglePublish'])->name('publicaciones.toggle-publish');
        Route::post('comunicados/{comunicado}/toggle-publish', [ComunicadoController::class, 'togglePublish'])->name('comunicados.toggle-publish');
        Route::post('miembros/{miembro}/toggle-publish', [MiembroController::class, 'togglePublish'])->name('miembros.toggle-publish');
        Route::post('eventos/{evento}/toggle-publish', [EventoController::class, 'togglePublish'])->name('eventos.toggle-publish');
        Route::post('sanciones/{sancion}/toggle-publish', [SancionController::class, 'togglePublish'])->name('sanciones.toggle-publish');
        Route::post('hero-config/{heroConfig}/toggle-featured', [HeroConfigController::class, 'toggleFeatured'])->name('hero-config.toggle-featured');
        Route::post('music-config/{musicConfig}/toggle-featured', [MusicConfigController::class, 'toggleFeatured'])->name('music-config.toggle-featured');
    });

/*
|--------------------------------------------------------------------------
| Auth Routes
|--------------------------------------------------------------------------
*/

require __DIR__.'/auth.php';
