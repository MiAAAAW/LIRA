<?php

namespace App\Models;

use App\Traits\HasPublishedScope;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;

class RegistroIndecopi extends Model
{
    use HasFactory, SoftDeletes, HasPublishedScope;

    protected $table = 'registro_indecopi';

    protected $fillable = [
        'titulo',
        'numero_registro',
        'numero_expediente',
        'fecha_registro',
        'fecha_renovacion',
        'tipo_registro',
        'clase_niza',
        'descripcion',
        'contenido',
        'certificado_pdf',
        'r2_pdf_key',
        'r2_pdf_url',
        'imagen',
        'estado',
        'orden',
        'is_published',
        'is_featured',
    ];

    protected $appends = ['pdf_url'];

    protected $casts = [
        'fecha_registro' => 'date',
        'fecha_renovacion' => 'date',
        'is_published' => 'boolean',
        'is_featured' => 'boolean',
    ];

    public const TIPOS_REGISTRO = [
        'marca' => 'Marca',
        'denominacion_origen' => 'Denominación de Origen',
        'marca_colectiva' => 'Marca Colectiva',
        'nombre_comercial' => 'Nombre Comercial',
    ];

    public const ESTADOS = [
        'vigente' => 'Vigente',
        'en_tramite' => 'En Trámite',
        'vencido' => 'Vencido',
    ];

    /**
     * Get the certificado_pdf URL.
     */
    protected function certificadoPdf(): Attribute
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

        if ($this->certificado_pdf) {
            return $this->certificado_pdf;
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
