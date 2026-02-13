<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use App\Models\Video;
use App\Services\CloudflareMediaService;
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
            'sectionVisible' => SiteSetting::isSectionVisible('videos'),
        ]);
    }

    public function store(Request $request, CloudflareMediaService $cloudflareService)
    {
        $validated = $request->validate([
            'titulo' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'tipo_fuente' => 'nullable|string',
            'url_video' => 'nullable|string|max:500',
            'video_id' => 'nullable|string|max:100',
            // Direct upload (ya subido a R2 desde el cliente)
            'r2_key' => 'nullable|string|max:500',
            'r2_url' => 'nullable|string|max:500',
            // Legacy file upload (fallback)
            'video_file' => 'nullable|file|mimes:mp4,webm,mov|max:512000',
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

        // Opción 1: Direct Upload (archivo ya está en R2)
        if (!empty($validated['r2_key'])) {
            $validated['tipo_fuente'] = 'cloudflare';
            $validated['r2_video_url'] = $validated['r2_url'];
            $validated['url_video'] = $validated['r2_url'];
            unset($validated['r2_url']); // No es campo del modelo
        }
        // Opción 2: Legacy file upload (pasa por servidor)
        elseif ($request->hasFile('video_file')) {
            if (!$cloudflareService->isConfigured()) {
                return back()
                    ->withInput()
                    ->withErrors(['video_file' => 'Cloudflare R2 no está configurado.']);
            }

            try {
                $result = $cloudflareService->uploadVideo($request->file('video_file'));
                $validated['tipo_fuente'] = 'cloudflare';
                $validated['r2_key'] = $result['key'];
                $validated['r2_video_url'] = $result['url'];
                $validated['url_video'] = $result['url'];
            } catch (\Exception $e) {
                return back()
                    ->withInput()
                    ->withErrors(['video_file' => 'Error al subir video: ' . $e->getMessage()]);
            }
        }

        // Validar que tenga video
        if (empty($validated['url_video']) && empty($validated['r2_key'])) {
            return back()
                ->withInput()
                ->withErrors(['video_file' => 'Debes subir un archivo de video.']);
        }

        // Extraer video_id de URL si no se proporciona
        if (empty($validated['video_id'])) {
            $validated['video_id'] = $this->extractVideoId($validated['url_video'], $validated['tipo_fuente']);
        }

        // Handle manual thumbnail upload
        if ($request->hasFile('thumbnail')) {
            $validated['thumbnail'] = $request->file('thumbnail')
                ->store(config('pandilla.uploads.paths.images'), 'public');
        }

        // Remove temporary fields
        unset($validated['video_file'], $validated['r2_url']);

        Video::create($validated);

        return redirect()->route('admin.videos.index')
            ->with('success', 'Video creado correctamente');
    }

    public function update(Request $request, Video $video, CloudflareMediaService $cloudflareService)
    {
        $validated = $request->validate([
            'titulo' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'tipo_fuente' => 'nullable|string',
            'url_video' => 'nullable|string|max:500',
            'video_id' => 'nullable|string|max:100',
            // Direct upload (ya subido a R2 desde el cliente)
            'r2_key' => 'nullable|string|max:500',
            'r2_url' => 'nullable|string|max:500',
            // Legacy file upload
            'video_file' => 'nullable|file|mimes:mp4,webm,mov|max:512000',
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

        // Opción 1: Direct Upload (archivo nuevo ya está en R2)
        if (!empty($validated['r2_key']) && $validated['r2_key'] !== $video->r2_key) {
            // Eliminar video anterior de R2
            if ($video->r2_key && $cloudflareService->isConfigured()) {
                $cloudflareService->deleteVideo($video->r2_key);
            }
            $validated['tipo_fuente'] = 'cloudflare';
            $validated['r2_video_url'] = $validated['r2_url'];
            $validated['url_video'] = $validated['r2_url'];
            unset($validated['r2_url']);
        }
        // Opción 2: Legacy file upload
        elseif ($request->hasFile('video_file')) {
            if (!$cloudflareService->isConfigured()) {
                return back()
                    ->withInput()
                    ->withErrors(['video_file' => 'Cloudflare R2 no está configurado.']);
            }

            try {
                if ($video->r2_key) {
                    $cloudflareService->deleteVideo($video->r2_key);
                }

                $result = $cloudflareService->uploadVideo($request->file('video_file'));
                $validated['tipo_fuente'] = 'cloudflare';
                $validated['r2_key'] = $result['key'];
                $validated['r2_video_url'] = $result['url'];
                $validated['url_video'] = $result['url'];
            } catch (\Exception $e) {
                return back()
                    ->withInput()
                    ->withErrors(['video_file' => 'Error al subir video: ' . $e->getMessage()]);
            }
        }
        // Sin nuevo archivo - mantener datos existentes
        else {
            unset($validated['r2_key'], $validated['r2_url']);
        }

        // Keep existing data if not changing
        if (empty($validated['url_video']) && $video->url_video) {
            $validated['url_video'] = $video->url_video;
        }
        if (empty($validated['tipo_fuente']) && $video->tipo_fuente) {
            $validated['tipo_fuente'] = $video->tipo_fuente;
        }
        if (empty($validated['r2_key'] ?? null) && $video->r2_key) {
            $validated['r2_key'] = $video->r2_key;
        }

        if (empty($validated['video_id'])) {
            $validated['video_id'] = $this->extractVideoId($validated['url_video'], $validated['tipo_fuente']);
        }

        // Handle manual thumbnail upload
        if ($request->hasFile('thumbnail')) {
            if ($video->thumbnail) {
                Storage::disk('public')->delete($video->thumbnail);
            }
            $validated['thumbnail'] = $request->file('thumbnail')
                ->store(config('pandilla.uploads.paths.images'), 'public');
        }

        // Remove temporary fields
        unset($validated['video_file'], $validated['r2_url']);

        $video->update($validated);

        return redirect()->route('admin.videos.index')
            ->with('success', 'Video actualizado correctamente');
    }

    public function destroy(Video $video, CloudflareMediaService $cloudflareService)
    {
        // Delete from Cloudflare R2 if applicable
        if ($video->r2_key && $cloudflareService->isConfigured()) {
            $cloudflareService->deleteVideo($video->r2_key);
        }

        // Delete local thumbnail if exists
        if ($video->thumbnail) {
            Storage::disk('public')->delete($video->thumbnail);
        }

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
