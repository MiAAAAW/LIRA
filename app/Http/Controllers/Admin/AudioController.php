<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Audio;
use App\Models\SiteSetting;
use App\Services\CloudflareMediaService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class AudioController extends Controller
{
    public function index(): Response
    {
        $items = Audio::orderBy('orden')
            ->orderByDesc('created_at')
            ->paginate(config('pandilla.pagination.admin', 15));

        return Inertia::render('Admin/Audios/Index', [
            'items' => $items,
            'tipos' => config('pandilla.tipos_audio'),
            'sectionVisible' => SiteSetting::isSectionVisible('audios'),
        ]);
    }

    public function store(Request $request, CloudflareMediaService $r2Service)
    {
        $validated = $request->validate([
            'titulo' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'tipo' => 'required|string',
            'compositor' => 'nullable|string|max:255',
            'interprete' => 'nullable|string|max:255',
            'arreglista' => 'nullable|string|max:255',
            'anio_composicion' => 'nullable|integer|min:1800|max:2100',
            'anio_grabacion' => 'nullable|integer|min:1900|max:2100',
            'duracion' => 'nullable|string|max:20',
            'url_audio' => 'nullable|string|max:500',
            'tipo_fuente' => 'nullable|string',
            // Direct upload (ya subido a R2 desde el cliente)
            'r2_key' => 'nullable|string|max:500',
            'r2_url' => 'nullable|string|max:500',
            // Legacy file upload
            'audio_file' => 'nullable|file|mimes:mp3,wav,ogg,m4a|max:512000', // 500MB
            'thumbnail' => 'nullable|image|max:5120',
            'letra' => 'nullable|string',
            // Partitura via direct upload a R2
            'partitura_pdf' => 'nullable|string|max:500',
            'r2_partitura_key' => 'nullable|string|max:500',
            'orden' => 'nullable|integer',
            'is_published' => 'boolean',
            'is_featured' => 'boolean',
        ]);

        // Opción 1: Direct Upload (archivo ya está en R2)
        if (!empty($validated['r2_key'])) {
            $validated['tipo_fuente'] = 'cloudflare';
            $validated['r2_audio_url'] = $validated['r2_url'];
            $validated['url_audio'] = $validated['r2_url'];
            unset($validated['r2_url']);
        }
        // Opción 2: Legacy file upload
        elseif ($request->hasFile('audio_file')) {
            if (!$r2Service->isConfigured()) {
                return back()
                    ->withInput()
                    ->withErrors(['audio_file' => 'Cloudflare R2 no está configurado.']);
            }

            try {
                $result = $r2Service->uploadAudio($request->file('audio_file'));
                $validated['tipo_fuente'] = 'cloudflare';
                $validated['r2_key'] = $result['key'];
                $validated['r2_audio_url'] = $result['url'];
                $validated['url_audio'] = $result['url'];
            } catch (\Exception $e) {
                return back()
                    ->withInput()
                    ->withErrors(['audio_file' => 'Error al subir audio: ' . $e->getMessage()]);
            }
        }

        // Validar que tenga archivo
        if (empty($validated['url_audio']) && empty($validated['r2_key'])) {
            return back()
                ->withInput()
                ->withErrors(['audio_file' => 'Debes subir un archivo de audio.']);
        }

        if ($request->hasFile('thumbnail')) {
            $validated['thumbnail'] = $request->file('thumbnail')
                ->store(config('pandilla.uploads.paths.images'), 'public');
        }

        // Limpiar campos no persistibles
        unset($validated['audio_file'], $validated['r2_url']);

        Audio::create($validated);

        return redirect()->route('admin.audios.index')
            ->with('success', 'Audio creado correctamente');
    }

    public function update(Request $request, Audio $audio, CloudflareMediaService $r2Service)
    {
        $validated = $request->validate([
            'titulo' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'tipo' => 'required|string',
            'compositor' => 'nullable|string|max:255',
            'interprete' => 'nullable|string|max:255',
            'arreglista' => 'nullable|string|max:255',
            'anio_composicion' => 'nullable|integer|min:1800|max:2100',
            'anio_grabacion' => 'nullable|integer|min:1900|max:2100',
            'duracion' => 'nullable|string|max:20',
            'url_audio' => 'nullable|string|max:500',
            'tipo_fuente' => 'nullable|string',
            // Direct upload
            'r2_key' => 'nullable|string|max:500',
            'r2_url' => 'nullable|string|max:500',
            // Legacy
            'audio_file' => 'nullable|file|mimes:mp3,wav,ogg,m4a|max:512000',
            'thumbnail' => 'nullable|image|max:5120',
            'letra' => 'nullable|string',
            // Partitura via direct upload a R2
            'partitura_pdf' => 'nullable|string|max:500',
            'r2_partitura_key' => 'nullable|string|max:500',
            'orden' => 'nullable|integer',
            'is_published' => 'boolean',
            'is_featured' => 'boolean',
        ]);

        // Opción 1: Direct Upload (archivo nuevo ya está en R2)
        if (!empty($validated['r2_key']) && $validated['r2_key'] !== $audio->r2_key) {
            if ($audio->r2_key && $r2Service->isConfigured()) {
                $r2Service->deleteAudio($audio->r2_key);
            }
            $validated['tipo_fuente'] = 'cloudflare';
            $validated['r2_audio_url'] = $validated['r2_url'];
            $validated['url_audio'] = $validated['r2_url'];
            unset($validated['r2_url']);
        }
        // Opción 2: Legacy file upload
        elseif ($request->hasFile('audio_file')) {
            if (!$r2Service->isConfigured()) {
                return back()
                    ->withInput()
                    ->withErrors(['audio_file' => 'Cloudflare R2 no está configurado.']);
            }

            try {
                if ($audio->r2_key) {
                    $r2Service->deleteAudio($audio->r2_key);
                }

                $result = $r2Service->uploadAudio($request->file('audio_file'));
                $validated['tipo_fuente'] = 'cloudflare';
                $validated['r2_key'] = $result['key'];
                $validated['r2_audio_url'] = $result['url'];
                $validated['url_audio'] = $result['url'];
            } catch (\Exception $e) {
                return back()
                    ->withInput()
                    ->withErrors(['audio_file' => 'Error al subir audio: ' . $e->getMessage()]);
            }
        }
        // Sin nuevo archivo
        else {
            unset($validated['r2_key'], $validated['r2_url']);
        }

        // Mantener datos existentes si no se cambió
        if (empty($validated['url_audio']) && $audio->url_audio) {
            $validated['url_audio'] = $audio->url_audio;
        }
        if (empty($validated['tipo_fuente']) && $audio->tipo_fuente) {
            $validated['tipo_fuente'] = $audio->tipo_fuente;
        }
        if (empty($validated['r2_key'] ?? null) && $audio->r2_key) {
            $validated['r2_key'] = $audio->r2_key;
        }

        if ($request->hasFile('thumbnail')) {
            if ($audio->thumbnail) {
                Storage::disk('public')->delete($audio->thumbnail);
            }
            $validated['thumbnail'] = $request->file('thumbnail')
                ->store(config('pandilla.uploads.paths.images'), 'public');
        }

        // Si no se subió nueva partitura, conservar la existente
        if (empty($validated['partitura_pdf']) && $audio->partitura_pdf) {
            unset($validated['partitura_pdf'], $validated['r2_partitura_key']);
        }

        // Remove temporary fields
        unset($validated['audio_file'], $validated['r2_url']);

        $audio->update($validated);

        return redirect()->route('admin.audios.index')
            ->with('success', 'Audio actualizado correctamente');
    }

    public function destroy(Audio $audio, CloudflareMediaService $r2Service)
    {
        // Eliminar de Cloudflare R2 si existe
        if ($audio->r2_key && $r2Service->isConfigured()) {
            $r2Service->deleteAudio($audio->r2_key);
        }

        // Eliminar archivos locales
        if ($audio->thumbnail) {
            Storage::disk('public')->delete($audio->thumbnail);
        }
        if ($audio->partitura_pdf) {
            Storage::disk('public')->delete($audio->partitura_pdf);
        }

        $audio->delete();

        return redirect()->route('admin.audios.index')
            ->with('success', 'Audio eliminado correctamente');
    }

    public function togglePublish(Audio $audio)
    {
        $audio->update(['is_published' => !$audio->is_published]);

        return back()->with('success',
            $audio->is_published ? 'Publicado correctamente' : 'Despublicado correctamente'
        );
    }
}
