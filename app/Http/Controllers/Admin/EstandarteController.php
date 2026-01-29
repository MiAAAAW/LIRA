<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Estandarte;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class EstandarteController extends Controller
{
    public function index(): Response
    {
        $items = Estandarte::orderBy('orden')
            ->orderByDesc('created_at')
            ->paginate(config('pandilla.pagination.admin', 15));

        return Inertia::render('Admin/Estandartes/Index', [
            'items' => $items,
            'tipos' => config('pandilla.tipos_estandarte'),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Estandartes/Create', [
            'tipos' => config('pandilla.tipos_estandarte'),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'titulo' => 'required|string|max:255',
            'tipo' => 'required|string',
            'anio' => 'nullable|integer|min:1900|max:2100',
            'autor' => 'nullable|string|max:255',
            'donante' => 'nullable|string|max:255',
            'descripcion' => 'required|string',
            'historia' => 'nullable|string',
            'imagen_principal' => 'required|image|max:5120',
            'galeria' => 'nullable|array',
            'galeria.*' => 'image|max:5120',
            'dimensiones' => 'nullable|string|max:100',
            'materiales' => 'nullable|string|max:255',
            'ubicacion_actual' => 'nullable|string|max:255',
            'orden' => 'nullable|integer',
            'is_published' => 'boolean',
            'is_featured' => 'boolean',
        ]);

        $validated['imagen_principal'] = $request->file('imagen_principal')
            ->store(config('pandilla.uploads.paths.images'), 'public');

        if ($request->hasFile('galeria')) {
            $galeria = [];
            foreach ($request->file('galeria') as $file) {
                $galeria[] = $file->store(config('pandilla.uploads.paths.images'), 'public');
            }
            $validated['galeria'] = $galeria;
        }

        Estandarte::create($validated);

        return redirect()->route('admin.estandartes.index')
            ->with('success', 'Estandarte creado correctamente');
    }

    public function show(Estandarte $estandarte): Response
    {
        return Inertia::render('Admin/Estandartes/Show', [
            'item' => $estandarte,
        ]);
    }

    public function edit(Estandarte $estandarte): Response
    {
        return Inertia::render('Admin/Estandartes/Edit', [
            'item' => $estandarte,
            'tipos' => config('pandilla.tipos_estandarte'),
        ]);
    }

    public function update(Request $request, Estandarte $estandarte)
    {
        $validated = $request->validate([
            'titulo' => 'required|string|max:255',
            'tipo' => 'required|string',
            'anio' => 'nullable|integer|min:1900|max:2100',
            'autor' => 'nullable|string|max:255',
            'donante' => 'nullable|string|max:255',
            'descripcion' => 'required|string',
            'historia' => 'nullable|string',
            'imagen_principal' => 'nullable|image|max:5120',
            'galeria' => 'nullable|array',
            'galeria.*' => 'image|max:5120',
            'dimensiones' => 'nullable|string|max:100',
            'materiales' => 'nullable|string|max:255',
            'ubicacion_actual' => 'nullable|string|max:255',
            'orden' => 'nullable|integer',
            'is_published' => 'boolean',
            'is_featured' => 'boolean',
        ]);

        if ($request->hasFile('imagen_principal')) {
            if ($estandarte->imagen_principal) {
                Storage::disk('public')->delete($estandarte->imagen_principal);
            }
            $validated['imagen_principal'] = $request->file('imagen_principal')
                ->store(config('pandilla.uploads.paths.images'), 'public');
        }

        if ($request->hasFile('galeria')) {
            if ($estandarte->galeria) {
                foreach ($estandarte->galeria as $img) {
                    Storage::disk('public')->delete($img);
                }
            }
            $galeria = [];
            foreach ($request->file('galeria') as $file) {
                $galeria[] = $file->store(config('pandilla.uploads.paths.images'), 'public');
            }
            $validated['galeria'] = $galeria;
        }

        $estandarte->update($validated);

        return redirect()->route('admin.estandartes.index')
            ->with('success', 'Estandarte actualizado correctamente');
    }

    public function destroy(Estandarte $estandarte)
    {
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
