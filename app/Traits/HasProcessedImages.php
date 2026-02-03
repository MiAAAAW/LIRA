<?php

namespace App\Traits;

use App\Services\ImageProcessingService;
use Illuminate\Support\Facades\Storage;

/**
 * Trait para modelos que usan el sistema de procesamiento de imágenes.
 *
 * Los modelos que usen este trait deben implementar:
 * - getImageType(): string - retorna el tipo de imagen (estandartes, presidentes, etc.)
 * - getImageField(): string - retorna el nombre del campo de imagen principal
 *
 * Opcionalmente pueden implementar:
 * - getGalleryField(): ?string - retorna el nombre del campo de galería si aplica
 */
trait HasProcessedImages
{
    /**
     * Obtiene el tipo de imagen para este modelo
     * Debe ser sobrescrito por cada modelo
     */
    public function getImageType(): string
    {
        // Deriva del nombre de la tabla por defecto
        return $this->getTable();
    }

    /**
     * Obtiene el nombre del campo de imagen principal
     * Debe ser sobrescrito por cada modelo
     */
    public function getImageField(): string
    {
        // Campo por defecto
        return 'imagen';
    }

    /**
     * Obtiene el nombre del campo de galería (si existe)
     */
    public function getGalleryField(): ?string
    {
        return null;
    }

    /**
     * Accessor: URL de la imagen original procesada
     */
    public function getImageUrlAttribute(): ?string
    {
        $field = $this->getImageField();
        $path = $this->{$field};

        if (empty($path)) {
            return null;
        }

        // Si la ruta contiene /originals/, usar el sistema de procesamiento
        if (str_contains($path, '/originals/')) {
            return Storage::disk('public')->url($path);
        }

        // Compatibilidad con imágenes antiguas (sin procesar)
        return Storage::disk('public')->url($path);
    }

    /**
     * Accessor: URL del thumbnail
     */
    public function getThumbnailUrlAttribute(): ?string
    {
        $field = $this->getImageField();
        $path = $this->{$field};

        if (empty($path)) {
            return null;
        }

        // Si usa el nuevo sistema de procesamiento
        if (str_contains($path, '/originals/')) {
            $thumbnailPath = str_replace('/originals/', '/thumbnails/', $path);
            return Storage::disk('public')->url($thumbnailPath);
        }

        // Fallback a imagen original para imágenes antiguas
        return Storage::disk('public')->url($path);
    }

    /**
     * Accessor: URL de la versión WebP
     */
    public function getWebpUrlAttribute(): ?string
    {
        if (!config('pandilla.webp.enabled', true)) {
            return null;
        }

        $field = $this->getImageField();
        $path = $this->{$field};

        if (empty($path)) {
            return null;
        }

        // Si usa el nuevo sistema de procesamiento
        if (str_contains($path, '/originals/')) {
            $pathInfo = pathinfo($path);
            $dir = dirname($path);
            $filename = $pathInfo['filename'];
            $webpPath = str_replace('/originals/', '/webp/', $dir) . '/' . $filename . '.webp';
            return Storage::disk('public')->url($webpPath);
        }

        // No hay WebP para imágenes antiguas
        return null;
    }

    /**
     * Obtiene todas las URLs de imagen en un array
     */
    public function getImageUrlsAttribute(): array
    {
        return [
            'original' => $this->image_url,
            'thumbnail' => $this->thumbnail_url,
            'webp' => $this->webp_url,
        ];
    }

    /**
     * Accessor: URLs de galería (si tiene campo galería)
     */
    public function getGalleryUrlsAttribute(): array
    {
        $galleryField = $this->getGalleryField();

        if (!$galleryField || empty($this->{$galleryField})) {
            return [];
        }

        $service = app(ImageProcessingService::class);
        $urls = [];

        foreach ($this->{$galleryField} as $path) {
            $urls[] = $service->getUrls($path, $this->getImageType());
        }

        return $urls;
    }

    /**
     * Verifica si la imagen ha sido procesada con el nuevo sistema
     */
    public function hasProcessedImage(): bool
    {
        $field = $this->getImageField();
        $path = $this->{$field};

        return !empty($path) && str_contains($path, '/originals/');
    }

    /**
     * Boot del trait: agregar accessors a appends si no existen
     */
    public static function bootHasProcessedImages(): void
    {
        // Los accessors se agregan automáticamente cuando se acceden
    }

    /**
     * Obtiene los atributos que deben agregarse a la serialización
     */
    protected function getProcessedImageAppends(): array
    {
        return ['image_url', 'thumbnail_url', 'webp_url', 'image_urls'];
    }
}
