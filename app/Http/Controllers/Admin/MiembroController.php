<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Miembro;
use App\Services\ImageProcessingService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MiembroController extends Controller
{
    public function __construct(
        protected ImageProcessingService $imageService
    ) {}

    public function index(): Response
    {
        $items = Miembro::orderBy('apellidos')
            ->orderBy('nombres')
            ->paginate(config('pandilla.pagination.admin', 15));

        return Inertia::render('Admin/Miembros/Index', [
            'items' => $items,
            'tipos' => Miembro::TIPOS,
            'cargos' => Miembro::CARGOS,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombres' => 'required|string|max:255',
            'apellidos' => 'required|string|max:255',
            'dni' => 'nullable|string|max:20|unique:miembros,dni',
            'telefono' => 'nullable|string|max:50',
            'email' => 'nullable|email|max:255',
            'tipo' => 'required|in:danzante,directivo',
            'cargo' => 'nullable|string|max:255',
            'anio_ingreso' => 'nullable|integer|min:1900|max:2100',
            'is_active' => 'boolean',
            'foto' => 'nullable|image|max:5120',
            'notas' => 'nullable|string',
            'anios_activo' => 'nullable|array',
            'orden' => 'nullable|integer',
            'is_published' => 'boolean',
            'is_featured' => 'boolean',
        ]);

        // Danzante no tiene cargo
        if (($validated['tipo'] ?? 'danzante') === 'danzante') {
            $validated['cargo'] = null;
        }

        if ($request->hasFile('foto')) {
            $paths = $this->imageService->process(
                $request->file('foto'),
                'miembros'
            );
            $validated['foto'] = $paths['original'];
        }

        Miembro::create($validated);

        return redirect()->route('admin.miembros.index')
            ->with('success', 'Miembro creado correctamente');
    }

    public function update(Request $request, Miembro $miembro)
    {
        $validated = $request->validate([
            'nombres' => 'required|string|max:255',
            'apellidos' => 'required|string|max:255',
            'dni' => 'nullable|string|max:20|unique:miembros,dni,' . $miembro->id,
            'telefono' => 'nullable|string|max:50',
            'email' => 'nullable|email|max:255',
            'tipo' => 'required|in:danzante,directivo',
            'cargo' => 'nullable|string|max:255',
            'anio_ingreso' => 'nullable|integer|min:1900|max:2100',
            'is_active' => 'boolean',
            'foto' => 'nullable|image|max:5120',
            'notas' => 'nullable|string',
            'anios_activo' => 'nullable|array',
            'orden' => 'nullable|integer',
            'is_published' => 'boolean',
            'is_featured' => 'boolean',
        ]);

        // Danzante no tiene cargo
        if (($validated['tipo'] ?? 'danzante') === 'danzante') {
            $validated['cargo'] = null;
        }

        if ($request->hasFile('foto')) {
            $paths = $this->imageService->process(
                $request->file('foto'),
                'miembros',
                $miembro->foto
            );
            $validated['foto'] = $paths['original'];
        }

        $miembro->update($validated);

        return redirect()->route('admin.miembros.index')
            ->with('success', 'Miembro actualizado correctamente');
    }

    public function destroy(Miembro $miembro)
    {
        if ($miembro->foto) {
            $this->imageService->delete($miembro->foto, 'miembros');
        }

        $miembro->delete();

        return redirect()->route('admin.miembros.index')
            ->with('success', 'Miembro eliminado correctamente');
    }

    public function togglePublish(Miembro $miembro)
    {
        $miembro->update(['is_published' => !$miembro->is_published]);

        return back()->with('success',
            $miembro->is_published ? 'Publicado correctamente' : 'Despublicado correctamente'
        );
    }
}
