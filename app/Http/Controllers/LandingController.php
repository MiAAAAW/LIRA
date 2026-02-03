<?php

namespace App\Http\Controllers;

use App\Models\Audio;
use App\Models\BaseLegal;
use App\Models\Comunicado;
use App\Models\Distincion;
use App\Models\Estandarte;
use App\Models\Ley24325;
use App\Models\Presidente;
use App\Models\Publicacion;
use App\Models\RegistroIndecopi;
use App\Models\Video;
use Inertia\Inertia;
use Inertia\Response;

class LandingController extends Controller
{
    /**
     * Display the landing page with dynamic data from database.
     */
    public function index(): Response
    {
        // URL base del CDN (Cloudflare R2)
        $cdnUrl = rtrim(config('filesystems.disks.r2.url', ''), '/');

        return Inertia::render('Landing', [
            // CDN URL para assets estáticos del landing
            'cdnUrl' => $cdnUrl,
            // ==========================================
            // MARCO LEGAL
            // ==========================================
            'ley24325' => Ley24325::published()->orderBy('orden')->get(),
            'baseLegal' => BaseLegal::published()->orderBy('orden')->get(),
            'indecopi' => RegistroIndecopi::published()->orderBy('orden')->get(),

            // ==========================================
            // HISTORIA
            // ==========================================
            'estandartes' => Estandarte::published()->orderBy('orden')->get(),
            'presidentes' => $this->getTeam(),

            // ==========================================
            // MULTIMEDIA
            // ==========================================
            'videos' => Video::published()->orderBy('orden')->get(),
            'audios' => Audio::published()->orderBy('orden')->get(),

            // ==========================================
            // COMUNICACIONES
            // ==========================================
            'publicaciones' => Publicacion::published()->orderBy('orden')->get(),
            'comunicados' => Comunicado::published()->latest('fecha')->get(),
            'distinciones' => Distincion::published()->orderBy('orden')->get(),
        ]);
    }

    /**
     * Get stats count for each module.
     */
    private function getStats(): array
    {
        return [
            'ley24325' => Ley24325::published()->count(),
            'baseLegal' => BaseLegal::published()->count(),
            'indecopi' => RegistroIndecopi::published()->count(),
            'estandartes' => Estandarte::published()->count(),
            'presidentes' => Presidente::published()->count(),
            'videos' => Video::published()->count(),
            'audios' => Audio::published()->count(),
            'distinciones' => Distincion::published()->count(),
            'publicaciones' => Publicacion::published()->count(),
            'comunicados' => Comunicado::published()->count(),
        ];
    }

    /**
     * Get featured news from Comunicados and Publicaciones.
     */
    private function getFeaturedNews(): array
    {
        $comunicados = Comunicado::published()
            ->latest('fecha')
            ->limit(2)
            ->get()
            ->map(fn($c) => [
                'id' => (string) $c->id,
                'title' => $c->titulo,
                'excerpt' => $c->extracto ?? mb_substr(strip_tags($c->contenido ?? ''), 0, 150) . '...',
                'date' => $c->fecha?->format('Y-m-d'),
                'category' => $c->tipo ? (Comunicado::TIPOS[$c->tipo] ?? $c->tipo) : 'Comunicado',
                'image' => $c->imagen,
                'href' => '#historia',
                'author' => $c->firmante ?? 'Lira Puno',
                'featured' => (bool) $c->is_featured,
            ]);

        $publicaciones = Publicacion::published()
            ->latest('anio_publicacion')
            ->limit(2)
            ->get()
            ->map(fn($p) => [
                'id' => 'pub-' . $p->id,
                'title' => $p->titulo,
                'excerpt' => $p->descripcion ?? $p->resumen ?? '',
                'date' => $p->anio_publicacion ? $p->anio_publicacion . '-01-01' : null,
                'category' => $p->tipo ? (Publicacion::TIPOS[$p->tipo] ?? $p->tipo) : 'Publicación',
                'image' => $p->imagen_portada,
                'href' => '#historia',
                'author' => $p->autor ?? 'Archivo Lira Puno',
                'featured' => (bool) $p->is_featured,
            ]);

        return $comunicados->merge($publicaciones)
            ->sortByDesc('date')
            ->take(4)
            ->values()
            ->toArray();
    }

    /**
     * Get team members (Presidentes) - Timeline histórico completo.
     * Sin límite - muestra todos los publicados para el timeline.
     */
    private function getTeam(): array
    {
        return Presidente::published()
            ->orderByDesc('es_actual')
            ->orderBy('orden')
            ->orderByDesc('periodo_inicio')
            ->get()
            ->map(fn($p) => [
                'id' => (string) $p->id,
                'name' => $p->nombre_completo,
                'role' => $p->es_actual ? 'Presidente Actual' : 'Ex Presidente',
                'avatar' => $p->foto ? asset('storage/' . $p->foto) : null,
                'bio' => $p->biografia,
                'period' => $p->periodo,
                'yearStart' => (int) $p->periodo_inicio,
                'yearEnd' => $p->periodo_fin ? (int) $p->periodo_fin : null,
                'isCurrent' => (bool) $p->es_actual,
                'social' => [
                    'email' => $p->email,
                ],
            ])
            ->toArray();
    }

    /**
     * Get sections data for additional landing sections.
     */
    private function getSections(): array
    {
        return [
            'videos' => Video::published()
                ->featured()
                ->orderBy('orden')
                ->limit(4)
                ->get()
                ->map(fn($v) => [
                    'id' => $v->id,
                    'title' => $v->titulo,
                    'description' => $v->descripcion,
                    'thumbnail' => $v->thumbnail,
                    'embedUrl' => $v->embed_url,
                    'duration' => $v->duracion,
                    'year' => $v->anio,
                ])
                ->toArray(),

            'audios' => Audio::published()
                ->featured()
                ->orderBy('orden')
                ->limit(6)
                ->get()
                ->toArray(),

            'distinciones' => Distincion::published()
                ->orderBy('orden')
                ->limit(6)
                ->get()
                ->toArray(),

            'estandartes' => Estandarte::published()
                ->orderBy('orden')
                ->limit(4)
                ->get()
                ->toArray(),
        ];
    }
}
