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
        'r2_pdf_key',
        'r2_pdf_url',
        'documento_pdf', // legacy, mantener para compatibilidad
        'orden',
        'is_published',
        'is_featured',
    ];

    protected $casts = [
        'fecha_otorgamiento' => 'date',
        'is_published' => 'boolean',
        'is_featured' => 'boolean',
    ];

    protected $appends = [
        'pdf_url',
    ];

    public const TIPOS = [
        'reconocimiento' => 'Reconocimiento',
        'premio' => 'Premio',
        'medalla' => 'Medalla',
        'diploma' => 'Diploma',
        'condecoracion' => 'Condecoración',
    ];

    /**
     * Accessor para obtener la URL del PDF
     * Prioriza R2, fallback a documento_pdf local
     */
    public function getPdfUrlAttribute(): ?string
    {
        if ($this->r2_pdf_url) {
            return $this->r2_pdf_url;
        }

        if ($this->documento_pdf) {
            return asset('storage/' . $this->documento_pdf);
        }

        return null;
    }
}
