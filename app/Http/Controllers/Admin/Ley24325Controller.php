<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Ley24325;
use App\Models\SiteSetting;
use App\Services\CloudflareMediaService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class Ley24325Controller extends Controller
{
    public function __construct(
        protected CloudflareMediaService $r2Service
    ) {}

    public function index(): Response
    {
        $items = Ley24325::orderBy('orden')
            ->orderByDesc('created_at')
            ->paginate(config('pandilla.pagination.admin', 15));

        return Inertia::render('Admin/Ley24325/Index', [
            'items' => $items,
            'sectionVisible' => SiteSetting::isSectionVisible('ley24325'),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'titulo' => 'required|string|max:255',
            'numero_ley' => 'nullable|string|max:100',
            'fecha_promulgacion' => 'nullable|date',
            'r2_pdf_key' => 'required|string',
            'r2_pdf_url' => 'required|url',
            'orden' => 'nullable|integer',
            'is_published' => 'nullable',
        ]);

        $validated['is_published'] = filter_var($request->input('is_published', true), FILTER_VALIDATE_BOOLEAN);

        Ley24325::create($validated);

        return redirect()->route('admin.ley24325.index')
            ->with('success', 'Registro creado correctamente');
    }

    public function update(Request $request, Ley24325 $ley24325)
    {
        $validated = $request->validate([
            'titulo' => 'required|string|max:255',
            'numero_ley' => 'nullable|string|max:100',
            'fecha_promulgacion' => 'nullable|date',
            'r2_pdf_key' => 'nullable|string',
            'r2_pdf_url' => 'nullable|url',
            'orden' => 'nullable|integer',
            'is_published' => 'nullable',
        ]);

        $validated['is_published'] = filter_var($request->input('is_published', false), FILTER_VALIDATE_BOOLEAN);

        // Si hay nuevo PDF en R2, eliminar el anterior
        if (!empty($validated['r2_pdf_key']) && $ley24325->r2_pdf_key) {
            $this->r2Service->delete($ley24325->r2_pdf_key);
        }

        $ley24325->update($validated);

        return redirect()->route('admin.ley24325.index')
            ->with('success', 'Registro actualizado correctamente');
    }

    public function destroy(Ley24325 $ley24325)
    {
        if ($ley24325->r2_pdf_key) {
            $this->r2Service->delete($ley24325->r2_pdf_key);
        }

        $ley24325->delete();

        return redirect()->route('admin.ley24325.index')
            ->with('success', 'Registro eliminado correctamente');
    }

    public function togglePublish(Ley24325 $ley24325)
    {
        $ley24325->update(['is_published' => !$ley24325->is_published]);

        return back()->with('success',
            $ley24325->is_published ? 'Publicado correctamente' : 'Despublicado correctamente'
        );
    }
}
