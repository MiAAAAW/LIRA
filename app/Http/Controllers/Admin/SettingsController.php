<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SettingsController extends Controller
{
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
}
