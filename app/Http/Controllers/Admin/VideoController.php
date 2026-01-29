<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Video;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class VideoController extends Controller
{
    public function index(): Response
    {
        $items = Video::orderBy('orden')
            ->orderByDesc('created_at')
            ->paginate(config('pandilla.pagination.admin', 15));

        return Inertia::render('Admin/Videos/Index', [
            'items' => $items,
            'categorias' => config('pandilla.categorias_video'),
            'fuentes' => config('pandilla.fuentes_media'),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Videos/Create', [
            'categorias' => config('pandilla.categorias_video'),
            'fuentes' => config('pandilla.fuentes_media'),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'titulo' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'tipo_fuente' => 'required|string',
            'url_video' => 'required|string|max:500',
            'video_id' => 'nullable|string|max:100',
            'thumbnail' => 'nullable|image|max:5120',
            'duracion' => 'nullable|string|max:20',
            'anio' => 'nullable|integer|min:1900|max:2100',
            'categoria' => 'nullable|string',
            'evento' => 'nullable|string|max:255',
            'ubicacion' => 'nullable|string|max:255',
            'orden' => 'nullable|integer',
            'is_published' => 'boolean',
            'is_featured' => 'boolean',
        ]);

        // Extraer video_id de URL si no se proporciona
        if (empty($validated['video_id'])) {
            $validated['video_id'] = $this->extractVideoId($validated['url_video'], $validated['tipo_fuente']);
        }

        if ($request->hasFile('thumbnail')) {
            $validated['thumbnail'] = $request->file('thumbnail')
                ->store(config('pandilla.uploads.paths.images'), 'public');
        }

        Video::create($validated);

        return redirect()->route('admin.videos.index')
            ->with('success', 'Video creado correctamente');
    }

    public function show(Video $video): Response
    {
        return Inertia::render('Admin/Videos/Show', [
            'item' => $video,
        ]);
    }

    public function edit(Video $video): Response
    {
        return Inertia::render('Admin/Videos/Edit', [
            'item' => $video,
            'categorias' => config('pandilla.categorias_video'),
            'fuentes' => config('pandilla.fuentes_media'),
        ]);
    }

    public function update(Request $request, Video $video)
    {
        $validated = $request->validate([
            'titulo' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'tipo_fuente' => 'required|string',
            'url_video' => 'required|string|max:500',
            'video_id' => 'nullable|string|max:100',
            'thumbnail' => 'nullable|image|max:5120',
            'duracion' => 'nullable|string|max:20',
            'anio' => 'nullable|integer|min:1900|max:2100',
            'categoria' => 'nullable|string',
            'evento' => 'nullable|string|max:255',
            'ubicacion' => 'nullable|string|max:255',
            'orden' => 'nullable|integer',
            'is_published' => 'boolean',
            'is_featured' => 'boolean',
        ]);

        if (empty($validated['video_id'])) {
            $validated['video_id'] = $this->extractVideoId($validated['url_video'], $validated['tipo_fuente']);
        }

        if ($request->hasFile('thumbnail')) {
            if ($video->thumbnail) {
                Storage::disk('public')->delete($video->thumbnail);
            }
            $validated['thumbnail'] = $request->file('thumbnail')
                ->store(config('pandilla.uploads.paths.images'), 'public');
        }

        $video->update($validated);

        return redirect()->route('admin.videos.index')
            ->with('success', 'Video actualizado correctamente');
    }

    public function destroy(Video $video)
    {
        $video->delete();

        return redirect()->route('admin.videos.index')
            ->with('success', 'Video eliminado correctamente');
    }

    public function togglePublish(Video $video)
    {
        $video->update(['is_published' => !$video->is_published]);

        return back()->with('success',
            $video->is_published ? 'Publicado correctamente' : 'Despublicado correctamente'
        );
    }

    private function extractVideoId(string $url, string $source): ?string
    {
        return match($source) {
            'youtube' => $this->extractYoutubeId($url),
            'vimeo' => $this->extractVimeoId($url),
            default => null,
        };
    }

    private function extractYoutubeId(string $url): ?string
    {
        preg_match('/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/', $url, $matches);
        return $matches[1] ?? null;
    }

    private function extractVimeoId(string $url): ?string
    {
        preg_match('/vimeo\.com\/(\d+)/', $url, $matches);
        return $matches[1] ?? null;
    }
}
