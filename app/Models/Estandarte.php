<?php

namespace App\Models;

use App\Traits\HasProcessedImages;
use App\Traits\HasPublishedScope;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Estandarte extends Model
{
    use HasFactory, SoftDeletes, HasPublishedScope, HasProcessedImages;

    protected $table = 'estandartes';

    protected $fillable = [
        'titulo',
        'tipo',
        'anio',
        'autor',
        'donante',
        'descripcion',
        'historia',
        'imagen_principal',
        'galeria',
        'dimensiones',
        'materiales',
        'ubicacion_actual',
        'orden',
        'is_published',
        'is_featured',
    ];

    protected $casts = [
        'galeria' => 'array',
        'is_published' => 'boolean',
        'is_featured' => 'boolean',
    ];

    protected $appends = [
        'image_url',
        'thumbnail_url',
        'webp_url',
        'gallery_urls',
    ];

    public const TIPOS = [
        'principal' => 'Principal',
        'historico' => 'Histórico',
        'conmemorativo' => 'Conmemorativo',
        'juvenil' => 'Juvenil',
    ];

    /**
     * Tipo de imagen para procesamiento
     */
    public function getImageType(): string
    {
        return 'estandartes';
    }

    /**
     * Campo de imagen principal
     */
    public function getImageField(): string
    {
        return 'imagen_principal';
    }

    /**
     * Campo de galería
     */
    public function getGalleryField(): ?string
    {
        return 'galeria';
    }
}
