<?php

namespace App\Models;

use App\Traits\HasProcessedImages;
use App\Traits\HasPublishedScope;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Publicacion extends Model
{
    use HasFactory, SoftDeletes, HasPublishedScope, HasProcessedImages;

    protected $table = 'publicaciones';

    protected $fillable = [
        'titulo',
        'tipo',
        'autor',
        'editorial',
        'isbn',
        'anio_publicacion',
        'edicion',
        'paginas',
        'descripcion',
        'resumen',
        'imagen_portada',
        'documento_pdf',
        'enlace_compra',
        'enlace_descarga',
        'enlace_externo',
        'precio',
        'orden',
        'is_published',
        'is_featured',
        // CDN fields for PDF
        'r2_pdf_key',
        'r2_pdf_url',
    ];

    protected $casts = [
        'precio' => 'decimal:2',
        'paginas' => 'integer',
        'is_published' => 'boolean',
        'is_featured' => 'boolean',
    ];

    protected $appends = [
        'image_url',
        'thumbnail_url',
        'webp_url',
        'pdf_url',
    ];

    public const TIPOS = [
        'libro' => 'Libro',
        'revista' => 'Revista',
        'articulo' => 'Articulo',
        'investigacion' => 'Investigacion',
        'tesis' => 'Tesis',
        'otro' => 'Otro',
    ];

    /**
     * Verificar si es gratuito
     */
    public function esGratuito(): bool
    {
        return is_null($this->precio) || $this->precio == 0;
    }

    /**
     * URL del PDF (prioriza CDN sobre local)
     */
    public function getPdfUrlAttribute(): ?string
    {
        // Prioridad: CDN > local
        if ($this->r2_pdf_url) {
            return $this->r2_pdf_url;
        }

        if ($this->documento_pdf) {
            return asset('storage/' . $this->documento_pdf);
        }

        return null;
    }

    /**
     * Tipo de imagen para procesamiento
     */
    public function getImageType(): string
    {
        return 'publicaciones';
    }

    /**
     * Campo de imagen principal
     */
    public function getImageField(): string
    {
        return 'imagen_portada';
    }
}
