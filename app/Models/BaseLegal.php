<?php

namespace App\Models;

use App\Traits\HasPublishedScope;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;

class BaseLegal extends Model
{
    use HasFactory, SoftDeletes, HasPublishedScope;

    protected $table = 'base_legal';

    protected $fillable = [
        'titulo',
        'tipo_documento',
        'numero_documento',
        'fecha_emision',
        'entidad_emisora',
        'descripcion',
        'contenido',
        'documento_pdf',
        'enlace_externo',
        'orden',
        'is_published',
        'is_featured',
    ];

    protected $casts = [
        'fecha_emision' => 'date',
        'is_published' => 'boolean',
        'is_featured' => 'boolean',
    ];

    public const TIPOS_DOCUMENTO = [
        'ley' => 'Ley',
        'decreto' => 'Decreto',
        'resolucion' => 'Resolución',
        'ordenanza' => 'Ordenanza',
        'directiva' => 'Directiva',
    ];

    /**
     * Get the documento_pdf URL.
     */
    protected function documentoPdf(): Attribute
    {
        return Attribute::make(
            get: fn (?string $value) => $value ? Storage::disk('public')->url($value) : null,
        );
    }
}
