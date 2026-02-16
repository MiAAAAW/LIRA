<?php

namespace App\Models;

use App\Traits\HasPublishedScope;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MusicConfig extends Model
{
    use HasFactory, HasPublishedScope;

    protected $table = 'music_configs';

    protected $fillable = [
        'titulo',
        'descripcion',
        'r2_key_audio',
        'audio_url',
        'volume',
        'loop',
        'is_featured',
        'is_published',
        'orden',
    ];

    protected $casts = [
        'volume' => 'integer',
        'loop' => 'boolean',
        'is_featured' => 'boolean',
        'is_published' => 'boolean',
    ];

    /**
     * Get the active music config (the one marked as featured).
     */
    public static function getActive(): ?self
    {
        return static::where('is_featured', true)->first();
    }

    /**
     * Transform to frontend-friendly format for the music player.
     */
    public function toMusicConfig(): array
    {
        return [
            'id' => $this->id,
            'titulo' => $this->titulo,
            'audioUrl' => $this->audio_url,
            'volume' => $this->volume,
            'loop' => $this->loop,
        ];
    }
}
