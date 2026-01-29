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

        // Grupo 1: Marco Legal e Historia (modal-based: sin create/edit pages)
        Route::resource('ley24325', Ley24325Controller::class)->only(['index', 'store', 'update', 'destroy']);
        Route::resource('base-legal', BaseLegalController::class)->only(['index', 'store', 'update', 'destroy'])->parameters(['base-legal' => 'baseLegal']);
        Route::resource('indecopi', RegistroIndecopiController::class)->only(['index', 'store', 'update', 'destroy']);
        Route::resource('estandartes', EstandarteController::class);
        Route::resource('presidentes', PresidenteController::class);

        // Grupo 2: Multimedia y Comunicación
        Route::resource('videos', VideoController::class);
        Route::resource('audios', AudioController::class);
        Route::resource('distinciones', DistincionController::class);
        Route::resource('publicaciones', PublicacionController::class);
        Route::resource('comunicados', ComunicadoController::class);

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
    });

/*
|--------------------------------------------------------------------------
| Auth Routes
|--------------------------------------------------------------------------
*/

require __DIR__.'/auth.php';
