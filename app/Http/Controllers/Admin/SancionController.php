<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Miembro;
use App\Models\Sancion;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SancionController extends Controller
{
    public function index(): Response
    {
        $items = Sancion::with('miembro:id,nombres,apellidos')
            ->orderByDesc('fecha')
            ->paginate(config('pandilla.pagination.admin', 15));

        $miembros = Miembro::activos()
            ->orderBy('apellidos')
            ->get(['id', 'nombres', 'apellidos']);

        return Inertia::render('Admin/Sanciones/Index', [
            'items' => $items,
            'miembros' => $miembros,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'miembro_id' => 'required|exists:miembros,id',
            'evento_id' => 'nullable|exists:eventos,id',
            'tipo' => 'required|in:multa,amonestacion,suspension',
            'monto' => 'nullable|numeric|min:0',
            'motivo' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'estado' => 'required|in:pendiente,pagado,condonado',
            'fecha' => 'required|date',
            'orden' => 'nullable|integer',
            'is_published' => 'boolean',
            'is_featured' => 'boolean',
        ]);

        Sancion::create($validated);

        return redirect()->route('admin.sanciones.index')
            ->with('success', 'Sanción creada correctamente');
    }

    public function update(Request $request, Sancion $sancion)
    {
        $validated = $request->validate([
            'miembro_id' => 'required|exists:miembros,id',
            'evento_id' => 'nullable|exists:eventos,id',
            'tipo' => 'required|in:multa,amonestacion,suspension',
            'monto' => 'nullable|numeric|min:0',
            'motivo' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'estado' => 'required|in:pendiente,pagado,condonado',
            'fecha' => 'required|date',
            'orden' => 'nullable|integer',
            'is_published' => 'boolean',
            'is_featured' => 'boolean',
        ]);

        $sancion->update($validated);

        return redirect()->route('admin.sanciones.index')
            ->with('success', 'Sanción actualizada correctamente');
    }

    public function destroy(Sancion $sancion)
    {
        $sancion->delete();

        return redirect()->route('admin.sanciones.index')
            ->with('success', 'Sanción eliminada correctamente');
    }

    public function togglePublish(Sancion $sancion)
    {
        $sancion->update(['is_published' => !$sancion->is_published]);

        return back()->with('success',
            $sancion->is_published ? 'Publicado correctamente' : 'Despublicado correctamente'
        );
    }
}
