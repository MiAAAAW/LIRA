<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Audio;
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
            'fuentes' => config('pandilla.fuentes_media'),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Audios/Create', [
            'tipos' => config('pandilla.tipos_audio'),
            'fuentes' => config('pandilla.fuentes_media'),
        ]);
    }

    public function store(Request $request)
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
            'url_audio' => 'required|string|max:500',
            'tipo_fuente' => 'required|string',
            'thumbnail' => 'nullable|image|max:5120',
            'letra' => 'nullable|string',
            'partitura_pdf' => 'nullable|file|mimes:pdf|max:10240',
            'orden' => 'nullable|integer',
            'is_published' => 'boolean',
            'is_featured' => 'boolean',
        ]);

        if ($request->hasFile('thumbnail')) {
            $validated['thumbnail'] = $request->file('thumbnail')
                ->store(config('pandilla.uploads.paths.images'), 'public');
        }

        if ($request->hasFile('partitura_pdf')) {
            $validated['partitura_pdf'] = $request->file('partitura_pdf')
                ->store(config('pandilla.uploads.paths.documents'), 'public');
        }

        Audio::create($validated);

        return redirect()->route('admin.audios.index')
            ->with('success', 'Audio creado correctamente');
    }

    public function show(Audio $audio): Response
    {
        return Inertia::render('Admin/Audios/Show', [
            'item' => $audio,
        ]);
    }

    public function edit(Audio $audio): Response
    {
        return Inertia::render('Admin/Audios/Edit', [
            'item' => $audio,
            'tipos' => config('pandilla.tipos_audio'),
            'fuentes' => config('pandilla.fuentes_media'),
        ]);
    }

    public function update(Request $request, Audio $audio)
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
            'url_audio' => 'required|string|max:500',
            'tipo_fuente' => 'required|string',
            'thumbnail' => 'nullable|image|max:5120',
            'letra' => 'nullable|string',
            'partitura_pdf' => 'nullable|file|mimes:pdf|max:10240',
            'orden' => 'nullable|integer',
            'is_published' => 'boolean',
            'is_featured' => 'boolean',
        ]);

        if ($request->hasFile('thumbnail')) {
            if ($audio->thumbnail) {
                Storage::disk('public')->delete($audio->thumbnail);
            }
            $validated['thumbnail'] = $request->file('thumbnail')
                ->store(config('pandilla.uploads.paths.images'), 'public');
        }

        if ($request->hasFile('partitura_pdf')) {
            if ($audio->partitura_pdf) {
                Storage::disk('public')->delete($audio->partitura_pdf);
            }
            $validated['partitura_pdf'] = $request->file('partitura_pdf')
                ->store(config('pandilla.uploads.paths.documents'), 'public');
        }

        $audio->update($validated);

        return redirect()->route('admin.audios.index')
            ->with('success', 'Audio actualizado correctamente');
    }

    public function destroy(Audio $audio)
    {
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
