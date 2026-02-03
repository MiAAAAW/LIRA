<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\Laravel\Facades\Image;
use Intervention\Image\Interfaces\ImageInterface;

class ImageProcessingService
{
    protected string $disk = 'public';
    protected string $basePath = 'pandilla/images';

    /**
     * Procesa una imagen y genera todas las variantes
     *
     * @param UploadedFile $file Archivo subido
     * @param string $type Tipo de imagen (estandartes, presidentes, etc.)
     * @param string|null $oldPath Path anterior para eliminar
     * @return array Paths de las variantes generadas
     */
    public function process(UploadedFile $file, string $type, ?string $oldPath = null): array
    {
        // Eliminar imagen anterior si existe
        if ($oldPath) {
            $this->delete($oldPath, $type);
        }

        $config = $this->getConfig($type);
        $filename = $this->generateFilename($file);
        $extension = strtolower($file->getClientOriginalExtension());

        // Crear imagen con Intervention
        $image = Image::read($file);

        // Generar variantes
        $paths = [];

        // Original (redimensionado y comprimido)
        $paths['original'] = $this->saveOriginal($image, $type, $filename, $extension, $config);

        // Thumbnail
        $paths['thumbnail'] = $this->saveThumbnail($image, $type, $filename, $extension, $config);

        // WebP (si está habilitado)
        if (config('pandilla.webp.enabled', true)) {
            $paths['webp'] = $this->saveWebp($image, $type, $filename, $config);
        }

        return $paths;
    }

    /**
     * Elimina todas las variantes de una imagen
     *
     * @param string $originalPath Path del archivo original en storage
     * @param string $type Tipo de imagen (reservado para futuras extensiones)
     */
    public function delete(string $originalPath, string $type = ''): void
    {
        $storage = Storage::disk($this->disk);

        // Eliminar original
        if ($storage->exists($originalPath)) {
            $storage->delete($originalPath);
        }

        // Derivar paths de thumbnail y webp
        $pathInfo = pathinfo($originalPath);
        $dir = dirname($originalPath);
        $filename = $pathInfo['filename'];

        // El original está en: type/originals/filename.ext
        // Thumbnail está en: type/thumbnails/filename.ext
        // WebP está en: type/webp/filename.webp
        $thumbnailPath = str_replace('/originals/', '/thumbnails/', $originalPath);
        $webpPath = str_replace('/originals/', '/webp/', $dir) . '/' . $filename . '.webp';

        if ($storage->exists($thumbnailPath)) {
            $storage->delete($thumbnailPath);
        }

        if ($storage->exists($webpPath)) {
            $storage->delete($webpPath);
        }
    }

    /**
     * Obtiene URLs de todas las variantes de una imagen
     */
    public function getUrls(string $originalPath, string $type): array
    {
        if (empty($originalPath)) {
            return [
                'original' => null,
                'thumbnail' => null,
                'webp' => null,
            ];
        }

        $pathInfo = pathinfo($originalPath);
        $dir = dirname($originalPath);
        $filename = $pathInfo['filename'];

        $thumbnailPath = str_replace('/originals/', '/thumbnails/', $originalPath);
        $webpPath = str_replace('/originals/', '/webp/', $dir) . '/' . $filename . '.webp';

        return [
            'original' => Storage::disk($this->disk)->url($originalPath),
            'thumbnail' => Storage::disk($this->disk)->url($thumbnailPath),
            'webp' => config('pandilla.webp.enabled', true)
                ? Storage::disk($this->disk)->url($webpPath)
                : null,
        ];
    }

    /**
     * Guarda la versión original redimensionada
     */
    protected function saveOriginal(
        ImageInterface $image,
        string $type,
        string $filename,
        string $extension,
        array $config
    ): string {
        $path = "{$this->basePath}/{$type}/originals/{$filename}.{$extension}";

        // Redimensionar manteniendo aspecto o forzando dimensiones
        $resized = $this->resizeImage(
            clone $image,
            $config['original']['width'],
            $config['original']['height'],
            $config['aspect'] ?? 'flexible'
        );

        // Codificar con calidad especificada
        $encoded = $this->encodeImage($resized, $extension, $config['quality']);

        Storage::disk($this->disk)->put($path, $encoded);

        return $path;
    }

    /**
     * Guarda el thumbnail
     */
    protected function saveThumbnail(
        ImageInterface $image,
        string $type,
        string $filename,
        string $extension,
        array $config
    ): string {
        $path = "{$this->basePath}/{$type}/thumbnails/{$filename}.{$extension}";

        $resized = $this->resizeImage(
            clone $image,
            $config['thumbnail']['width'],
            $config['thumbnail']['height'],
            $config['aspect'] ?? 'flexible'
        );

        $encoded = $this->encodeImage($resized, $extension, $config['quality']);

        Storage::disk($this->disk)->put($path, $encoded);

        return $path;
    }

    /**
     * Guarda la versión WebP
     */
    protected function saveWebp(
        ImageInterface $image,
        string $type,
        string $filename,
        array $config
    ): string {
        $path = "{$this->basePath}/{$type}/webp/{$filename}.webp";
        $quality = config('pandilla.webp.quality', 80);

        $resized = $this->resizeImage(
            clone $image,
            $config['original']['width'],
            $config['original']['height'],
            $config['aspect'] ?? 'flexible'
        );

        $encoded = $resized->toWebp($quality);

        Storage::disk($this->disk)->put($path, $encoded);

        return $path;
    }

    /**
     * Redimensiona imagen según aspecto
     */
    protected function resizeImage(
        ImageInterface $image,
        int $width,
        int $height,
        string $aspect
    ): ImageInterface {
        if ($aspect === 'flexible') {
            // Mantiene aspecto original, ajusta al máximo
            return $image->scaleDown($width, $height);
        }

        // Aspecto fijo: cover (crop centrado)
        return $image->cover($width, $height);
    }

    /**
     * Codifica imagen al formato especificado
     */
    protected function encodeImage(ImageInterface $image, string $extension, int $quality): string
    {
        return match (strtolower($extension)) {
            'png' => $image->toPng()->toString(),
            'gif' => $image->toGif()->toString(),
            'webp' => $image->toWebp($quality)->toString(),
            default => $image->toJpeg($quality)->toString(),
        };
    }

    /**
     * Genera nombre de archivo único
     */
    protected function generateFilename(UploadedFile $file): string
    {
        $originalName = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        $slug = Str::slug($originalName);
        $timestamp = now()->format('YmdHis');
        $random = Str::random(6);

        return "{$slug}-{$timestamp}-{$random}";
    }

    /**
     * Obtiene configuración para un tipo de imagen
     */
    protected function getConfig(string $type): array
    {
        $config = config("pandilla.image_sizes.{$type}");

        if (!$config) {
            // Configuración por defecto si el tipo no existe
            return [
                'original' => ['width' => 800, 'height' => 600],
                'thumbnail' => ['width' => 300, 'height' => 225],
                'quality' => 85,
                'aspect' => 'flexible',
            ];
        }

        return $config;
    }

    /**
     * Procesa múltiples imágenes para galería
     */
    public function processGallery(array $files, string $type, ?array $oldPaths = null): array
    {
        // Eliminar imágenes anteriores
        if ($oldPaths) {
            foreach ($oldPaths as $oldPath) {
                $this->delete($oldPath, $type);
            }
        }

        $paths = [];
        foreach ($files as $file) {
            if ($file instanceof UploadedFile) {
                $result = $this->process($file, $type);
                $paths[] = $result['original'];
            }
        }

        return $paths;
    }

    /**
     * Procesa una imagen existente desde su path en storage
     * Usado principalmente para migración de imágenes antiguas
     *
     * @param string $existingPath Path de la imagen existente en storage
     * @param string $type Tipo de imagen
     * @return array|null Paths de las variantes generadas o null si falla
     */
    public function processFromPath(string $existingPath, string $type): ?array
    {
        $storage = Storage::disk($this->disk);

        if (!$storage->exists($existingPath)) {
            return null;
        }

        $fullPath = $storage->path($existingPath);
        $image = Image::read($fullPath);

        $config = $this->getConfig($type);
        $pathInfo = pathinfo($existingPath);
        $extension = strtolower($pathInfo['extension'] ?? 'jpg');

        // Generar nombre único para migración
        $filename = $pathInfo['filename'] . '-migrated-' . now()->format('YmdHis') . '-' . Str::random(4);

        $paths = [];

        // Original procesado
        $paths['original'] = $this->saveOriginal($image, $type, $filename, $extension, $config);

        // Thumbnail
        $paths['thumbnail'] = $this->saveThumbnail($image, $type, $filename, $extension, $config);

        // WebP
        if (config('pandilla.webp.enabled', true)) {
            $paths['webp'] = $this->saveWebp($image, $type, $filename, $config);
        }

        return $paths;
    }
}
