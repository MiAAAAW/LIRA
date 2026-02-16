<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Asistencia;
use App\Models\Evento;
use App\Models\Miembro;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class AsistenciaReportController extends Controller
{
    /**
     * Ranking general de asistencia
     */
    public function index(Request $request): Response
    {
        $filtroTipo = $request->get('tipo'); // danzante | directivo | null (todos)

        $totalEventos = Evento::count();

        $miembrosQuery = Miembro::activos()
            ->withCount([
                'asistencias',
                'asistencias as presentes_count' => function ($q) {
                    $q->where('estado', 'presente');
                },
                'asistencias as ausentes_count' => function ($q) {
                    $q->where('estado', 'ausente');
                },
                'asistencias as tardanzas_count' => function ($q) {
                    $q->where('estado', 'tardanza');
                },
                'asistencias as justificados_count' => function ($q) {
                    $q->where('estado', 'justificado');
                },
            ]);

        if ($filtroTipo) {
            $miembrosQuery->where('tipo', $filtroTipo);
        }

        $miembros = $miembrosQuery
            ->orderBy('apellidos')
            ->orderBy('nombres')
            ->get()
            ->map(function ($miembro) use ($totalEventos) {
                $asistenciasEfectivas = $miembro->presentes_count + $miembro->tardanzas_count + $miembro->justificados_count;
                $porcentaje = $totalEventos > 0
                    ? round(($asistenciasEfectivas / $totalEventos) * 100, 1)
                    : 0;

                return [
                    'id' => $miembro->id,
                    'nombres' => $miembro->nombres,
                    'apellidos' => $miembro->apellidos,
                    'nombre_completo' => $miembro->nombre_completo,
                    'tipo' => $miembro->tipo,
                    'cargo' => $miembro->cargo,
                    'total_eventos' => $totalEventos,
                    'presentes' => $miembro->presentes_count,
                    'ausentes' => $miembro->ausentes_count,
                    'tardanzas' => $miembro->tardanzas_count,
                    'justificados' => $miembro->justificados_count,
                    'porcentaje' => $porcentaje,
                    'baja_asistencia' => $porcentaje < 70,
                ];
            });

        return Inertia::render('Admin/Asistencia/Reportes', [
            'miembros' => $miembros,
            'totalEventos' => $totalEventos,
            'filtroTipo' => $filtroTipo,
        ]);
    }

    /**
     * Historial de asistencia por miembro
     */
    public function porMiembro(Miembro $miembro): Response
    {
        $asistencias = Asistencia::where('miembro_id', $miembro->id)
            ->with('evento:id,titulo,tipo,fecha,hora_inicio,hora_fin')
            ->orderByDesc(
                Evento::select('fecha')
                    ->whereColumn('eventos.id', 'asistencias.evento_id')
                    ->limit(1)
            )
            ->paginate(config('pandilla.pagination.admin', 15));

        $totalEventos = Evento::count();
        $stats = [
            'presentes' => $miembro->asistencias()->where('estado', 'presente')->count(),
            'ausentes' => $miembro->asistencias()->where('estado', 'ausente')->count(),
            'tardanzas' => $miembro->asistencias()->where('estado', 'tardanza')->count(),
            'justificados' => $miembro->asistencias()->where('estado', 'justificado')->count(),
        ];
        $efectivas = $stats['presentes'] + $stats['tardanzas'] + $stats['justificados'];
        $stats['porcentaje'] = $totalEventos > 0
            ? round(($efectivas / $totalEventos) * 100, 1)
            : 0;

        return Inertia::render('Admin/Asistencia/PorMiembro', [
            'miembro' => $miembro,
            'asistencias' => $asistencias,
            'stats' => $stats,
            'totalEventos' => $totalEventos,
        ]);
    }
}
