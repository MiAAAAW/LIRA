<?php

namespace App\Models;

use App\Traits\HasPublishedScope;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Audio extends Model
{
    use HasFactory, SoftDeletes, HasPublishedScope;

    protected $table = 'audios';

    protected $fillable = [
        'titulo',
        'descripcion',
        'tipo',
        'compositor',
        'interprete',
        'arreglista',
        'anio_composicion',
        'anio_grabacion',
        'duracion',
        'url_audio',
        'tipo_fuente',
        'thumbnail',
        'letra',
        'partitura_pdf',
        'reproducciones',
        'orden',
        'is_published',
        'is_featured',
    ];

    protected $casts = [
        'reproducciones' => 'integer',
        'is_published' => 'boolean',
        'is_featured' => 'boolean',
    ];

    public const TIPOS = [
        'marinera' => 'Marinera',
        'huayno' => 'Huayño',
        'pandilla' => 'Pandilla',
        'sikuri' => 'Sikuri',
        'morenada' => 'Morenada',
        'diablada' => 'Diablada',
    ];

    public const TIPOS_FUENTE = [
        'soundcloud' => 'SoundCloud',
        'spotify' => 'Spotify',
        'cloudinary' => 'Cloudinary',
        'local' => 'Local',
    ];

    /**
     * Incrementar reproducciones
     */
    public function incrementarReproducciones(): void
    {
        $this->increment('reproducciones');
    }
}
