<?php

namespace App\Models;

use App\Traits\HasPublishedScope;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;

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
        'r2_key',
        'r2_audio_url',
        'thumbnail',
        'letra',
        'partitura_pdf',
        'reproducciones',
        'orden',
        'is_published',
        'is_featured',
    ];

    protected $appends = ['playable_url'];

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
        'cloudflare' => 'Cloudflare R2',
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

    /**
     * Obtener URL reproducible del audio
     */
    public function getPlayableUrlAttribute(): ?string
    {
        // Si está en Cloudflare R2, usar esa URL
        if ($this->tipo_fuente === 'cloudflare' && $this->r2_audio_url) {
            return $this->r2_audio_url;
        }

        // Fallback a url_audio (SoundCloud, Spotify, etc.)
        return $this->url_audio;
    }
}
