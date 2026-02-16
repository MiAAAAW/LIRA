<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Estandarte;
use App\Models\SiteSetting;
use App\Services\CloudflareMediaService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class EstandarteController extends Controller
{
    public function __construct(
        protected CloudflareMediaService $r2Service
    ) {}

    public function index(): Response
    {
        try {
            $items = Estandarte::orderBy('orden')
                ->orderByDesc('created_at')
                ->paginate(config('pandilla.pagination.admin', 15));
        } catch (\Throwable $e) {
            Log::error('Estandartes index query failed', ['error' => $e->getMessage()]);
            throw $e;
        }

        return Inertia::render('Admin/Estandartes/Index', [
            'items' => $items,
            'sectionVisible' => SiteSetting::isSectionVisible('estandartes'),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'titulo' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'r2_image_key' => 'required|string',
            'r2_image_url' => 'required|url',
            'orden' => 'nullable|integer',
            'is_published' => 'boolean',
            'is_featured' => 'boolean',
        ]);

        $validated['orden'] = $validated['orden'] ?? 0;

        Estandarte::create($validated);

        return redirect()->route('admin.estandartes.index')
            ->with('success', 'Estandarte creado correctamente');
    }

    public function update(Request $request, Estandarte $estandarte)
    {
        $validated = $request->validate([
            'titulo' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'r2_image_key' => 'nullable|string',
            'r2_image_url' => 'nullable|url',
            'orden' => 'nullable|integer',
            'is_published' => 'boolean',
            'is_featured' => 'boolean',
        ]);

        $validated['orden'] = $validated['orden'] ?? 0;

        // Si hay nueva imagen en R2, eliminar la anterior
        if (!empty($validated['r2_image_key']) && $estandarte->r2_image_key) {
            $this->r2Service->delete($estandarte->r2_image_key);
        }

        $estandarte->update($validated);

        return redirect()->route('admin.estandartes.index')
            ->with('success', 'Estandarte actualizado correctamente');
    }

    public function destroy(Estandarte $estandarte)
    {
        if ($estandarte->r2_image_key) {
            $this->r2Service->delete($estandarte->r2_image_key);
        }

        $estandarte->delete();

        return redirect()->route('admin.estandartes.index')
            ->with('success', 'Estandarte eliminado correctamente');
    }

    public function togglePublish(Estandarte $estandarte)
    {
        $estandarte->update(['is_published' => !$estandarte->is_published]);

        return back()->with('success',
            $estandarte->is_published ? 'Publicado correctamente' : 'Despublicado correctamente'
        );
    }
}
