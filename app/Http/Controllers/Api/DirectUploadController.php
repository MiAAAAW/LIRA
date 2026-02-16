<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\CloudflareMediaService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Controller para manejar uploads directos a Cloudflare R2
 *
 * Flujo:
 * 1. Cliente solicita URL firmada (getPresignedUrl)
 * 2. Cliente sube archivo directo a R2 usando la URL
 * 3. Cliente confirma upload completado (confirmUpload)
 */
class DirectUploadController extends Controller
{
    public function __construct(
        protected CloudflareMediaService $r2Service
    ) {}

    /**
     * Obtener URL firmada para upload directo
     *
     * POST /api/upload/presigned
     * Body: { type: 'videos'|'audios', filename: 'video.mp4', contentType: 'video/mp4', fileSize: 123456 }
     */
    public function getPresignedUrl(Request $request): JsonResponse
    {
        // Obtener límite máximo de config para validación inicial
        $maxGlobalSize = config('pandilla.direct_upload.videos.max_size', 5 * 1024 * 1024 * 1024);

        $validated = $request->validate([
            'type' => 'required|in:videos,audios,thumbnails,documents,documents/distinciones,documents/publicaciones,hero,music',
            'filename' => 'required|string|max:255',
            'contentType' => 'required|string|max:100',
            'fileSize' => "required|integer|min:1|max:{$maxGlobalSize}",
        ]);

        // Validar tipos de archivo permitidos (desde config)
        $allowedTypes = $this->getAllowedContentTypes($validated['type']);
        if (!in_array($validated['contentType'], $allowedTypes)) {
            return response()->json([
                'error' => 'Tipo de archivo no permitido',
                'allowed' => $allowedTypes,
            ], 422);
        }

        // Validar tamaño máximo según tipo (desde config)
        $maxSize = $this->getMaxFileSize($validated['type']);
        if ($validated['fileSize'] > $maxSize) {
            return response()->json([
                'error' => 'Archivo demasiado grande',
                'maxSize' => $maxSize,
                'maxSizeFormatted' => $this->formatBytes($maxSize),
            ], 422);
        }

        if (!$this->r2Service->isConfigured()) {
            return response()->json([
                'error' => 'Cloudflare R2 no está configurado',
            ], 503);
        }

        try {
            $expiryMinutes = config('pandilla.direct_upload.presigned_url_expiry', 60);

            $result = $this->r2Service->getPresignedUploadUrl(
                $validated['type'],
                $validated['filename'],
                $validated['contentType'],
                $expiryMinutes
            );

            return response()->json([
                'success' => true,
                'key' => $result['key'],
                'uploadUrl' => $result['uploadUrl'],
                'publicUrl' => $result['publicUrl'],
                'expiresIn' => $expiryMinutes * 60, // segundos
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error al generar URL de upload',
                'message' => config('app.debug') ? $e->getMessage() : 'Error interno',
            ], 500);
        }
    }

    /**
     * Confirmar que el upload se completó
     *
     * POST /api/upload/confirm
     * Body: { key: 'videos/uuid.mp4' }
     */
    public function confirmUpload(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'key' => 'required|string|max:500',
        ]);

        if (!$this->r2Service->isConfigured()) {
            return response()->json([
                'error' => 'Cloudflare R2 no está configurado',
            ], 503);
        }

        try {
            if (!$this->r2Service->verifyUpload($validated['key'])) {
                return response()->json([
                    'error' => 'Archivo no encontrado en R2',
                ], 404);
            }

            $metadata = $this->r2Service->getFileMetadata($validated['key']);

            return response()->json([
                'success' => true,
                'verified' => true,
                'key' => $validated['key'],
                'url' => $metadata['url'] ?? null,
                'size' => $metadata['size'] ?? null,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error al verificar upload',
                'message' => config('app.debug') ? $e->getMessage() : 'Error interno',
            ], 500);
        }
    }

    /**
     * Obtener tipo base para config (documents/distinciones -> documents)
     */
    protected function getBaseType(string $type): string
    {
        return explode('/', $type)[0];
    }

    /**
     * Obtener tipos de contenido permitidos según tipo de media (desde config)
     */
    protected function getAllowedContentTypes(string $type): array
    {
        $baseType = $this->getBaseType($type);
        return config("pandilla.direct_upload.{$baseType}.mime_types", []);
    }

    /**
     * Obtener tamaño máximo según tipo en bytes (desde config)
     */
    protected function getMaxFileSize(string $type): int
    {
        $baseType = $this->getBaseType($type);
        return config("pandilla.direct_upload.{$baseType}.max_size", 100 * 1024 * 1024);
    }

    /**
     * Formatear bytes a texto legible
     */
    protected function formatBytes(int $bytes): string
    {
        $units = ['B', 'KB', 'MB', 'GB'];
        $power = floor(log($bytes, 1024));
        return round($bytes / pow(1024, $power), 2) . ' ' . $units[$power];
    }
}
