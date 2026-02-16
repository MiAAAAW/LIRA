<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Comunicado;
use App\Models\SiteSetting;
use App\Services\CloudflareMediaService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ComunicadoController extends Controller
{
    public function __construct(
        protected CloudflareMediaService $r2Service
    ) {}

    public function index(): Response
    {
        $items = Comunicado::orderByDesc('fecha')
            ->paginate(config('pandilla.pagination.admin', 15));

        return Inertia::render('Admin/Comunicados/Index', [
            'items' => $items,
            'tipos' => config('pandilla.tipos_comunicado'),
            'sectionVisible' => SiteSetting::isSectionVisible('comunicados'),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'titulo' => 'required|string|max:255',
            'tipo' => 'required|string',
            'numero' => 'nullable|string|max:50',
            'fecha' => 'required|date',
            'extracto' => 'nullable|string|max:500',
            'contenido' => 'required|string',
            'r2_image_key' => 'nullable|string',
            'r2_image_url' => 'nullable|url',
            'firmante' => 'nullable|string|max:255',
            'cargo_firmante' => 'nullable|string|max:255',
            'fecha_vigencia' => 'nullable|date',
            'orden' => 'nullable|integer',
            'is_published' => 'boolean',
            'is_featured' => 'boolean',
        ]);

        // Auto-generar extracto desde contenido si no viene
        if (empty($validated['extracto'])) {
            $validated['extracto'] = mb_substr(strip_tags($validated['contenido']), 0, 500);
        }

        // Solo 1 destacado a la vez
        if (!empty($validated['is_featured'])) {
            Comunicado::where('is_featured', true)->update(['is_featured' => false]);
        }

        Comunicado::create($validated);

        return redirect()->route('admin.comunicados.index')
            ->with('success', 'Comunicado creado correctamente');
    }

    public function update(Request $request, Comunicado $comunicado)
    {
        $validated = $request->validate([
            'titulo' => 'required|string|max:255',
            'tipo' => 'required|string',
            'numero' => 'nullable|string|max:50',
            'fecha' => 'required|date',
            'extracto' => 'nullable|string|max:500',
            'contenido' => 'required|string',
            'r2_image_key' => 'nullable|string',
            'r2_image_url' => 'nullable|url',
            'firmante' => 'nullable|string|max:255',
            'cargo_firmante' => 'nullable|string|max:255',
            'fecha_vigencia' => 'nullable|date',
            'orden' => 'nullable|integer',
            'is_published' => 'boolean',
            'is_featured' => 'boolean',
        ]);

        // Auto-generar extracto desde contenido si no viene
        if (empty($validated['extracto'])) {
            $validated['extracto'] = mb_substr(strip_tags($validated['contenido']), 0, 500);
        }

        // Si hay nueva imagen en R2, eliminar la anterior
        if (!empty($validated['r2_image_key']) && $comunicado->r2_image_key) {
            $this->r2Service->delete($comunicado->r2_image_key);
        }

        // Solo 1 destacado a la vez
        if (!empty($validated['is_featured'])) {
            Comunicado::where('is_featured', true)
                ->where('id', '!=', $comunicado->id)
                ->update(['is_featured' => false]);
        }

        $comunicado->update($validated);

        return redirect()->route('admin.comunicados.index')
            ->with('success', 'Comunicado actualizado correctamente');
    }

    public function destroy(Comunicado $comunicado)
    {
        if ($comunicado->r2_image_key) {
            $this->r2Service->delete($comunicado->r2_image_key);
        }

        $comunicado->delete();

        return redirect()->route('admin.comunicados.index')
            ->with('success', 'Comunicado eliminado correctamente');
    }

    public function togglePublish(Comunicado $comunicado)
    {
        $comunicado->update(['is_published' => !$comunicado->is_published]);

        return back()->with('success',
            $comunicado->is_published ? 'Publicado correctamente' : 'Despublicado correctamente'
        );
    }
}
