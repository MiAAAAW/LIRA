<?php

namespace App\Models;

use App\Traits\HasPublishedScope;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Distincion extends Model
{
    use HasFactory, SoftDeletes, HasPublishedScope;

    protected $table = 'distinciones';

    protected $fillable = [
        'titulo',
        'tipo',
        'otorgante',
        'fecha_otorgamiento',
        'lugar',
        'descripcion',
        'contenido',
        'imagen',
        'galeria',
        'documento_pdf',
        'resolucion',
        'orden',
        'is_published',
        'is_featured',
    ];

    protected $casts = [
        'fecha_otorgamiento' => 'date',
        'galeria' => 'array',
        'is_published' => 'boolean',
        'is_featured' => 'boolean',
    ];

    public const TIPOS = [
        'reconocimiento' => 'Reconocimiento',
        'premio' => 'Premio',
        'medalla' => 'Medalla',
        'diploma' => 'Diploma',
        'condecoracion' => 'Condecoración',
    ];
}
