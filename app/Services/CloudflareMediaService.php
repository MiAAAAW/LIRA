<?php

namespace App\Services;

use Aws\S3\S3Client;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

/**
 * Servicio para gestionar media (videos y audios) en Cloudflare R2
 *
 * Estructura del bucket:
 * lirapuno/
 * ├── videos/     → archivos de video
 * ├── audios/     → archivos de audio
 * └── thumbnails/ → miniaturas
 */
class CloudflareMediaService
{
    protected const DISK = 'r2';
    protected const URL_EXPIRATION_MINUTES = 60;

    protected ?S3Client $s3Client = null;

    // Tipos de media soportados
    public const TYPE_VIDEO = 'videos';
    public const TYPE_AUDIO = 'audios';
    public const TYPE_THUMBNAIL = 'thumbnails';
    public const TYPE_DOCUMENT = 'documents';

    /**
     * Verificar si el servicio está configurado
     */
    public function isConfigured(): bool
    {
        return !empty(config('filesystems.disks.r2.key'))
            && !empty(config('filesystems.disks.r2.secret'))
            && !empty(config('filesystems.disks.r2.endpoint'));
    }

    /**
     * Subir un video a R2
     */
    public function uploadVideo(UploadedFile $file): array
    {
        return $this->uploadMedia($file, self::TYPE_VIDEO);
    }

    /**
     * Subir un audio a R2
     */
    public function uploadAudio(UploadedFile $file): array
    {
        return $this->uploadMedia($file, self::TYPE_AUDIO);
    }

    /**
     * Subir archivo de media genérico
     *
     * @param UploadedFile $file
     * @param string $type Tipo: 'videos', 'audios', 'thumbnails'
     * @return array{key: string, url: string}
     */
    public function uploadMedia(UploadedFile $file, string $type): array
    {
        $this->validateType($type);

        $extension = $file->getClientOriginalExtension();
        $key = $type . '/' . Str::uuid() . '.' . $extension;

        try {
            Storage::disk(self::DISK)->put($key, file_get_contents($file->getRealPath()), [
                'ContentType' => $file->getMimeType(),
            ]);

            $url = $this->getPublicUrl($key);

            Log::info("Archivo subido a Cloudflare R2", [
                'type' => $type,
                'key' => $key,
                'size' => $file->getSize(),
            ]);

            return [
                'key' => $key,
                'url' => $url,
            ];
        } catch (\Exception $e) {
            Log::error("Error al subir archivo a Cloudflare R2", [
                'type' => $type,
                'error' => $e->getMessage(),
            ]);
            throw $e;
        }
    }

    /**
     * Obtener URL pública
     */
    public function getPublicUrl(string $key): string
    {
        return Storage::disk(self::DISK)->url($key);
    }

    /**
     * Obtener URL firmada (temporal)
     */
    public function getSignedUrl(string $key, int $minutes = null): string
    {
        $minutes = $minutes ?? self::URL_EXPIRATION_MINUTES;

        return Storage::disk(self::DISK)->temporaryUrl(
            $key,
            now()->addMinutes($minutes)
        );
    }

    /**
     * Eliminar archivo de R2
     */
    public function delete(string $key): bool
    {
        try {
            if ($this->exists($key)) {
                Storage::disk(self::DISK)->delete($key);
                Log::info("Archivo eliminado de Cloudflare R2", ['key' => $key]);
            }
            return true;
        } catch (\Exception $e) {
            Log::error("Error al eliminar archivo de Cloudflare R2", [
                'key' => $key,
                'error' => $e->getMessage(),
            ]);
            return false;
        }
    }

    /**
     * Eliminar video (alias para compatibilidad)
     */
    public function deleteVideo(string $key): bool
    {
        return $this->delete($key);
    }

    /**
     * Eliminar audio
     */
    public function deleteAudio(string $key): bool
    {
        return $this->delete($key);
    }

    /**
     * Verificar si un archivo existe
     */
    public function exists(string $key): bool
    {
        return Storage::disk(self::DISK)->exists($key);
    }

    /**
     * Subir thumbnail
     */
    public function uploadThumbnail(UploadedFile $file, string $relatedKey = null): array
    {
        if ($relatedKey) {
            // Generar nombre basado en el archivo relacionado
            $info = pathinfo($relatedKey);
            $key = self::TYPE_THUMBNAIL . '/' . $info['filename'] . '_thumb.jpg';
        } else {
            $extension = $file->getClientOriginalExtension();
            $key = self::TYPE_THUMBNAIL . '/' . Str::uuid() . '.' . $extension;
        }

        try {
            Storage::disk(self::DISK)->put($key, file_get_contents($file->getRealPath()), [
                'ContentType' => $file->getMimeType(),
            ]);

            return [
                'key' => $key,
                'url' => $this->getPublicUrl($key),
            ];
        } catch (\Exception $e) {
            Log::error("Error al subir thumbnail a Cloudflare R2", [
                'error' => $e->getMessage(),
            ]);
            throw $e;
        }
    }

    /**
     * Validar tipo de media
     */
    protected function validateType(string $type): void
    {
        $validTypes = [self::TYPE_VIDEO, self::TYPE_AUDIO, self::TYPE_THUMBNAIL, self::TYPE_DOCUMENT];

        if (!in_array($type, $validTypes)) {
            throw new \InvalidArgumentException(
                "Tipo de media inválido: {$type}. Válidos: " . implode(', ', $validTypes)
            );
        }
    }

    /**
     * Obtener cliente S3 configurado para R2
     * Se crea una sola vez y se reutiliza
     */
    protected function getS3Client(): S3Client
    {
        if ($this->s3Client === null) {
            $accountId = config('filesystems.disks.r2.endpoint')
                ? null
                : config('services.cloudflare.account_id');

            $endpoint = config('filesystems.disks.r2.endpoint')
                ?? 'https://' . config('services.cloudflare.account_id') . '.r2.cloudflarestorage.com';

            $this->s3Client = new S3Client([
                'version' => 'latest',
                'region' => config('filesystems.disks.r2.region', 'auto'),
                'endpoint' => $endpoint,
                'use_path_style_endpoint' => config('filesystems.disks.r2.use_path_style_endpoint', false),
                'credentials' => [
                    'key' => config('filesystems.disks.r2.key'),
                    'secret' => config('filesystems.disks.r2.secret'),
                ],
            ]);
        }

        return $this->s3Client;
    }

    /**
     * Generar URL firmada para upload directo desde el cliente
     * El cliente puede subir directamente a R2 sin pasar por el servidor
     *
     * @param string $type Tipo: 'videos', 'audios', 'thumbnails'
     * @param string $filename Nombre original del archivo
     * @param string $contentType MIME type del archivo
     * @param int $expiresInMinutes Tiempo de validez de la URL
     * @return array{key: string, uploadUrl: string, publicUrl: string}
     */
    public function getPresignedUploadUrl(
        string $type,
        string $filename,
        string $contentType,
        int $expiresInMinutes = 60
    ): array {
        $this->validateType($type);

        $extension = pathinfo($filename, PATHINFO_EXTENSION);
        $key = $type . '/' . Str::uuid() . '.' . $extension;

        try {
            $client = $this->getS3Client();
            $bucket = config('filesystems.disks.r2.bucket');

            // Crear comando para PUT con el content type correcto
            $command = $client->getCommand('PutObject', [
                'Bucket' => $bucket,
                'Key' => $key,
                'ContentType' => $contentType,
            ]);

            // Generar URL firmada
            $request = $client->createPresignedRequest(
                $command,
                '+' . $expiresInMinutes . ' minutes'
            );

            $uploadUrl = (string) $request->getUri();
            $publicUrl = $this->getPublicUrl($key);

            Log::info("Presigned URL generada para upload directo", [
                'type' => $type,
                'key' => $key,
                'contentType' => $contentType,
            ]);

            return [
                'key' => $key,
                'uploadUrl' => $uploadUrl,
                'publicUrl' => $publicUrl,
            ];
        } catch (\Exception $e) {
            Log::error("Error al generar presigned URL", [
                'type' => $type,
                'error' => $e->getMessage(),
            ]);
            throw $e;
        }
    }

    /**
     * Verificar que un archivo fue subido correctamente via direct upload
     */
    public function verifyUpload(string $key): bool
    {
        return $this->exists($key);
    }

    /**
     * Obtener metadatos de un archivo
     */
    public function getFileMetadata(string $key): ?array
    {
        if (!$this->exists($key)) {
            return null;
        }

        try {
            return [
                'key' => $key,
                'size' => Storage::disk(self::DISK)->size($key),
                'lastModified' => Storage::disk(self::DISK)->lastModified($key),
                'url' => $this->getPublicUrl($key),
            ];
        } catch (\Exception $e) {
            Log::error("Error al obtener metadatos", [
                'key' => $key,
                'error' => $e->getMessage(),
            ]);
            return null;
        }
    }
}
