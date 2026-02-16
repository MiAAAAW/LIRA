<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Evento;
use App\Models\Miembro;
use App\Models\Asistencia;
use App\Models\AsistenciaLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class EventoController extends Controller
{
    public function index(): Response
    {
        $items = Evento::orderByDesc('fecha')
            ->paginate(config('pandilla.pagination.admin', 15));

        return Inertia::render('Admin/Eventos/Index', [
            'items' => $items,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'titulo' => 'required|string|max:255',
            'tipo' => 'required|in:ensayo,reunion,presentacion,otro',
            'fecha' => 'required|date',
            'hora_inicio' => 'nullable|date_format:H:i',
            'hora_fin' => 'nullable|date_format:H:i',
            'ubicacion' => 'nullable|string|max:255',
            'descripcion' => 'nullable|string',
            'orden' => 'nullable|integer',
            'is_published' => 'boolean',
            'is_featured' => 'boolean',
        ]);

        Evento::create($validated);

        return redirect()->route('admin.eventos.index')
            ->with('success', 'Evento creado correctamente');
    }

    public function update(Request $request, Evento $evento)
    {
        $validated = $request->validate([
            'titulo' => 'required|string|max:255',
            'tipo' => 'required|in:ensayo,reunion,presentacion,otro',
            'fecha' => 'required|date',
            'hora_inicio' => 'nullable|date_format:H:i',
            'hora_fin' => 'nullable|date_format:H:i',
            'ubicacion' => 'nullable|string|max:255',
            'descripcion' => 'nullable|string',
            'orden' => 'nullable|integer',
            'is_published' => 'boolean',
            'is_featured' => 'boolean',
        ]);

        $evento->update($validated);

        return redirect()->route('admin.eventos.index')
            ->with('success', 'Evento actualizado correctamente');
    }

    public function destroy(Evento $evento)
    {
        $evento->delete();

        return redirect()->route('admin.eventos.index')
            ->with('success', 'Evento eliminado correctamente');
    }

    public function togglePublish(Evento $evento)
    {
        $evento->update(['is_published' => !$evento->is_published]);

        return back()->with('success',
            $evento->is_published ? 'Publicado correctamente' : 'Despublicado correctamente'
        );
    }

    /**
     * Pantalla de asistencia para un evento
     */
    public function asistencia(Evento $evento): Response|\Illuminate\Http\JsonResponse
    {
        $miembros = Miembro::activos()
            ->orderBy('apellidos')
            ->orderBy('nombres')
            ->get(['id', 'nombres', 'apellidos', 'tipo', 'cargo', 'foto']);

        $asistencias = $evento->asistencias()
            ->with('logs.user')
            ->get()
            ->keyBy('miembro_id');

        $data = [
            'evento' => $evento,
            'miembros' => $miembros,
            'asistencias' => $asistencias,
        ];

        if (request()->wantsJson()) {
            return response()->json($data);
        }

        return Inertia::render('Admin/Eventos/Asistencia', $data);
    }

    /**
     * Marcar asistencia individual (atómico)
     */
    public function marcarAsistencia(Request $request, Evento $evento)
    {
        $validated = $request->validate([
            'miembro_id' => 'required|exists:miembros,id',
            'estado' => 'required|in:presente,ausente,tardanza,justificado',
            'observacion' => 'nullable|string|max:500',
        ]);

        return DB::transaction(function () use ($validated, $evento) {
            $asistencia = Asistencia::where('evento_id', $evento->id)
                ->where('miembro_id', $validated['miembro_id'])
                ->first();

            $estadoAnterior = $asistencia?->estado;

            $asistencia = Asistencia::updateOrCreate(
                [
                    'evento_id' => $evento->id,
                    'miembro_id' => $validated['miembro_id'],
                ],
                [
                    'estado' => $validated['estado'],
                    'observacion' => $validated['observacion'] ?? null,
                ]
            );

            // Crear log
            AsistenciaLog::create([
                'asistencia_id' => $asistencia->id,
                'evento_id' => $evento->id,
                'miembro_id' => $validated['miembro_id'],
                'estado_anterior' => $estadoAnterior,
                'estado_nuevo' => $validated['estado'],
                'cambiado_por' => Auth::id(),
            ]);

            return response()->json([
                'success' => true,
                'asistencia' => $asistencia,
            ]);
        });
    }

    /**
     * Quick-add: crear miembro y agregarlo a la lista
     */
    public function quickAddMiembro(Request $request, Evento $evento)
    {
        $validated = $request->validate([
            'nombres' => 'required|string|max:255',
            'apellidos' => 'required|string|max:255',
            'tipo' => 'nullable|in:danzante,directivo',
        ]);

        $miembro = Miembro::create([
            'nombres' => $validated['nombres'],
            'apellidos' => $validated['apellidos'],
            'tipo' => $validated['tipo'] ?? 'danzante',
            'is_active' => true,
        ]);

        return response()->json([
            'success' => true,
            'miembro' => $miembro,
        ]);
    }

    /**
     * Cerrar lista de asistencia
     */
    public function cerrarLista(Evento $evento)
    {
        $evento->update(['estado_lista' => 'cerrada']);

        return response()->json(['success' => true, 'estado_lista' => 'cerrada']);
    }

    /**
     * Reabrir lista de asistencia
     */
    public function reabrirLista(Evento $evento)
    {
        $evento->update(['estado_lista' => 'abierta']);

        return response()->json(['success' => true, 'estado_lista' => 'abierta']);
    }
}
