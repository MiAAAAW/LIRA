<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BaseLegal;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class BaseLegalController extends Controller
{
    public function index(): Response
    {
        $items = BaseLegal::orderBy('orden')
            ->orderByDesc('created_at')
            ->paginate(config('pandilla.pagination.admin', 15));

        return Inertia::render('Admin/BaseLegal/Index', [
            'items' => $items,
            'tiposDocumento' => config('pandilla.tipos_documento_legal'),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'titulo' => 'required|string|max:255',
            'tipo_documento' => 'required|string',
            'numero_documento' => 'nullable|string|max:100',
            'fecha_emision' => 'nullable|date',
            'documento_pdf' => 'required|file|mimes:pdf|max:10240',
            'orden' => 'nullable|integer',
            'is_published' => 'boolean',
        ]);

        if ($request->hasFile('documento_pdf')) {
            $validated['documento_pdf'] = $request->file('documento_pdf')
                ->store(config('pandilla.uploads.paths.documents'), 'public');
        }

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
            'documento_pdf' => 'nullable|file|mimes:pdf|max:10240',
            'orden' => 'nullable|integer',
            'is_published' => 'boolean',
        ]);

        if ($request->hasFile('documento_pdf')) {
            if ($baseLegal->documento_pdf) {
                Storage::disk('public')->delete($baseLegal->documento_pdf);
            }
            $validated['documento_pdf'] = $request->file('documento_pdf')
                ->store(config('pandilla.uploads.paths.documents'), 'public');
        }

        $baseLegal->update($validated);

        return redirect()->route('admin.base-legal.index')
            ->with('success', 'Documento legal actualizado correctamente');
    }

    public function destroy(BaseLegal $baseLegal)
    {
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
