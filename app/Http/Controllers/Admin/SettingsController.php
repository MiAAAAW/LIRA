<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SettingsController extends Controller
{
    private const VALID_SECTIONS = [
        'ley24325', 'base_legal', 'indecopi', 'estandartes', 'presidentes',
        'videos', 'audios', 'distinciones', 'publicaciones', 'comunicados',
    ];

    public function index(): Response
    {
        return Inertia::render('Admin/Settings', [
            'config' => [
                'nombre' => config('pandilla.nombre'),
                'nombre_corto' => config('pandilla.nombre_corto'),
                'fundacion' => config('pandilla.fundacion'),
                'contacto' => config('pandilla.contacto'),
                'redes_sociales' => config('pandilla.redes_sociales'),
            ],
        ]);
    }

    public function toggleSection(Request $request): RedirectResponse
    {
        $request->validate([
            'section' => ['required', 'string', 'in:' . implode(',', self::VALID_SECTIONS)],
        ]);

        $newValue = SiteSetting::toggleSection($request->section);

        return back()->with('success', $newValue ? 'Sección visible' : 'Sección oculta');
    }
}
