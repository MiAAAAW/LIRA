<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\RegistroIndecopi;
use App\Models\SiteSetting;
use App\Services\CloudflareMediaService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class RegistroIndecopiController extends Controller
{
    public function __construct(
        protected CloudflareMediaService $r2Service
    ) {}

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
            'r2_pdf_key' => 'required|string',
            'r2_pdf_url' => 'required|url',
            'orden' => 'nullable|integer',
            'is_published' => 'nullable',
        ]);

        $validated['is_published'] = filter_var($request->input('is_published', true), FILTER_VALIDATE_BOOLEAN);

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
            'r2_pdf_key' => 'nullable|string',
            'r2_pdf_url' => 'nullable|url',
            'orden' => 'nullable|integer',
            'is_published' => 'nullable',
        ]);

        $validated['is_published'] = filter_var($request->input('is_published', false), FILTER_VALIDATE_BOOLEAN);

        // Si hay nuevo PDF en R2, eliminar el anterior
        if (!empty($validated['r2_pdf_key']) && $indecopi->r2_pdf_key) {
            $this->r2Service->delete($indecopi->r2_pdf_key);
        }

        $indecopi->update($validated);

        return redirect()->route('admin.indecopi.index')
            ->with('success', 'Registro INDECOPI actualizado correctamente');
    }

    public function destroy(RegistroIndecopi $indecopi)
    {
        if ($indecopi->r2_pdf_key) {
            $this->r2Service->delete($indecopi->r2_pdf_key);
        }

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
