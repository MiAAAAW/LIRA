<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Distincion;
use App\Models\SiteSetting;
use App\Services\CloudflareMediaService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DistincionController extends Controller
{
    public function __construct(
        protected CloudflareMediaService $r2Service
    ) {}

    public function index(): Response
    {
        $items = Distincion::orderByDesc('fecha_otorgamiento')
            ->paginate(config('pandilla.pagination.admin', 15));

        return Inertia::render('Admin/Distinciones/Index', [
            'items' => $items,
            'tipos' => config('pandilla.tipos_distincion'),
            'sectionVisible' => SiteSetting::isSectionVisible('distinciones'),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'titulo' => 'required|string|max:255',
            'tipo' => 'required|string|in:' . implode(',', array_keys(config('pandilla.tipos_distincion'))),
            'otorgante' => 'required|string|max:255',
            'fecha_otorgamiento' => 'required|date',
            'descripcion' => 'required|string',
            // PDF via direct upload (obligatorio)
            'r2_pdf_key' => 'required|string|max:500',
            'r2_pdf_url' => 'required|url|max:500',
            'orden' => 'nullable|integer',
            'is_published' => 'sometimes|boolean',
            'is_featured' => 'sometimes|boolean',
        ], [
            'r2_pdf_key.required' => 'El documento PDF es obligatorio',
            'r2_pdf_url.required' => 'El documento PDF es obligatorio',
        ]);

        Distincion::create($validated);

        return redirect()->route('admin.distinciones.index')
            ->with('success', 'Distincion creada correctamente');
    }

    public function update(Request $request, Distincion $distincion)
    {
        $validated = $request->validate([
            'titulo' => 'required|string|max:255',
            'tipo' => 'required|string|in:' . implode(',', array_keys(config('pandilla.tipos_distincion'))),
            'otorgante' => 'required|string|max:255',
            'fecha_otorgamiento' => 'required|date',
            'descripcion' => 'required|string',
            // PDF opcional en update (mantiene el existente si no se envía nuevo)
            'r2_pdf_key' => 'nullable|string|max:500',
            'r2_pdf_url' => 'nullable|url|max:500',
            'orden' => 'nullable|integer',
            'is_published' => 'sometimes|boolean',
            'is_featured' => 'sometimes|boolean',
        ]);

        // Solo actualizar PDF si se envía uno nuevo
        if (empty($validated['r2_pdf_key'])) {
            unset($validated['r2_pdf_key'], $validated['r2_pdf_url']);
        } else {
            // Si hay nuevo PDF, eliminar el anterior de R2
            if ($distincion->r2_pdf_key && $distincion->r2_pdf_key !== $validated['r2_pdf_key']) {
                $this->r2Service->delete($distincion->r2_pdf_key);
            }
        }

        $distincion->update($validated);

        return redirect()->route('admin.distinciones.index')
            ->with('success', 'Distincion actualizada correctamente');
    }

    public function destroy(Distincion $distincion)
    {
        // Eliminar PDF de R2
        if ($distincion->r2_pdf_key) {
            $this->r2Service->delete($distincion->r2_pdf_key);
        }

        $distincion->delete();

        return redirect()->route('admin.distinciones.index')
            ->with('success', 'Distincion eliminada correctamente');
    }

    public function togglePublish(Distincion $distincion)
    {
        $distincion->update(['is_published' => !$distincion->is_published]);

        return back()->with('success',
            $distincion->is_published ? 'Publicado correctamente' : 'Despublicado correctamente'
        );
    }
}
