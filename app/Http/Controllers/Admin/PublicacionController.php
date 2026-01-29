<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Publicacion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class PublicacionController extends Controller
{
    public function index(): Response
    {
        $items = Publicacion::orderByDesc('anio_publicacion')
            ->orderByDesc('created_at')
            ->paginate(config('pandilla.pagination.admin', 15));

        return Inertia::render('Admin/Publicaciones/Index', [
            'items' => $items,
            'tipos' => config('pandilla.tipos_publicacion'),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Publicaciones/Create', [
            'tipos' => config('pandilla.tipos_publicacion'),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'titulo' => 'required|string|max:255',
            'tipo' => 'required|string',
            'autor' => 'required|string|max:255',
            'editorial' => 'nullable|string|max:255',
            'isbn' => 'nullable|string|max:50',
            'anio_publicacion' => 'nullable|integer|min:1800|max:2100',
            'edicion' => 'nullable|string|max:50',
            'paginas' => 'nullable|integer|min:1',
            'descripcion' => 'required|string',
            'resumen' => 'nullable|string',
            'imagen_portada' => 'required|image|max:5120',
            'documento_pdf' => 'nullable|file|mimes:pdf|max:20480',
            'enlace_compra' => 'nullable|url|max:500',
            'enlace_descarga' => 'nullable|url|max:500',
            'precio' => 'nullable|numeric|min:0',
            'orden' => 'nullable|integer',
            'is_published' => 'boolean',
            'is_featured' => 'boolean',
        ]);

        $validated['imagen_portada'] = $request->file('imagen_portada')
            ->store(config('pandilla.uploads.paths.images'), 'public');

        if ($request->hasFile('documento_pdf')) {
            $validated['documento_pdf'] = $request->file('documento_pdf')
                ->store(config('pandilla.uploads.paths.documents'), 'public');
        }

        Publicacion::create($validated);

        return redirect()->route('admin.publicaciones.index')
            ->with('success', 'Publicación creada correctamente');
    }

    public function show(Publicacion $publicacion): Response
    {
        return Inertia::render('Admin/Publicaciones/Show', [
            'item' => $publicacion,
        ]);
    }

    public function edit(Publicacion $publicacion): Response
    {
        return Inertia::render('Admin/Publicaciones/Edit', [
            'item' => $publicacion,
            'tipos' => config('pandilla.tipos_publicacion'),
        ]);
    }

    public function update(Request $request, Publicacion $publicacion)
    {
        $validated = $request->validate([
            'titulo' => 'required|string|max:255',
            'tipo' => 'required|string',
            'autor' => 'required|string|max:255',
            'editorial' => 'nullable|string|max:255',
            'isbn' => 'nullable|string|max:50',
            'anio_publicacion' => 'nullable|integer|min:1800|max:2100',
            'edicion' => 'nullable|string|max:50',
            'paginas' => 'nullable|integer|min:1',
            'descripcion' => 'required|string',
            'resumen' => 'nullable|string',
            'imagen_portada' => 'nullable|image|max:5120',
            'documento_pdf' => 'nullable|file|mimes:pdf|max:20480',
            'enlace_compra' => 'nullable|url|max:500',
            'enlace_descarga' => 'nullable|url|max:500',
            'precio' => 'nullable|numeric|min:0',
            'orden' => 'nullable|integer',
            'is_published' => 'boolean',
            'is_featured' => 'boolean',
        ]);

        if ($request->hasFile('imagen_portada')) {
            if ($publicacion->imagen_portada) {
                Storage::disk('public')->delete($publicacion->imagen_portada);
            }
            $validated['imagen_portada'] = $request->file('imagen_portada')
                ->store(config('pandilla.uploads.paths.images'), 'public');
        }

        if ($request->hasFile('documento_pdf')) {
            if ($publicacion->documento_pdf) {
                Storage::disk('public')->delete($publicacion->documento_pdf);
            }
            $validated['documento_pdf'] = $request->file('documento_pdf')
                ->store(config('pandilla.uploads.paths.documents'), 'public');
        }

        $publicacion->update($validated);

        return redirect()->route('admin.publicaciones.index')
            ->with('success', 'Publicación actualizada correctamente');
    }

    public function destroy(Publicacion $publicacion)
    {
        $publicacion->delete();

        return redirect()->route('admin.publicaciones.index')
            ->with('success', 'Publicación eliminada correctamente');
    }

    public function togglePublish(Publicacion $publicacion)
    {
        $publicacion->update(['is_published' => !$publicacion->is_published]);

        return back()->with('success',
            $publicacion->is_published ? 'Publicado correctamente' : 'Despublicado correctamente'
        );
    }
}
