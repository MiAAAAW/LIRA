<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Ley24325;
use App\Models\BaseLegal;
use App\Models\RegistroIndecopi;
use App\Models\Estandarte;
use App\Models\Presidente;
use App\Models\Video;
use App\Models\Audio;
use App\Models\Distincion;
use App\Models\Publicacion;
use App\Models\Comunicado;
use App\Models\Miembro;
use App\Models\Evento;
use App\Models\Sancion;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $stats = $this->getStats();
        $recentActivity = $this->getRecentActivity();

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'recentActivity' => $recentActivity,
        ]);
    }

    private function getStats(): array
    {
        return [
            'legal' => [
                [
                    'id' => 'ley24325',
                    'label' => 'Ley 24325',
                    'count' => Ley24325::count(),
                    'published' => Ley24325::published()->count(),
                    'icon' => 'Scale',
                    'color' => 'emerald',
                    'route' => '/admin/ley24325',
                ],
                [
                    'id' => 'baseLegal',
                    'label' => 'Base Legal',
                    'count' => BaseLegal::count(),
                    'published' => BaseLegal::published()->count(),
                    'icon' => 'FileText',
                    'color' => 'blue',
                    'route' => '/admin/base-legal',
                ],
                [
                    'id' => 'indecopi',
                    'label' => 'INDECOPI',
                    'count' => RegistroIndecopi::count(),
                    'published' => RegistroIndecopi::published()->count(),
                    'icon' => 'Shield',
                    'color' => 'cyan',
                    'route' => '/admin/indecopi',
                ],
                [
                    'id' => 'estandartes',
                    'label' => 'Estandartes',
                    'count' => Estandarte::count(),
                    'published' => Estandarte::published()->count(),
                    'icon' => 'Flag',
                    'color' => 'amber',
                    'route' => '/admin/estandartes',
                ],
                [
                    'id' => 'presidentes',
                    'label' => 'Presidentes',
                    'count' => Presidente::count(),
                    'published' => Presidente::published()->count(),
                    'icon' => 'Users',
                    'color' => 'violet',
                    'route' => '/admin/presidentes',
                ],
            ],
            'multimedia' => [
                [
                    'id' => 'videos',
                    'label' => 'Videos',
                    'count' => Video::count(),
                    'published' => Video::published()->count(),
                    'icon' => 'Video',
                    'color' => 'red',
                    'route' => '/admin/videos',
                ],
                [
                    'id' => 'audios',
                    'label' => 'Audios',
                    'count' => Audio::count(),
                    'published' => Audio::published()->count(),
                    'icon' => 'Music',
                    'color' => 'orange',
                    'route' => '/admin/audios',
                ],
                [
                    'id' => 'distinciones',
                    'label' => 'Distinciones',
                    'count' => Distincion::count(),
                    'published' => Distincion::published()->count(),
                    'icon' => 'Award',
                    'color' => 'yellow',
                    'route' => '/admin/distinciones',
                ],
                [
                    'id' => 'publicaciones',
                    'label' => 'Publicaciones',
                    'count' => Publicacion::count(),
                    'published' => Publicacion::published()->count(),
                    'icon' => 'Newspaper',
                    'color' => 'indigo',
                    'route' => '/admin/publicaciones',
                ],
                [
                    'id' => 'comunicados',
                    'label' => 'Comunicados',
                    'count' => Comunicado::count(),
                    'published' => Comunicado::published()->count(),
                    'icon' => 'Megaphone',
                    'color' => 'pink',
                    'route' => '/admin/comunicados',
                ],
            ],
            'miembros' => [
                [
                    'id' => 'miembros',
                    'label' => 'Miembros',
                    'count' => Miembro::count(),
                    'published' => Miembro::activos()->count(),
                    'icon' => 'UserPlus',
                    'color' => 'teal',
                    'route' => '/admin/miembros',
                ],
                [
                    'id' => 'eventos',
                    'label' => 'Eventos',
                    'count' => Evento::count(),
                    'published' => Evento::count(),
                    'icon' => 'Calendar',
                    'color' => 'sky',
                    'route' => '/admin/eventos',
                ],
                [
                    'id' => 'sanciones',
                    'label' => 'Sanciones',
                    'count' => Sancion::count(),
                    'published' => Sancion::where('estado', 'pendiente')->count(),
                    'icon' => 'AlertTriangle',
                    'color' => 'rose',
                    'route' => '/admin/sanciones',
                ],
            ],
            'totals' => [
                'total' => $this->getTotalRecords(),
                'published' => $this->getTotalPublished(),
            ],
        ];
    }

    private function getTotalRecords(): int
    {
        return Ley24325::count()
            + BaseLegal::count()
            + RegistroIndecopi::count()
            + Estandarte::count()
            + Presidente::count()
            + Video::count()
            + Audio::count()
            + Distincion::count()
            + Publicacion::count()
            + Comunicado::count()
            + Miembro::count()
            + Evento::count()
            + Sancion::count();
    }

    private function getTotalPublished(): int
    {
        return Ley24325::published()->count()
            + BaseLegal::published()->count()
            + RegistroIndecopi::published()->count()
            + Estandarte::published()->count()
            + Presidente::published()->count()
            + Video::published()->count()
            + Audio::published()->count()
            + Distincion::published()->count()
            + Publicacion::published()->count()
            + Comunicado::published()->count();
    }

    private function getRecentActivity(): array
    {
        $activities = collect();

        // Últimos registros de cada modelo
        $models = [
            ['model' => Ley24325::class, 'type' => 'Ley 24325', 'icon' => 'Scale'],
            ['model' => BaseLegal::class, 'type' => 'Base Legal', 'icon' => 'FileText'],
            ['model' => RegistroIndecopi::class, 'type' => 'INDECOPI', 'icon' => 'Shield'],
            ['model' => Estandarte::class, 'type' => 'Estandarte', 'icon' => 'Flag'],
            ['model' => Presidente::class, 'type' => 'Presidente', 'icon' => 'Users'],
            ['model' => Video::class, 'type' => 'Video', 'icon' => 'Video'],
            ['model' => Audio::class, 'type' => 'Audio', 'icon' => 'Music'],
            ['model' => Distincion::class, 'type' => 'Distinción', 'icon' => 'Award'],
            ['model' => Publicacion::class, 'type' => 'Publicación', 'icon' => 'Newspaper'],
            ['model' => Comunicado::class, 'type' => 'Comunicado', 'icon' => 'Megaphone'],
            ['model' => Miembro::class, 'type' => 'Miembro', 'icon' => 'UserPlus'],
            ['model' => Evento::class, 'type' => 'Evento', 'icon' => 'Calendar'],
            ['model' => Sancion::class, 'type' => 'Sanción', 'icon' => 'AlertTriangle'],
        ];

        foreach ($models as $modelInfo) {
            $latest = $modelInfo['model']::latest()->first();
            if ($latest) {
                $activities->push([
                    'id' => $latest->id,
                    'type' => $modelInfo['type'],
                    'icon' => $modelInfo['icon'],
                    'title' => $latest->titulo ?? $latest->nombres ?? 'Sin título',
                    'action' => 'creado',
                    'date' => $latest->created_at,
                    'is_published' => $latest->is_published ?? false,
                ]);
            }
        }

        return $activities
            ->sortByDesc('date')
            ->take(10)
            ->values()
            ->toArray();
    }
}
