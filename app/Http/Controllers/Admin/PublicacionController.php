<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Publicacion;
use App\Models\SiteSetting;
use App\Services\ImageProcessingService;
use App\Services\CloudflareMediaService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class PublicacionController extends Controller
{
    public function __construct(
        protected ImageProcessingService $imageService,
        protected CloudflareMediaService $cloudflareService
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

            // Imagen portada (requerido)
            'imagen_portada' => 'required|image|max:5120',

            // PDF - puede venir como file tradicional O como CDN direct-upload
            'documento_pdf' => 'nullable|file|mimes:pdf|max:40960',
            'r2_pdf_key' => 'nullable|string',
            'r2_pdf_url' => 'nullable|url',

            // Enlace externo (alternativa a PDF)
            'enlace_externo' => 'nullable|url|max:500',

            // Control
            'orden' => 'nullable|integer',
            'is_published' => 'boolean',
            'is_featured' => 'boolean',
        ]);

        // Procesar imagen portada localmente
        $paths = $this->imageService->process(
            $request->file('imagen_portada'),
            'publicaciones'
        );
        $validated['imagen_portada'] = $paths['original'];

        // PDF: Prioridad CDN > File tradicional
        if ($request->r2_pdf_key) {
            // CDN direct-upload
            $validated['r2_pdf_key'] = $request->r2_pdf_key;
            $validated['r2_pdf_url'] = $request->r2_pdf_url;
            $validated['documento_pdf'] = null;
        } elseif ($request->hasFile('documento_pdf')) {
            // File tradicional (local storage)
            $validated['documento_pdf'] = $request->file('documento_pdf')
                ->store(config('pandilla.uploads.paths.documents', 'pandilla/documents'), 'public');
            $validated['r2_pdf_key'] = null;
            $validated['r2_pdf_url'] = null;
        }

        // Limpiar campos CDN del array validated (se asignan directamente al modelo)
        $r2Key = $validated['r2_pdf_key'] ?? null;
        $r2Url = $validated['r2_pdf_url'] ?? null;
        unset($validated['r2_pdf_key'], $validated['r2_pdf_url']);

        // Crear el registro
        $publicacion = new Publicacion($validated);

        // Asignar campos CDN directamente si existen
        if ($r2Key) {
            $publicacion->r2_pdf_key = $r2Key;
            $publicacion->r2_pdf_url = $r2Url;
        }

        $publicacion->save();

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

            // Imagen portada (opcional en update)
            'imagen_portada' => 'nullable|image|max:5120',

            // PDF - puede venir como file tradicional O como CDN direct-upload
            'documento_pdf' => 'nullable|file|mimes:pdf|max:40960',
            'r2_pdf_key' => 'nullable|string',
            'r2_pdf_url' => 'nullable|url',

            // Enlace externo (alternativa a PDF)
            'enlace_externo' => 'nullable|url|max:500',

            // Control
            'orden' => 'nullable|integer',
            'is_published' => 'boolean',
            'is_featured' => 'boolean',
        ]);

        // Procesar nueva imagen si se sube
        if ($request->hasFile('imagen_portada')) {
            $paths = $this->imageService->process(
                $request->file('imagen_portada'),
                'publicaciones',
                $publicacion->imagen_portada
            );
            $validated['imagen_portada'] = $paths['original'];
        }

        // PDF: Prioridad CDN > File tradicional
        if ($request->r2_pdf_key) {
            // Nuevo PDF via CDN - eliminar anteriores
            if ($publicacion->r2_pdf_key) {
                $this->cloudflareService->delete($publicacion->r2_pdf_key);
            }
            if ($publicacion->documento_pdf) {
                Storage::disk('public')->delete($publicacion->documento_pdf);
            }

            $publicacion->r2_pdf_key = $request->r2_pdf_key;
            $publicacion->r2_pdf_url = $request->r2_pdf_url;
            $publicacion->documento_pdf = null;
        } elseif ($request->hasFile('documento_pdf')) {
            // Nuevo PDF via file tradicional - eliminar anteriores
            if ($publicacion->r2_pdf_key) {
                $this->cloudflareService->delete($publicacion->r2_pdf_key);
                $publicacion->r2_pdf_key = null;
                $publicacion->r2_pdf_url = null;
            }
            if ($publicacion->documento_pdf) {
                Storage::disk('public')->delete($publicacion->documento_pdf);
            }

            $validated['documento_pdf'] = $request->file('documento_pdf')
                ->store(config('pandilla.uploads.paths.documents', 'pandilla/documents'), 'public');
        }

        // Limpiar campos CDN del array validated
        unset($validated['r2_pdf_key'], $validated['r2_pdf_url']);

        $publicacion->fill($validated);
        $publicacion->save();

        return redirect()->route('admin.publicaciones.index')
            ->with('success', 'Publicacion actualizada correctamente');
    }

    public function destroy(Publicacion $publicacion)
    {
        // Eliminar imagen portada
        if ($publicacion->imagen_portada) {
            $this->imageService->delete($publicacion->imagen_portada, 'publicaciones');
        }

        // Eliminar PDF de CDN
        if ($publicacion->r2_pdf_key) {
            $this->cloudflareService->delete($publicacion->r2_pdf_key);
        }

        // Eliminar PDF local (legacy)
        if ($publicacion->documento_pdf) {
            Storage::disk('public')->delete($publicacion->documento_pdf);
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
