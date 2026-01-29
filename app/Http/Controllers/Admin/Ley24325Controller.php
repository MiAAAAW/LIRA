<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Ley24325;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class Ley24325Controller extends Controller
{
    public function index(): Response
    {
        $items = Ley24325::orderBy('orden')
            ->orderByDesc('created_at')
            ->paginate(config('pandilla.pagination.admin', 15));

        return Inertia::render('Admin/Ley24325/Index', [
            'items' => $items,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'titulo' => 'required|string|max:255',
            'numero_ley' => 'nullable|string|max:100',
            'fecha_promulgacion' => 'nullable|date',
            'documento_pdf' => 'required|file|mimes:pdf|max:10240',
            'orden' => 'nullable|integer',
            'is_published' => 'nullable',
        ]);

        $validated['is_published'] = filter_var($request->input('is_published', true), FILTER_VALIDATE_BOOLEAN);

        if ($request->hasFile('documento_pdf')) {
            $validated['documento_pdf'] = $request->file('documento_pdf')
                ->store(config('pandilla.uploads.paths.documents'), 'public');
        }

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
            'documento_pdf' => 'nullable|file|mimes:pdf|max:10240',
            'orden' => 'nullable|integer',
            'is_published' => 'nullable',
        ]);

        $validated['is_published'] = filter_var($request->input('is_published', false), FILTER_VALIDATE_BOOLEAN);

        if ($request->hasFile('documento_pdf')) {
            $oldPath = $ley24325->getRawOriginal('documento_pdf');
            if ($oldPath) {
                Storage::disk('public')->delete($oldPath);
            }
            $validated['documento_pdf'] = $request->file('documento_pdf')
                ->store(config('pandilla.uploads.paths.documents'), 'public');
        }

        $ley24325->update($validated);

        return redirect()->route('admin.ley24325.index')
            ->with('success', 'Registro actualizado correctamente');
    }

    public function destroy(Ley24325 $ley24325)
    {
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
