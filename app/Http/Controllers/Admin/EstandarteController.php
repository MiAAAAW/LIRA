<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Estandarte;
use App\Services\ImageProcessingService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EstandarteController extends Controller
{
    public function __construct(
        protected ImageProcessingService $imageService
    ) {}

    public function index(): Response
    {
        $items = Estandarte::orderBy('orden')
            ->orderByDesc('created_at')
            ->paginate(config('pandilla.pagination.admin', 15));

        return Inertia::render('Admin/Estandartes/Index', [
            'items' => $items,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'titulo' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'imagen_principal' => 'required|image|max:5120',
            'orden' => 'nullable|integer',
            'is_published' => 'boolean',
            'is_featured' => 'boolean',
        ]);

        // Set defaults
        $validated['orden'] = $validated['orden'] ?? 0;

        // Procesar imagen con el servicio
        $paths = $this->imageService->process(
            $request->file('imagen_principal'),
            'estandartes'
        );
        $validated['imagen_principal'] = $paths['original'];

        Estandarte::create($validated);

        return redirect()->route('admin.estandartes.index')
            ->with('success', 'Estandarte creado correctamente');
    }

    public function update(Request $request, Estandarte $estandarte)
    {
        $validated = $request->validate([
            'titulo' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'imagen_principal' => 'nullable|image|max:5120',
            'orden' => 'nullable|integer',
            'is_published' => 'boolean',
            'is_featured' => 'boolean',
        ]);

        // Set defaults
        $validated['orden'] = $validated['orden'] ?? 0;

        if ($request->hasFile('imagen_principal')) {
            // Procesar nueva imagen y eliminar anterior automáticamente
            $paths = $this->imageService->process(
                $request->file('imagen_principal'),
                'estandartes',
                $estandarte->imagen_principal
            );
            $validated['imagen_principal'] = $paths['original'];
        }

        $estandarte->update($validated);

        return redirect()->route('admin.estandartes.index')
            ->with('success', 'Estandarte actualizado correctamente');
    }

    public function destroy(Estandarte $estandarte)
    {
        // Eliminar todas las variantes de imagen
        if ($estandarte->imagen_principal) {
            $this->imageService->delete($estandarte->imagen_principal, 'estandartes');
        }

        $estandarte->delete();

        return redirect()->route('admin.estandartes.index')
            ->with('success', 'Estandarte eliminado correctamente');
    }

    public function togglePublish(Estandarte $estandarte)
    {
        $estandarte->update(['is_published' => !$estandarte->is_published]);

        return back()->with('success',
            $estandarte->is_published ? 'Publicado correctamente' : 'Despublicado correctamente'
        );
    }
}
