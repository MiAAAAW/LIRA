<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Comunicado;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ComunicadoController extends Controller
{
    public function index(): Response
    {
        $items = Comunicado::orderByDesc('fecha')
            ->paginate(config('pandilla.pagination.admin', 15));

        return Inertia::render('Admin/Comunicados/Index', [
            'items' => $items,
            'tipos' => config('pandilla.tipos_comunicado'),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Comunicados/Create', [
            'tipos' => config('pandilla.tipos_comunicado'),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'titulo' => 'required|string|max:255',
            'tipo' => 'required|string',
            'numero' => 'nullable|string|max:50',
            'fecha' => 'required|date',
            'extracto' => 'required|string|max:500',
            'contenido' => 'required|string',
            'imagen' => 'nullable|image|max:5120',
            'archivos_adjuntos' => 'nullable|array',
            'archivos_adjuntos.*' => 'file|max:10240',
            'firmante' => 'nullable|string|max:255',
            'cargo_firmante' => 'nullable|string|max:255',
            'fecha_vigencia' => 'nullable|date',
            'orden' => 'nullable|integer',
            'is_published' => 'boolean',
            'is_featured' => 'boolean',
        ]);

        if ($request->hasFile('imagen')) {
            $validated['imagen'] = $request->file('imagen')
                ->store(config('pandilla.uploads.paths.images'), 'public');
        }

        if ($request->hasFile('archivos_adjuntos')) {
            $adjuntos = [];
            foreach ($request->file('archivos_adjuntos') as $file) {
                $adjuntos[] = [
                    'nombre' => $file->getClientOriginalName(),
                    'ruta' => $file->store(config('pandilla.uploads.paths.documents'), 'public'),
                ];
            }
            $validated['archivos_adjuntos'] = $adjuntos;
        }

        Comunicado::create($validated);

        return redirect()->route('admin.comunicados.index')
            ->with('success', 'Comunicado creado correctamente');
    }

    public function show(Comunicado $comunicado): Response
    {
        return Inertia::render('Admin/Comunicados/Show', [
            'item' => $comunicado,
        ]);
    }

    public function edit(Comunicado $comunicado): Response
    {
        return Inertia::render('Admin/Comunicados/Edit', [
            'item' => $comunicado,
            'tipos' => config('pandilla.tipos_comunicado'),
        ]);
    }

    public function update(Request $request, Comunicado $comunicado)
    {
        $validated = $request->validate([
            'titulo' => 'required|string|max:255',
            'tipo' => 'required|string',
            'numero' => 'nullable|string|max:50',
            'fecha' => 'required|date',
            'extracto' => 'required|string|max:500',
            'contenido' => 'required|string',
            'imagen' => 'nullable|image|max:5120',
            'archivos_adjuntos' => 'nullable|array',
            'archivos_adjuntos.*' => 'file|max:10240',
            'firmante' => 'nullable|string|max:255',
            'cargo_firmante' => 'nullable|string|max:255',
            'fecha_vigencia' => 'nullable|date',
            'orden' => 'nullable|integer',
            'is_published' => 'boolean',
            'is_featured' => 'boolean',
        ]);

        if ($request->hasFile('imagen')) {
            if ($comunicado->imagen) {
                Storage::disk('public')->delete($comunicado->imagen);
            }
            $validated['imagen'] = $request->file('imagen')
                ->store(config('pandilla.uploads.paths.images'), 'public');
        }

        if ($request->hasFile('archivos_adjuntos')) {
            if ($comunicado->archivos_adjuntos) {
                foreach ($comunicado->archivos_adjuntos as $adjunto) {
                    Storage::disk('public')->delete($adjunto['ruta']);
                }
            }
            $adjuntos = [];
            foreach ($request->file('archivos_adjuntos') as $file) {
                $adjuntos[] = [
                    'nombre' => $file->getClientOriginalName(),
                    'ruta' => $file->store(config('pandilla.uploads.paths.documents'), 'public'),
                ];
            }
            $validated['archivos_adjuntos'] = $adjuntos;
        }

        $comunicado->update($validated);

        return redirect()->route('admin.comunicados.index')
            ->with('success', 'Comunicado actualizado correctamente');
    }

    public function destroy(Comunicado $comunicado)
    {
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
