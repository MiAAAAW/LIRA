<?php

namespace App\Models;

use App\Traits\HasPublishedScope;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Video extends Model
{
    use HasFactory, SoftDeletes, HasPublishedScope;

    protected $table = 'videos';

    protected $fillable = [
        'titulo',
        'descripcion',
        'tipo_fuente',
        'url_video',
        'video_id',
        'thumbnail',
        'duracion',
        'anio',
        'categoria',
        'evento',
        'ubicacion',
        'vistas',
        'orden',
        'is_published',
        'is_featured',
    ];

    protected $casts = [
        'vistas' => 'integer',
        'is_published' => 'boolean',
        'is_featured' => 'boolean',
    ];

    public const TIPOS_FUENTE = [
        'youtube' => 'YouTube',
        'vimeo' => 'Vimeo',
        'cloudinary' => 'Cloudinary',
        'local' => 'Local',
    ];

    public const CATEGORIAS = [
        'presentacion' => 'Presentación',
        'documental' => 'Documental',
        'entrevista' => 'Entrevista',
        'ensayo' => 'Ensayo',
        'tutorial' => 'Tutorial',
    ];

    /**
     * Incrementar vistas
     */
    public function incrementarVistas(): void
    {
        $this->increment('vistas');
    }

    /**
     * Obtener URL embebida
     */
    public function getEmbedUrlAttribute(): ?string
    {
        return match($this->tipo_fuente) {
            'youtube' => "https://www.youtube.com/embed/{$this->video_id}",
            'vimeo' => "https://player.vimeo.com/video/{$this->video_id}",
            default => $this->url_video,
        };
    }
}
