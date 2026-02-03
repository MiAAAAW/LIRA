import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Convierte un path de storage a URL pública
 * @param {string} path - Ruta relativa (ej: 'pandilla/images/xxx.jpg')
 * @returns {string|null} URL completa o null si no hay path
 * @example
 * storageUrl('pandilla/images/foto.jpg') // => '/storage/pandilla/images/foto.jpg'
 * storageUrl('https://example.com/img.jpg') // => 'https://example.com/img.jpg'
 * storageUrl(null) // => null
 */
export function storageUrl(path) {
  if (!path) return null;
  // Si ya es URL absoluta, retornar tal cual
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('/storage/')) {
    return path;
  }
  // Si empieza con /, asumir que ya es ruta desde public
  if (path.startsWith('/')) {
    return path;
  }
  // Agregar prefijo /storage/ para rutas de storage
  return `/storage/${path}`;
}
