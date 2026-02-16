import { useState, useRef, useEffect } from 'react';
import { cn, storageUrl } from '@/lib/utils';
import { Button } from '@/Components/ui/button';
import DynamicIcon from '@/Components/DynamicIcon';

// Format file size for display
const formatFileSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
};

export default function FileUpload({
  label,
  name,
  value,
  onChange,
  error,
  accept = 'image/*',
  maxSize = 5 * 1024 * 1024, // 5MB default, can be overridden
  preview = true,
  required = false,
  helpText,
  className,
}) {
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const inputRef = useRef(null);

  // Cleanup blob URLs para evitar memory leaks
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Detect if this is a video upload based on accept attribute
  const isVideoUpload = accept?.includes('video');

  // For video uploads, allow much larger files (500MB default)
  const effectiveMaxSize = isVideoUpload ? Math.max(maxSize, 500 * 1024 * 1024) : maxSize;

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleFile = (file) => {
    if (file.size > effectiveMaxSize) {
      alert(`El archivo es muy grande. Máximo ${formatFileSize(effectiveMaxSize)}`);
      return;
    }

    onChange(name, file);

    if (preview && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => setPreviewUrl(reader.result);
      reader.readAsDataURL(file);
    } else {
      // For non-image files (videos), clear any previous preview
      setPreviewUrl(null);
    }
  };

  const handleRemove = () => {
    onChange(name, null);
    setPreviewUrl(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const currentPreview = previewUrl || (typeof value === 'string' ? storageUrl(value) : null);
  const fileName = value instanceof File ? value.name : null;
  const fileSize = value instanceof File ? value.size : null;

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Preview */}
      {currentPreview && preview && accept.includes('image') && (
        <div className="relative inline-block">
          <img
            src={currentPreview}
            alt="Preview"
            className="h-32 w-32 rounded-lg object-cover border dark:border-gray-700"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute -top-2 -right-2 h-6 w-6"
            onClick={handleRemove}
          >
            <DynamicIcon name="X" className="h-3 w-3" />
          </Button>
        </div>
      )}

      {/* Drop Zone */}
      {!currentPreview && (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={cn(
            "flex items-center gap-3 p-3 border-2 border-dashed rounded-lg cursor-pointer transition-colors",
            dragActive
              ? "border-primary bg-primary/5"
              : "border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600",
            error && "border-red-500"
          )}
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
            <DynamicIcon name="Upload" className="h-4 w-4 text-gray-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Arrastra o haz clic para seleccionar
            </p>
            <p className="text-xs text-gray-400">
              Máximo {formatFileSize(effectiveMaxSize)}
            </p>
          </div>
        </div>
      )}

      {/* File Name - Enhanced for video files */}
      {fileName && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 border dark:border-gray-700">
          <DynamicIcon
            name={isVideoUpload ? "Film" : "FileCheck"}
            className={cn("h-5 w-5", isVideoUpload ? "text-orange-500" : "text-green-500")}
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
              {fileName}
            </p>
            {fileSize && (
              <p className="text-xs text-gray-500">
                {formatFileSize(fileSize)}
                {isVideoUpload && " - Listo para subir al CDN"}
              </p>
            )}
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleRemove}
            className="h-8 px-2 text-gray-400 hover:text-red-500"
          >
            <DynamicIcon name="X" className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Hidden Input */}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
      />

      {/* Help Text */}
      {helpText && !error && (
        <p className="text-sm text-gray-500">{helpText}</p>
      )}

      {/* Error */}
      {error && (
        <p className="text-sm text-red-500 flex items-center gap-1">
          <DynamicIcon name="AlertCircle" className="h-3 w-3" />
          {error}
        </p>
      )}
    </div>
  );
}

export function ImageGalleryUpload({
  label,
  name,
  value = [],
  onChange,
  error,
  maxFiles = 10,
  maxSize = 5 * 1024 * 1024,
  required = false,
  className,
}) {
  const inputRef = useRef(null);

  const handleFiles = (files) => {
    const validFiles = Array.from(files)
      .filter((file) => file.size <= maxSize)
      .slice(0, maxFiles - (value?.length || 0));

    if (validFiles.length > 0) {
      onChange(name, [...(value || []), ...validFiles]);
    }
  };

  const handleRemove = (index) => {
    const item = value[index];
    // Revocar blob URL si es un File
    if (item instanceof File) {
      URL.revokeObjectURL(URL.createObjectURL(item));
    }
    const newValue = [...value];
    newValue.splice(index, 1);
    onChange(name, newValue);
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Gallery */}
      <div className="grid grid-cols-4 gap-2">
        {value?.map((item, index) => (
          <div key={index} className="relative aspect-square">
            <img
              src={item instanceof File ? URL.createObjectURL(item) : storageUrl(item)}
              alt=""
              className="h-full w-full rounded-lg object-cover border dark:border-gray-700"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute -top-1 -right-1 h-5 w-5"
              onClick={() => handleRemove(index)}
            >
              <DynamicIcon name="X" className="h-3 w-3" />
            </Button>
          </div>
        ))}

        {/* Add Button */}
        {(value?.length || 0) < maxFiles && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="aspect-square rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-gray-400 flex items-center justify-center"
          >
            <DynamicIcon name="Plus" className="h-6 w-6 text-gray-400" />
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => handleFiles(e.target.files)}
        className="hidden"
      />

      {error && (
        <p className="text-sm text-red-500 flex items-center gap-1">
          <DynamicIcon name="AlertCircle" className="h-3 w-3" />
          {error}
        </p>
      )}
    </div>
  );
}
