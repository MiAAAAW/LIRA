import { useState, useRef, useCallback, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/Components/ui/button';
import { Progress } from '@/Components/ui/progress';
import DynamicIcon from '@/Components/DynamicIcon';

/**
 * Componente de upload directo a Cloudflare R2
 *
 * Características:
 * - Upload directo al CDN (sin pasar por servidor)
 * - Progress bar real con porcentaje
 * - Soporte hasta 5GB para videos
 * - Drag & drop
 * - Validación de tipo y tamaño
 */
export default function DirectUpload({
  label,
  name,
  type = 'videos', // 'videos' | 'audios' | 'thumbnails'
  accept,
  maxSize,
  required = false,
  helpText,
  error,
  onChange,
  onUploadingChange, // callback(bool) - notifica al padre si hay un upload en curso
  value,
  className,
  existingFile = null, // { url, key, name } - archivo ya existente (para edición)
}) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState(value || null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [keepExisting, setKeepExisting] = useState(!!existingFile?.url);
  const inputRef = useRef(null);
  const abortControllerRef = useRef(null);

  // Reset state cuando cambia el archivo existente (ej: abrir otro item para editar)
  useEffect(() => {
    setKeepExisting(!!existingFile?.url);
    setUploadedFile(value || null);
    setUploadError(null);
    setProgress(0);
  }, [existingFile?.url, existingFile?.key, value]);

  // Si hay archivo existente y no hemos subido uno nuevo, mostrarlo
  const hasExistingFile = existingFile?.url && keepExisting && !uploadedFile;

  // Configuración por tipo
  const config = {
    videos: {
      accept: accept || 'video/mp4,video/webm,video/quicktime',
      maxSize: maxSize || 5 * 1024 * 1024 * 1024, // 5GB
      icon: 'Video',
      label: 'video',
    },
    audios: {
      accept: accept || 'audio/mpeg,audio/wav,audio/ogg,audio/mp4',
      maxSize: maxSize || 500 * 1024 * 1024, // 500MB
      icon: 'Music',
      label: 'audio',
    },
    thumbnails: {
      accept: accept || 'image/jpeg,image/png,image/webp',
      maxSize: maxSize || 10 * 1024 * 1024, // 10MB
      icon: 'Image',
      label: 'imagen',
    },
    documents: {
      accept: accept || 'application/pdf',
      maxSize: maxSize || 50 * 1024 * 1024, // 50MB
      icon: 'FileText',
      label: 'documento PDF',
    },
    'documents/distinciones': {
      accept: accept || 'application/pdf',
      maxSize: maxSize || 50 * 1024 * 1024, // 50MB
      icon: 'FileText',
      label: 'documento PDF',
    },
    'documents/ley24325': {
      accept: accept || 'application/pdf',
      maxSize: maxSize || 50 * 1024 * 1024, // 50MB
      icon: 'FileText',
      label: 'documento PDF',
    },
    'documents/baselegal': {
      accept: accept || 'application/pdf',
      maxSize: maxSize || 50 * 1024 * 1024, // 50MB
      icon: 'FileText',
      label: 'documento PDF',
    },
    'documents/indecopi': {
      accept: accept || 'application/pdf',
      maxSize: maxSize || 50 * 1024 * 1024, // 50MB
      icon: 'FileText',
      label: 'documento PDF',
    },
    'documents/publicaciones': {
      accept: accept || 'application/pdf',
      maxSize: maxSize || 50 * 1024 * 1024, // 50MB
      icon: 'FileText',
      label: 'documento PDF',
    },
    images: {
      accept: accept || 'image/jpeg,image/png,image/webp',
      maxSize: maxSize || 10 * 1024 * 1024, // 10MB
      icon: 'Image',
      label: 'imagen',
    },
    'images/estandartes': {
      accept: accept || 'image/jpeg,image/png,image/webp',
      maxSize: maxSize || 10 * 1024 * 1024, // 10MB
      icon: 'Image',
      label: 'imagen',
    },
    'images/comunicados': {
      accept: accept || 'image/jpeg,image/png,image/webp',
      maxSize: maxSize || 10 * 1024 * 1024, // 10MB
      icon: 'Image',
      label: 'imagen',
    },
    'images/publicaciones': {
      accept: accept || 'image/jpeg,image/png,image/webp',
      maxSize: maxSize || 10 * 1024 * 1024, // 10MB
      icon: 'Image',
      label: 'imagen',
    },
    hero: {
      accept: accept || 'video/mp4,video/webm,video/quicktime,image/jpeg,image/png,image/webp',
      maxSize: maxSize || 5 * 1024 * 1024 * 1024, // 5GB
      icon: 'Monitor',
      label: 'video o imagen',
    },
    music: {
      accept: accept || 'audio/mpeg,audio/wav,audio/ogg,audio/mp4',
      maxSize: maxSize || 500 * 1024 * 1024, // 500MB
      icon: 'Music2',
      label: 'archivo de audio',
    },
  };

  // Tipo base para matching: 'documents/publicaciones' → 'documents'
  const baseType = type.includes('/') ? type.split('/')[0] : type;
  const currentConfig = config[type] || config[baseType] || config.videos;

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const uploadFile = async (file) => {
    setUploadError(null);
    setUploading(true);
    setProgress(0);
    onUploadingChange?.(true);

    try {
      // 1. Obtener URL firmada del servidor
      const presignedResponse = await fetch(route('admin.upload.presigned'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content,
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          type,
          filename: file.name,
          contentType: file.type,
          fileSize: file.size,
        }),
      });

      if (!presignedResponse.ok) {
        // 419 = sesión expirada (CSRF), 503 = R2 no configurado
        if (presignedResponse.status === 419) {
          throw new Error('Sesión expirada. Recarga la página e intenta de nuevo.');
        }
        if (presignedResponse.status === 503) {
          throw new Error('Servicio de almacenamiento no configurado. Contacta al administrador.');
        }
        try {
          const errorData = await presignedResponse.json();
          throw new Error(errorData.error || errorData.message || 'Error al obtener URL de upload');
        } catch (parseErr) {
          if (parseErr.message.includes('Sesión') || parseErr.message.includes('Servicio') || parseErr.message.includes('Error al')) {
            throw parseErr;
          }
          throw new Error(`Error del servidor (${presignedResponse.status}). Recarga la página.`);
        }
      }

      const { key, uploadUrl, publicUrl } = await presignedResponse.json();

      // 2. Subir archivo directo a R2 con progress
      abortControllerRef.current = new AbortController();

      await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const percent = Math.round((e.loaded / e.total) * 100);
            setProgress(percent);
          }
        });

        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve();
          } else {
            reject(new Error(`Upload failed: ${xhr.status}`));
          }
        });

        xhr.addEventListener('error', () => reject(new Error('Error de red')));
        xhr.addEventListener('abort', () => reject(new Error('Upload cancelado')));

        xhr.open('PUT', uploadUrl);
        xhr.setRequestHeader('Content-Type', file.type);
        xhr.send(file);

        // Guardar referencia para poder cancelar
        abortControllerRef.current.abort = () => xhr.abort();
      });

      // 3. Confirmar upload completado
      const confirmResponse = await fetch(route('admin.upload.confirm'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content,
          'Accept': 'application/json',
        },
        body: JSON.stringify({ key }),
      });

      if (!confirmResponse.ok) {
        throw new Error('Error al confirmar upload');
      }

      // 4. Éxito - guardar resultado
      const result = {
        key,
        url: publicUrl,
        name: file.name,
        size: file.size,
        type: file.type,
      };

      setUploadedFile(result);
      setProgress(100);

      // Notificar al padre
      if (onChange) {
        onChange(name, result);
      }

    } catch (err) {
      console.error('Upload error:', err);
      setUploadError(err.message);
      setProgress(0);
    } finally {
      setUploading(false);
      onUploadingChange?.(false);
      abortControllerRef.current = null;
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tamaño
    if (file.size > currentConfig.maxSize) {
      setUploadError(`El archivo es muy grande. Máximo: ${formatFileSize(currentConfig.maxSize)}`);
      return;
    }

    uploadFile(file);
  };

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (file.size > currentConfig.maxSize) {
      setUploadError(`El archivo es muy grande. Máximo: ${formatFileSize(currentConfig.maxSize)}`);
      return;
    }

    uploadFile(file);
  }, [currentConfig.maxSize]);

  const cancelUpload = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setUploading(false);
    setProgress(0);
  };

  const removeFile = () => {
    setUploadedFile(null);
    setProgress(0);
    setUploadError(null);
    if (onChange) {
      onChange(name, null);
    }
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const displayError = error || uploadError;

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Zona de drop / Estado de upload */}
      <div
        className={cn(
          'relative border-2 border-dashed rounded-lg transition-all',
          dragActive
            ? 'border-primary bg-primary/5'
            : uploadedFile
            ? 'border-green-500 bg-green-50 dark:bg-green-950/20'
            : hasExistingFile
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20'
            : displayError
            ? 'border-red-500 bg-red-50 dark:bg-red-950/20'
            : 'border-gray-300 dark:border-gray-700 hover:border-gray-400',
          uploading && 'pointer-events-none'
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {/* Input oculto cuando hay archivo existente para evitar conflictos con video controls */}
        {!hasExistingFile && (
          <input
            ref={inputRef}
            type="file"
            accept={currentConfig.accept}
            onChange={handleFileSelect}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
            disabled={uploading}
          />
        )}

        <div className="p-6 text-center">
          {uploading ? (
            // Estado: Subiendo
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-3">
                <DynamicIcon name="Loader2" className="h-8 w-8 text-primary animate-spin" />
                <div className="text-left">
                  <p className="font-medium">
                    {progress >= 100 ? 'Confirmando subida...' : 'Subiendo al CDN...'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {progress >= 100 ? 'Verificando con el servidor' : `${progress}% completado`}
                  </p>
                </div>
              </div>
              <Progress value={progress >= 100 ? 100 : progress} className="h-3" />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={cancelUpload}
              >
                <DynamicIcon name="X" className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
            </div>
          ) : uploadedFile ? (
            // Estado: Archivo nuevo subido
            <div className="space-y-3">
              <div className="flex items-center justify-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-full">
                  <DynamicIcon name="Check" className="h-6 w-6 text-green-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-green-700 dark:text-green-400">
                    Archivo subido
                  </p>
                  <p className="text-sm text-gray-500 truncate max-w-[200px]">
                    {uploadedFile.name}
                  </p>
                  <p className="text-xs text-gray-400">
                    {formatFileSize(uploadedFile.size)}
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={removeFile}
              >
                <DynamicIcon name="Trash2" className="h-4 w-4 mr-2" />
                Eliminar y subir otro
              </Button>
            </div>
          ) : hasExistingFile ? (
            // Estado: Archivo existente (modo edición)
            <div className="space-y-3">
              {/* Preview del video/audio/imagen/documento existente */}
              <div className="relative mx-auto max-w-[280px] rounded-lg overflow-hidden bg-muted">
                {(() => {
                  // Detect media type from URL extension for mixed types like 'hero'
                  const url = existingFile.url || '';
                  const ext = url.split('?')[0].split('.').pop()?.toLowerCase();
                  const isVideo = baseType === 'videos' || (baseType === 'hero' && ['mp4', 'webm', 'mov'].includes(ext));
                  const isAudio = baseType === 'audios' || baseType === 'music';
                  const isDocument = baseType === 'documents';

                  if (isVideo) return (
                    <video
                      src={existingFile.url}
                      className="w-full aspect-video object-cover"
                      controls
                      preload="metadata"
                    />
                  );
                  if (isAudio) return (
                    <div className="p-4 flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-full">
                        <DynamicIcon name="Music" className="h-6 w-6 text-primary" />
                      </div>
                      <audio src={existingFile.url} controls className="flex-1" preload="metadata" />
                    </div>
                  );
                  if (isDocument) return (
                    <div className="p-4 flex flex-col items-center gap-3">
                      <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
                        <DynamicIcon name="FileText" className="h-8 w-8 text-red-600" />
                      </div>
                      <a
                        href={existingFile.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline"
                      >
                        Ver documento PDF
                      </a>
                    </div>
                  );
                  return (
                    <img
                      src={existingFile.url}
                      alt={existingFile.name || 'Imagen existente'}
                      className="w-full aspect-video object-cover"
                    />
                  );
                })()}
              </div>

              <div className="flex items-center justify-center gap-2">
                <div className="p-1.5 bg-blue-100 dark:bg-blue-900 rounded-full">
                  <DynamicIcon name="FileCheck" className="h-4 w-4 text-blue-600" />
                </div>
                <p className="text-sm font-medium text-blue-700 dark:text-blue-400">
                  {existingFile.name || 'Archivo actual'}
                </p>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setKeepExisting(false)}
              >
                <DynamicIcon name="RefreshCw" className="h-4 w-4 mr-2" />
                Reemplazar {currentConfig.label}
              </Button>
            </div>
          ) : (
            // Estado: Esperando archivo
            <div className="space-y-2">
              <DynamicIcon
                name={currentConfig.icon}
                className="h-12 w-12 mx-auto text-gray-400"
              />
              <div>
                <p className="font-medium text-gray-700 dark:text-gray-200">
                  Arrastra tu {currentConfig.label} aquí
                </p>
                <p className="text-sm text-gray-500">
                  o haz clic para seleccionar
                </p>
              </div>
              <p className="text-xs text-gray-400">
                Máximo {formatFileSize(currentConfig.maxSize)}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Help text */}
      {helpText && !displayError && (
        <p className="text-xs text-gray-500">{helpText}</p>
      )}

      {/* Error */}
      {displayError && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          <DynamicIcon name="AlertCircle" className="h-3 w-3" />
          {displayError}
        </p>
      )}
    </div>
  );
}
