<?php

namespace App\Models;

use App\Traits\HasPublishedScope;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;

class Ley24325 extends Model
{
    use HasFactory, SoftDeletes, HasPublishedScope;

    protected $table = 'ley_24325';

    protected $fillable = [
        'titulo',
        'numero_ley',
        'fecha_promulgacion',
        'descripcion',
        'contenido',
        'documento_pdf',
        'r2_pdf_key',
        'r2_pdf_url',
        'imagen',
        'orden',
        'is_published',
        'is_featured',
    ];

    protected $appends = ['pdf_url'];

    protected $casts = [
        'fecha_promulgacion' => 'date',
        'is_published' => 'boolean',
        'is_featured' => 'boolean',
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

    /**
     * URL del PDF (prioriza CDN sobre local)
     */
    public function getPdfUrlAttribute(): ?string
    {
        if ($this->r2_pdf_url) {
            return $this->r2_pdf_url;
        }

        if ($this->documento_pdf) {
            return $this->documento_pdf;
        }

        return null;
    }

    /**
     * Get the imagen URL.
     */
    protected function imagen(): Attribute
    {
        return Attribute::make(
            get: fn (?string $value) => $value ? Storage::disk('public')->url($value) : null,
        );
    }
}
