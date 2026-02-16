<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\HeroConfig;
use App\Services\CloudflareMediaService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class HeroConfigController extends Controller
{
    public function index(): Response
    {
        $items = HeroConfig::orderByDesc('is_featured')
            ->orderBy('orden')
            ->orderByDesc('created_at')
            ->paginate(config('pandilla.pagination.admin', 15));

        return Inertia::render('Admin/HeroConfig/Index', [
            'items' => $items,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'titulo_principal' => 'required|string|max:255',
            'titulo_highlight' => 'nullable|string|max:255',
            'titulo_sufijo' => 'nullable|string|max:255',
            'subtitulo' => 'nullable|string|max:255',
            'anios' => 'nullable|string|max:50',
            // Direct upload — video o imagen (ya subido a R2 desde el cliente)
            'r2_key_media' => 'nullable|string|max:500',
            'media_url' => 'nullable|string|max:500',
        ]);

        // Nuevos heroes se crean siempre como inactivos.
        // El usuario los activa explícitamente con el toggle.
        $validated['is_featured'] = false;

        HeroConfig::create($validated);

        return redirect()->route('admin.hero-config.index')
            ->with('success', 'Hero creado correctamente');
    }

    public function update(Request $request, HeroConfig $heroConfig)
    {
        $validated = $request->validate([
            'titulo_principal' => 'required|string|max:255',
            'titulo_highlight' => 'nullable|string|max:255',
            'titulo_sufijo' => 'nullable|string|max:255',
            'subtitulo' => 'nullable|string|max:255',
            'anios' => 'nullable|string|max:50',
            // Direct upload — video o imagen (ya subido a R2 desde el cliente)
            'r2_key_media' => 'nullable|string|max:500',
            'media_url' => 'nullable|string|max:500',
        ]);

        // Handle media R2 replacement: si no viene nuevo media, conservar el existente
        if (!empty($validated['r2_key_media']) && $validated['r2_key_media'] !== $heroConfig->r2_key_media) {
            // New media uploaded — keep new values
        } elseif (empty($validated['r2_key_media'])) {
            unset($validated['r2_key_media']);
            if (empty($validated['media_url'])) {
                unset($validated['media_url']);
            }
        }

        // No tocar is_featured desde update — solo se cambia con toggleFeatured
        $heroConfig->update($validated);

        return redirect()->route('admin.hero-config.index')
            ->with('success', 'Hero actualizado correctamente');
    }

    public function destroy(HeroConfig $heroConfig, CloudflareMediaService $cloudflareService)
    {
        // Delete media file from R2
        if ($heroConfig->r2_key_media && $cloudflareService->isConfigured()) {
            try {
                $cloudflareService->delete($heroConfig->r2_key_media);
            } catch (\Exception $e) {
                // Log but don't block deletion
            }
        }

        $heroConfig->delete();

        return redirect()->route('admin.hero-config.index')
            ->with('success', 'Hero eliminado correctamente');
    }

    public function toggleFeatured(HeroConfig $heroConfig)
    {
        $newState = !$heroConfig->is_featured;

        // Transacción atómica: garantiza que siempre haya 0 o 1 activo, nunca 2
        DB::transaction(function () use ($heroConfig, $newState) {
            // Primero desactivar TODOS (incluido el actual)
            HeroConfig::where('is_featured', true)->update(['is_featured' => false]);

            // Si estamos activando, marcar solo este
            if ($newState) {
                $heroConfig->update(['is_featured' => true]);
            }
        });

        // Refrescar estado después de la transacción
        $heroConfig->refresh();

        return back()->with('success',
            $heroConfig->is_featured ? 'Hero marcado como activo' : 'Hero desmarcado como activo'
        );
    }
}
