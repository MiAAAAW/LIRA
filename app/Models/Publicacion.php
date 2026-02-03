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
        'precio',
        'orden',
        'is_published',
        'is_featured',
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
    ];

    public const TIPOS = [
        'libro' => 'Libro',
        'revista' => 'Revista',
        'articulo' => 'Artículo',
        'investigacion' => 'Investigación',
        'tesis' => 'Tesis',
    ];

    /**
     * Verificar si es gratuito
     */
    public function esGratuito(): bool
    {
        return is_null($this->precio) || $this->precio == 0;
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
