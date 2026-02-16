<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Presidente;
use App\Models\SiteSetting;
use App\Services\ImageProcessingService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PresidenteController extends Controller
{
    public function __construct(
        protected ImageProcessingService $imageService
    ) {}

    public function index(): Response
    {
        $items = Presidente::orderByDesc('es_actual')
            ->orderByDesc('orden')
            ->paginate(config('pandilla.pagination.admin', 15));

        // Datos del último presidente para sugerir defaults al crear uno nuevo
        $ultimo = Presidente::orderByDesc('orden')->first();

        return Inertia::render('Admin/Presidentes/Index', [
            'items' => $items,
            'sectionVisible' => SiteSetting::isSectionVisible('presidentes'),
            'nextDefaults' => [
                'orden' => $ultimo ? $ultimo->orden + 1 : 1,
                'periodo_inicio' => $ultimo?->periodo_fin,
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombres' => 'required|string|max:255',
            'apellidos' => 'required|string|max:255',
            'foto' => 'nullable|image|max:5120',
            'periodo_inicio' => 'nullable|integer|min:1900|max:2100',
            'periodo_fin' => 'nullable|integer|min:1900|max:2100',
            'es_actual' => 'boolean',
            'profesion' => 'nullable|string|max:255',
            'biografia' => 'nullable|string',
            'logros' => 'nullable|string',
            'email' => 'nullable|email|max:255',
            'telefono' => 'nullable|string|max:50',
            'redes_sociales' => 'nullable|array',
            'orden' => 'nullable|integer',
            'is_published' => 'boolean',
            'is_featured' => 'boolean',
        ]);

        if ($request->hasFile('foto')) {
            $paths = $this->imageService->process(
                $request->file('foto'),
                'presidentes'
            );
            $validated['foto'] = $paths['original'];
        }

        // Auto-asignar orden si no viene o es 0
        if (empty($validated['orden'])) {
            $validated['orden'] = (Presidente::max('orden') ?? 0) + 1;
        }

        // Si es actual, desmarcar otros
        if ($validated['es_actual'] ?? false) {
            Presidente::where('es_actual', true)->update(['es_actual' => false]);
        }

        Presidente::create($validated);

        return redirect()->route('admin.presidentes.index')
            ->with('success', 'Presidente creado correctamente');
    }

    public function update(Request $request, Presidente $presidente)
    {
        $validated = $request->validate([
            'nombres' => 'required|string|max:255',
            'apellidos' => 'required|string|max:255',
            'foto' => 'nullable|image|max:5120',
            'periodo_inicio' => 'nullable|integer|min:1900|max:2100',
            'periodo_fin' => 'nullable|integer|min:1900|max:2100',
            'es_actual' => 'boolean',
            'profesion' => 'nullable|string|max:255',
            'biografia' => 'nullable|string',
            'logros' => 'nullable|string',
            'email' => 'nullable|email|max:255',
            'telefono' => 'nullable|string|max:50',
            'redes_sociales' => 'nullable|array',
            'orden' => 'nullable|integer',
            'is_published' => 'boolean',
            'is_featured' => 'boolean',
        ]);

        if ($request->hasFile('foto')) {
            $paths = $this->imageService->process(
                $request->file('foto'),
                'presidentes',
                $presidente->foto
            );
            $validated['foto'] = $paths['original'];
        }

        // Si es actual, desmarcar otros
        if (($validated['es_actual'] ?? false) && !$presidente->es_actual) {
            Presidente::where('es_actual', true)->update(['es_actual' => false]);
        }

        $presidente->update($validated);

        return redirect()->route('admin.presidentes.index')
            ->with('success', 'Presidente actualizado correctamente');
    }

    public function destroy(Presidente $presidente)
    {
        if ($presidente->foto) {
            $this->imageService->delete($presidente->foto, 'presidentes');
        }

        $presidente->delete();

        return redirect()->route('admin.presidentes.index')
            ->with('success', 'Presidente eliminado correctamente');
    }

    public function togglePublish(Presidente $presidente)
    {
        $presidente->update(['is_published' => !$presidente->is_published]);

        return back()->with('success',
            $presidente->is_published ? 'Publicado correctamente' : 'Despublicado correctamente'
        );
    }
}
