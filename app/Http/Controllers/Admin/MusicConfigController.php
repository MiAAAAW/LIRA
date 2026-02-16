<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MusicConfig;
use App\Services\CloudflareMediaService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class MusicConfigController extends Controller
{
    public function index(): Response
    {
        $items = MusicConfig::orderByDesc('is_featured')
            ->orderBy('orden')
            ->orderByDesc('created_at')
            ->paginate(config('pandilla.pagination.admin', 15));

        return Inertia::render('Admin/MusicConfig/Index', [
            'items' => $items,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'titulo' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'r2_key_audio' => 'nullable|string|max:500',
            'audio_url' => 'nullable|string|max:500',
            'volume' => 'nullable|integer|min:0|max:100',
            'loop' => 'nullable|boolean',
        ]);

        $validated['is_featured'] = false;

        MusicConfig::create($validated);

        return redirect()->route('admin.music-config.index')
            ->with('success', 'Música creada correctamente');
    }

    public function update(Request $request, MusicConfig $musicConfig)
    {
        $validated = $request->validate([
            'titulo' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'r2_key_audio' => 'nullable|string|max:500',
            'audio_url' => 'nullable|string|max:500',
            'volume' => 'nullable|integer|min:0|max:100',
            'loop' => 'nullable|boolean',
        ]);

        // Handle audio R2 replacement: si no viene nuevo audio, conservar el existente
        if (!empty($validated['r2_key_audio']) && $validated['r2_key_audio'] !== $musicConfig->r2_key_audio) {
            // New audio uploaded — keep new values
        } elseif (empty($validated['r2_key_audio'])) {
            unset($validated['r2_key_audio']);
            if (empty($validated['audio_url'])) {
                unset($validated['audio_url']);
            }
        }

        $musicConfig->update($validated);

        return redirect()->route('admin.music-config.index')
            ->with('success', 'Música actualizada correctamente');
    }

    public function destroy(MusicConfig $musicConfig, CloudflareMediaService $cloudflareService)
    {
        if ($musicConfig->r2_key_audio && $cloudflareService->isConfigured()) {
            try {
                $cloudflareService->delete($musicConfig->r2_key_audio);
            } catch (\Exception $e) {
                // Log but don't block deletion
            }
        }

        $musicConfig->delete();

        return redirect()->route('admin.music-config.index')
            ->with('success', 'Música eliminada correctamente');
    }

    public function toggleFeatured(MusicConfig $musicConfig)
    {
        $newState = !$musicConfig->is_featured;

        DB::transaction(function () use ($musicConfig, $newState) {
            MusicConfig::where('is_featured', true)->update(['is_featured' => false]);

            if ($newState) {
                $musicConfig->update(['is_featured' => true]);
            }
        });

        $musicConfig->refresh();

        return back()->with('success',
            $musicConfig->is_featured ? 'Música marcada como activa' : 'Música desmarcada como activa'
        );
    }
}
