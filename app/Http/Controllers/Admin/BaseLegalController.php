<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BaseLegal;
use App\Models\SiteSetting;
use App\Services\CloudflareMediaService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BaseLegalController extends Controller
{
    public function __construct(
        protected CloudflareMediaService $r2Service
    ) {}

    public function index(): Response
    {
        $items = BaseLegal::orderBy('orden')
            ->orderByDesc('created_at')
            ->paginate(config('pandilla.pagination.admin', 15));

        return Inertia::render('Admin/BaseLegal/Index', [
            'items' => $items,
            'tiposDocumento' => config('pandilla.tipos_documento_legal'),
            'sectionVisible' => SiteSetting::isSectionVisible('base_legal'),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'titulo' => 'required|string|max:255',
            'tipo_documento' => 'required|string',
            'numero_documento' => 'nullable|string|max:100',
            'fecha_emision' => 'nullable|date',
            'r2_pdf_key' => 'required|string',
            'r2_pdf_url' => 'required|url',
            'orden' => 'nullable|integer',
            'is_published' => 'boolean',
        ]);

        BaseLegal::create($validated);

        return redirect()->route('admin.base-legal.index')
            ->with('success', 'Documento legal creado correctamente');
    }

    public function update(Request $request, BaseLegal $baseLegal)
    {
        $validated = $request->validate([
            'titulo' => 'required|string|max:255',
            'tipo_documento' => 'required|string',
            'numero_documento' => 'nullable|string|max:100',
            'fecha_emision' => 'nullable|date',
            'r2_pdf_key' => 'nullable|string',
            'r2_pdf_url' => 'nullable|url',
            'orden' => 'nullable|integer',
            'is_published' => 'boolean',
        ]);

        // Si hay nuevo PDF en R2, eliminar el anterior
        if (!empty($validated['r2_pdf_key']) && $baseLegal->r2_pdf_key) {
            $this->r2Service->delete($baseLegal->r2_pdf_key);
        }

        $baseLegal->update($validated);

        return redirect()->route('admin.base-legal.index')
            ->with('success', 'Documento legal actualizado correctamente');
    }

    public function destroy(BaseLegal $baseLegal)
    {
        if ($baseLegal->r2_pdf_key) {
            $this->r2Service->delete($baseLegal->r2_pdf_key);
        }

        $baseLegal->delete();

        return redirect()->route('admin.base-legal.index')
            ->with('success', 'Documento legal eliminado correctamente');
    }

    public function togglePublish(BaseLegal $baseLegal)
    {
        $baseLegal->update(['is_published' => !$baseLegal->is_published]);

        return back()->with('success',
            $baseLegal->is_published ? 'Publicado correctamente' : 'Despublicado correctamente'
        );
    }
}
