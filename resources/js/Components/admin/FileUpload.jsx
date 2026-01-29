import { useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/Components/ui/button';
import DynamicIcon from '@/Components/DynamicIcon';

export default function FileUpload({
  label,
  name,
  value,
  onChange,
  error,
  accept = 'image/*',
  maxSize = 5 * 1024 * 1024, // 5MB
  preview = true,
  required = false,
  helpText,
  className,
}) {
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const inputRef = useRef(null);

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
    if (file.size > maxSize) {
      alert(`El archivo es muy grande. Máximo ${maxSize / 1024 / 1024}MB`);
      return;
    }

    onChange(name, file);

    if (preview && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => setPreviewUrl(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleRemove = () => {
    onChange(name, null);
    setPreviewUrl(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const currentPreview = previewUrl || (typeof value === 'string' ? value : null);
  const fileName = value instanceof File ? value.name : null;

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
            "flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors",
            dragActive
              ? "border-primary bg-primary/5"
              : "border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600",
            error && "border-red-500"
          )}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
            <DynamicIcon name="Upload" className="h-6 w-6 text-gray-500" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Arrastra un archivo aquí
            </p>
            <p className="text-xs text-gray-500">
              o haz clic para seleccionar
            </p>
          </div>
          <p className="text-xs text-gray-400">
            Máximo {maxSize / 1024 / 1024}MB
          </p>
        </div>
      )}

      {/* File Name */}
      {fileName && (
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <DynamicIcon name="FileCheck" className="h-4 w-4 text-green-500" />
          <span className="truncate">{fileName}</span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleRemove}
            className="h-6 px-2"
          >
            <DynamicIcon name="X" className="h-3 w-3" />
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
              src={item instanceof File ? URL.createObjectURL(item) : item}
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
