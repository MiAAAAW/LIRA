<?php

namespace App\Models;

use App\Traits\HasPublishedScope;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HeroConfig extends Model
{
    use HasFactory, HasPublishedScope;

    protected $table = 'hero_configs';

    protected $fillable = [
        'titulo_principal',
        'titulo_highlight',
        'titulo_sufijo',
        'subtitulo',
        'anios',
        'descripcion',
        'badge_texto',
        'badge_variante',
        'cta_texto',
        'cta_href',
        'cta_secundario_texto',
        'cta_secundario_href',
        'r2_key_media',
        'media_url',
        'stats',
        'is_featured',
        'is_published',
        'orden',
    ];

    protected $casts = [
        'stats' => 'array',
        'is_featured' => 'boolean',
        'is_published' => 'boolean',
    ];

    /**
     * Get the active hero config (the one marked as featured).
     */
    public static function getActive(): ?self
    {
        return static::where('is_featured', true)->first();
    }

    /**
     * Detect if the media URL points to an image based on extension.
     */
    protected function isImageUrl(?string $url): bool
    {
        if (!$url) return false;
        $ext = strtolower(pathinfo(parse_url($url, PHP_URL_PATH) ?: '', PATHINFO_EXTENSION));
        return in_array($ext, ['jpg', 'jpeg', 'png', 'webp', 'gif', 'avif']);
    }

    /**
     * Transform flat DB fields into the nested structure Hero.jsx expects.
     */
    public function toHeroConfig(): array
    {
        $isImage = $this->isImageUrl($this->media_url);

        return [
            'title' => [
                'main' => $this->titulo_principal,
                'highlight' => $this->titulo_highlight,
                'suffix' => $this->titulo_sufijo ?? '',
                'break' => true,
            ],
            'subtitle' => $this->subtitulo,
            'years' => $this->anios,
            'description' => $this->descripcion,
            'badge' => $this->badge_texto ? [
                'text' => $this->badge_texto,
                'variant' => $this->badge_variante ?? 'outline',
            ] : null,
            'cta' => $this->cta_texto ? [
                'primary' => [
                    'text' => $this->cta_texto,
                    'href' => $this->cta_href ?? '#contenido',
                ],
                'secondary' => $this->cta_secundario_texto ? [
                    'text' => $this->cta_secundario_texto,
                    'href' => $this->cta_secundario_href ?? '#',
                ] : null,
            ] : null,
            'video' => ($this->media_url && !$isImage) ? ['src' => $this->media_url] : null,
            'image' => ($this->media_url && $isImage) ? [
                'src' => $this->media_url,
                'alt' => $this->titulo_principal,
            ] : null,
            'stats' => $this->stats ?? [],
        ];
    }
}
