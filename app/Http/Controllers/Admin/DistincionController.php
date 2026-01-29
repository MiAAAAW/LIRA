<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Distincion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class DistincionController extends Controller
{
    public function index(): Response
    {
        $items = Distincion::orderByDesc('fecha_otorgamiento')
            ->paginate(config('pandilla.pagination.admin', 15));

        return Inertia::render('Admin/Distinciones/Index', [
            'items' => $items,
            'tipos' => config('pandilla.tipos_distincion'),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Distinciones/Create', [
            'tipos' => config('pandilla.tipos_distincion'),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'titulo' => 'required|string|max:255',
            'tipo' => 'required|string',
            'otorgante' => 'required|string|max:255',
            'fecha_otorgamiento' => 'required|date',
            'lugar' => 'nullable|string|max:255',
            'descripcion' => 'required|string',
            'contenido' => 'nullable|string',
            'imagen' => 'required|image|max:5120',
            'galeria' => 'nullable|array',
            'galeria.*' => 'image|max:5120',
            'documento_pdf' => 'nullable|file|mimes:pdf|max:10240',
            'resolucion' => 'nullable|string|max:100',
            'orden' => 'nullable|integer',
            'is_published' => 'boolean',
            'is_featured' => 'boolean',
        ]);

        $validated['imagen'] = $request->file('imagen')
            ->store(config('pandilla.uploads.paths.images'), 'public');

        if ($request->hasFile('galeria')) {
            $galeria = [];
            foreach ($request->file('galeria') as $file) {
                $galeria[] = $file->store(config('pandilla.uploads.paths.images'), 'public');
            }
            $validated['galeria'] = $galeria;
        }

        if ($request->hasFile('documento_pdf')) {
            $validated['documento_pdf'] = $request->file('documento_pdf')
                ->store(config('pandilla.uploads.paths.documents'), 'public');
        }

        Distincion::create($validated);

        return redirect()->route('admin.distinciones.index')
            ->with('success', 'Distinción creada correctamente');
    }

    public function show(Distincion $distincion): Response
    {
        return Inertia::render('Admin/Distinciones/Show', [
            'item' => $distincion,
        ]);
    }

    public function edit(Distincion $distincion): Response
    {
        return Inertia::render('Admin/Distinciones/Edit', [
            'item' => $distincion,
            'tipos' => config('pandilla.tipos_distincion'),
        ]);
    }

    public function update(Request $request, Distincion $distincion)
    {
        $validated = $request->validate([
            'titulo' => 'required|string|max:255',
            'tipo' => 'required|string',
            'otorgante' => 'required|string|max:255',
            'fecha_otorgamiento' => 'required|date',
            'lugar' => 'nullable|string|max:255',
            'descripcion' => 'required|string',
            'contenido' => 'nullable|string',
            'imagen' => 'nullable|image|max:5120',
            'galeria' => 'nullable|array',
            'galeria.*' => 'image|max:5120',
            'documento_pdf' => 'nullable|file|mimes:pdf|max:10240',
            'resolucion' => 'nullable|string|max:100',
            'orden' => 'nullable|integer',
            'is_published' => 'boolean',
            'is_featured' => 'boolean',
        ]);

        if ($request->hasFile('imagen')) {
            if ($distincion->imagen) {
                Storage::disk('public')->delete($distincion->imagen);
            }
            $validated['imagen'] = $request->file('imagen')
                ->store(config('pandilla.uploads.paths.images'), 'public');
        }

        if ($request->hasFile('galeria')) {
            if ($distincion->galeria) {
                foreach ($distincion->galeria as $img) {
                    Storage::disk('public')->delete($img);
                }
            }
            $galeria = [];
            foreach ($request->file('galeria') as $file) {
                $galeria[] = $file->store(config('pandilla.uploads.paths.images'), 'public');
            }
            $validated['galeria'] = $galeria;
        }

        if ($request->hasFile('documento_pdf')) {
            if ($distincion->documento_pdf) {
                Storage::disk('public')->delete($distincion->documento_pdf);
            }
            $validated['documento_pdf'] = $request->file('documento_pdf')
                ->store(config('pandilla.uploads.paths.documents'), 'public');
        }

        $distincion->update($validated);

        return redirect()->route('admin.distinciones.index')
            ->with('success', 'Distinción actualizada correctamente');
    }

    public function destroy(Distincion $distincion)
    {
        $distincion->delete();

        return redirect()->route('admin.distinciones.index')
            ->with('success', 'Distinción eliminada correctamente');
    }

    public function togglePublish(Distincion $distincion)
    {
        $distincion->update(['is_published' => !$distincion->is_published]);

        return back()->with('success',
            $distincion->is_published ? 'Publicado correctamente' : 'Despublicado correctamente'
        );
    }
}
