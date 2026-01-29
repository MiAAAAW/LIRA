<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Presidente;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class PresidenteController extends Controller
{
    public function index(): Response
    {
        $items = Presidente::orderByDesc('es_actual')
            ->orderByDesc('periodo_inicio')
            ->paginate(config('pandilla.pagination.admin', 15));

        return Inertia::render('Admin/Presidentes/Index', [
            'items' => $items,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Presidentes/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombres' => 'required|string|max:255',
            'apellidos' => 'required|string|max:255',
            'foto' => 'nullable|image|max:5120',
            'periodo_inicio' => 'required|integer|min:1900|max:2100',
            'periodo_fin' => 'nullable|integer|min:1900|max:2100',
            'es_actual' => 'boolean',
            'profesion' => 'nullable|string|max:255',
            'biografia' => 'nullable|string',
            'logros' => 'nullable|string',
            'email' => 'nullable|email|max:255',
            'telefono' => 'nullable|string|max:50',
            'redes_sociales' => 'nullable|array',
            'orden' => 'nullable|integer',
            'is_published' => 'boolean',
            'is_featured' => 'boolean',
        ]);

        if ($request->hasFile('foto')) {
            $validated['foto'] = $request->file('foto')
                ->store(config('pandilla.uploads.paths.images'), 'public');
        }

        // Si es actual, desmarcar otros
        if ($validated['es_actual'] ?? false) {
            Presidente::where('es_actual', true)->update(['es_actual' => false]);
        }

        Presidente::create($validated);

        return redirect()->route('admin.presidentes.index')
            ->with('success', 'Presidente creado correctamente');
    }

    public function show(Presidente $presidente): Response
    {
        return Inertia::render('Admin/Presidentes/Show', [
            'item' => $presidente,
        ]);
    }

    public function edit(Presidente $presidente): Response
    {
        return Inertia::render('Admin/Presidentes/Edit', [
            'item' => $presidente,
        ]);
    }

    public function update(Request $request, Presidente $presidente)
    {
        $validated = $request->validate([
            'nombres' => 'required|string|max:255',
            'apellidos' => 'required|string|max:255',
            'foto' => 'nullable|image|max:5120',
            'periodo_inicio' => 'required|integer|min:1900|max:2100',
            'periodo_fin' => 'nullable|integer|min:1900|max:2100',
            'es_actual' => 'boolean',
            'profesion' => 'nullable|string|max:255',
            'biografia' => 'nullable|string',
            'logros' => 'nullable|string',
            'email' => 'nullable|email|max:255',
            'telefono' => 'nullable|string|max:50',
            'redes_sociales' => 'nullable|array',
            'orden' => 'nullable|integer',
            'is_published' => 'boolean',
            'is_featured' => 'boolean',
        ]);

        if ($request->hasFile('foto')) {
            if ($presidente->foto) {
                Storage::disk('public')->delete($presidente->foto);
            }
            $validated['foto'] = $request->file('foto')
                ->store(config('pandilla.uploads.paths.images'), 'public');
        }

        // Si es actual, desmarcar otros
        if (($validated['es_actual'] ?? false) && !$presidente->es_actual) {
            Presidente::where('es_actual', true)->update(['es_actual' => false]);
        }

        $presidente->update($validated);

        return redirect()->route('admin.presidentes.index')
            ->with('success', 'Presidente actualizado correctamente');
    }

    public function destroy(Presidente $presidente)
    {
        $presidente->delete();

        return redirect()->route('admin.presidentes.index')
            ->with('success', 'Presidente eliminado correctamente');
    }

    public function togglePublish(Presidente $presidente)
    {
        $presidente->update(['is_published' => !$presidente->is_published]);

        return back()->with('success',
            $presidente->is_published ? 'Publicado correctamente' : 'Despublicado correctamente'
        );
    }
}
