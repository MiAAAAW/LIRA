<?php

namespace App\Models;

use App\Traits\HasPublishedScope;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;

class Video extends Model
{
    use HasFactory, SoftDeletes, HasPublishedScope;

    protected $table = 'videos';

    protected $fillable = [
        'titulo',
        'descripcion',
        'descripcion_larga',
        'tipo_fuente',
        'url_video',
        'video_id',
        'thumbnail',
        'r2_key',
        'r2_video_url',
        'r2_thumbnail_url',
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

    protected $appends = ['thumbnail_url', 'playable_url'];

    protected $casts = [
        'vistas' => 'integer',
        'is_published' => 'boolean',
        'is_featured' => 'boolean',
    ];

    public const TIPOS_FUENTE = [
        'youtube' => 'YouTube',
        'vimeo' => 'Vimeo',
        'cloudflare' => 'Cloudflare R2',
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
            'cloudflare' => $this->r2_video_url,
            default => $this->url_video,
        };
    }

    /**
     * Obtener URL del thumbnail (prioridad: R2 > YouTube auto > manual)
     */
    public function getThumbnailUrlAttribute(): ?string
    {
        // 1. Si tiene thumbnail en Cloudflare R2, usarlo
        if ($this->r2_thumbnail_url) {
            return $this->r2_thumbnail_url;
        }

        // 2. Si es YouTube, generar automáticamente
        if ($this->tipo_fuente === 'youtube' && $this->video_id) {
            return "https://img.youtube.com/vi/{$this->video_id}/maxresdefault.jpg";
        }

        // 3. Si es Vimeo, podría implementarse vimeo thumbnail API
        // Por ahora dejamos el fallback al thumbnail manual

        // 4. Fallback al thumbnail manual subido
        if ($this->thumbnail) {
            return Storage::url($this->thumbnail);
        }

        return null;
    }

    /**
     * Obtener la URL del video para reproducción
     */
    public function getPlayableUrlAttribute(): ?string
    {
        // Para videos en Cloudflare R2, generar URL fresca
        if ($this->tipo_fuente === 'cloudflare' && $this->r2_key) {
            return $this->getR2Url();
        }

        return match($this->tipo_fuente) {
            'youtube', 'vimeo' => $this->url_video,
            default => $this->url_video,
        };
    }

    /**
     * Obtener URL de Cloudflare R2 (firmada o pública según config)
     */
    protected function getR2Url(): ?string
    {
        if (!$this->r2_key) {
            return null;
        }

        try {
            // Usar URL pública (bucket debe tener acceso público configurado)
            return Storage::disk('r2')->url($this->r2_key);
        } catch (\Exception $e) {
            // Fallback a URL guardada
            return $this->r2_video_url;
        }
    }

    /**
     * Obtener URL firmada (para acceso seguro temporal)
     */
    public function getSignedVideoUrl(int $minutes = 60): ?string
    {
        if (!$this->r2_key) {
            return null;
        }

        try {
            return Storage::disk('r2')->temporaryUrl(
                $this->r2_key,
                now()->addMinutes($minutes)
            );
        } catch (\Exception $e) {
            return null;
        }
    }
}
