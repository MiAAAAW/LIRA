<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\RegistroIndecopi;
use App\Models\SiteSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class RegistroIndecopiController extends Controller
{
    public function index(): Response
    {
        $items = RegistroIndecopi::orderBy('orden')
            ->orderByDesc('created_at')
            ->paginate(config('pandilla.pagination.admin', 15));

        return Inertia::render('Admin/Indecopi/Index', [
            'items' => $items,
            'tiposRegistro' => config('pandilla.tipos_registro_indecopi'),
            'sectionVisible' => SiteSetting::isSectionVisible('indecopi'),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'titulo' => 'required|string|max:255',
            'tipo_registro' => 'nullable|string',
            'numero_registro' => 'nullable|string|max:100',
            'fecha_registro' => 'nullable|date',
            'certificado_pdf' => 'required|file|mimes:pdf|max:10240',
            'orden' => 'nullable|integer',
            'is_published' => 'nullable',
        ]);

        $validated['is_published'] = filter_var($request->input('is_published', true), FILTER_VALIDATE_BOOLEAN);

        if ($request->hasFile('certificado_pdf')) {
            $validated['certificado_pdf'] = $request->file('certificado_pdf')
                ->store(config('pandilla.uploads.paths.documents'), 'public');
        }

        RegistroIndecopi::create($validated);

        return redirect()->route('admin.indecopi.index')
            ->with('success', 'Registro INDECOPI creado correctamente');
    }

    public function update(Request $request, RegistroIndecopi $indecopi)
    {
        $validated = $request->validate([
            'titulo' => 'required|string|max:255',
            'tipo_registro' => 'nullable|string',
            'numero_registro' => 'nullable|string|max:100',
            'fecha_registro' => 'nullable|date',
            'certificado_pdf' => 'nullable|file|mimes:pdf|max:10240',
            'orden' => 'nullable|integer',
            'is_published' => 'nullable',
        ]);

        $validated['is_published'] = filter_var($request->input('is_published', false), FILTER_VALIDATE_BOOLEAN);

        if ($request->hasFile('certificado_pdf')) {
            $oldPath = $indecopi->getRawOriginal('certificado_pdf');
            if ($oldPath) {
                Storage::disk('public')->delete($oldPath);
            }
            $validated['certificado_pdf'] = $request->file('certificado_pdf')
                ->store(config('pandilla.uploads.paths.documents'), 'public');
        }

        $indecopi->update($validated);

        return redirect()->route('admin.indecopi.index')
            ->with('success', 'Registro INDECOPI actualizado correctamente');
    }

    public function destroy(RegistroIndecopi $indecopi)
    {
        $indecopi->delete();

        return redirect()->route('admin.indecopi.index')
            ->with('success', 'Registro INDECOPI eliminado correctamente');
    }

    public function togglePublish(RegistroIndecopi $indecopi)
    {
        $indecopi->update(['is_published' => !$indecopi->is_published]);

        return back()->with('success',
            $indecopi->is_published ? 'Publicado correctamente' : 'Despublicado correctamente'
        );
    }
}
