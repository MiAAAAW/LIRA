<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Publicacion;
use App\Models\SiteSetting;
use App\Services\CloudflareMediaService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class PublicacionController extends Controller
{
    public function __construct(
        protected CloudflareMediaService $r2Service
    ) {}

    public function index(): Response
    {
        $items = Publicacion::orderByDesc('anio_publicacion')
            ->orderByDesc('created_at')
            ->paginate(config('pandilla.pagination.admin', 15));

        return Inertia::render('Admin/Publicaciones/Index', [
            'items' => $items,
            'tipos' => config('pandilla.tipos_publicacion'),
            'sectionVisible' => SiteSetting::isSectionVisible('publicaciones'),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            // Campos principales
            'titulo' => 'required|string|max:255',
            'tipo' => 'required|string|in:libro,revista,articulo,investigacion,tesis,otro',
            'autor' => 'required|string|max:255',

            // Metadata (opcionales)
            'editorial' => 'nullable|string|max:255',
            'anio_publicacion' => 'nullable|integer|min:1800|max:2100',
            'isbn' => 'nullable|string|max:50',
            'descripcion' => 'nullable|string',

            // Imagen portada (R2 direct-upload)
            'r2_image_key' => 'required|string',
            'r2_image_url' => 'required|url',

            // PDF (R2 direct-upload, opcional)
            'r2_pdf_key' => 'nullable|string',
            'r2_pdf_url' => 'nullable|url',

            // Enlace externo (alternativa a PDF)
            'enlace_externo' => 'nullable|url|max:500',

            // Control
            'orden' => 'nullable|integer',
            'is_published' => 'boolean',
            'is_featured' => 'boolean',
        ]);

        Publicacion::create($validated);

        return redirect()->route('admin.publicaciones.index')
            ->with('success', 'Publicacion creada correctamente');
    }

    public function update(Request $request, Publicacion $publicacion)
    {
        $validated = $request->validate([
            // Campos principales
            'titulo' => 'required|string|max:255',
            'tipo' => 'required|string|in:libro,revista,articulo,investigacion,tesis,otro',
            'autor' => 'required|string|max:255',

            // Metadata (opcionales)
            'editorial' => 'nullable|string|max:255',
            'anio_publicacion' => 'nullable|integer|min:1800|max:2100',
            'isbn' => 'nullable|string|max:50',
            'descripcion' => 'nullable|string',

            // Imagen portada (R2 direct-upload, opcional en update)
            'r2_image_key' => 'nullable|string',
            'r2_image_url' => 'nullable|url',

            // PDF (R2 direct-upload, opcional)
            'r2_pdf_key' => 'nullable|string',
            'r2_pdf_url' => 'nullable|url',

            // Enlace externo (alternativa a PDF)
            'enlace_externo' => 'nullable|url|max:500',

            // Control
            'orden' => 'nullable|integer',
            'is_published' => 'boolean',
            'is_featured' => 'boolean',
        ]);

        // Si hay nueva imagen en R2, eliminar la anterior
        if (!empty($validated['r2_image_key']) && $publicacion->r2_image_key) {
            $this->r2Service->delete($publicacion->r2_image_key);
        }

        // Si hay nuevo PDF en R2, eliminar el anterior
        if (!empty($validated['r2_pdf_key']) && $publicacion->r2_pdf_key) {
            $this->r2Service->delete($publicacion->r2_pdf_key);
        }

        $publicacion->update($validated);

        return redirect()->route('admin.publicaciones.index')
            ->with('success', 'Publicacion actualizada correctamente');
    }

    public function destroy(Publicacion $publicacion)
    {
        // Eliminar imagen de R2
        if ($publicacion->r2_image_key) {
            $this->r2Service->delete($publicacion->r2_image_key);
        }

        // Eliminar PDF de R2
        if ($publicacion->r2_pdf_key) {
            $this->r2Service->delete($publicacion->r2_pdf_key);
        }

        $publicacion->delete();

        return redirect()->route('admin.publicaciones.index')
            ->with('success', 'Publicacion eliminada correctamente');
    }

    public function togglePublish(Publicacion $publicacion)
    {
        $publicacion->update(['is_published' => !$publicacion->is_published]);

        return back()->with('success',
            $publicacion->is_published ? 'Publicado correctamente' : 'Despublicado correctamente'
        );
    }
}
