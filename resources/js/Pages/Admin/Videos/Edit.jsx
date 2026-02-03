import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import CrudForm from '@/Components/admin/CrudForm';

export default function Edit({ item, categorias, fuentes }) {
  const catOptions = Object.entries(categorias).map(([value, label]) => ({ value, label }));
  const fuenteOptions = Object.entries(fuentes).map(([value, label]) => ({ value, label }));

  // Check if this video is stored in Cloudflare R2
  const isCloudflareVideo = item.tipo_fuente === 'cloudflare' || item.r2_key;

  const fields = [
    { name: 'titulo', label: 'Título', required: true, fullWidth: true },
    {
      name: 'tipo_fuente',
      label: 'Fuente',
      type: 'select',
      options: fuenteOptions,
      required: true,
      helpText: 'Selecciona "Cloudflare R2 (CDN)" para subir archivos directamente'
    },
    {
      name: 'video_file',
      label: 'Reemplazar Video',
      type: 'file',
      accept: 'video/mp4,video/webm,video/quicktime',
      helpText: isCloudflareVideo
        ? 'Video actual en CDN. Sube uno nuevo para reemplazarlo.'
        : 'Solo para Cloudflare R2. Máx 500MB.',
      fullWidth: true,
      group: 'Archivo'
    },
    {
      name: 'url_video',
      label: 'URL del Video',
      fullWidth: true,
      helpText: isCloudflareVideo
        ? 'URL actual del CDN (se actualiza automáticamente al subir nuevo video)'
        : 'Requerido para YouTube/Vimeo'
    },
    { name: 'video_id', label: 'ID del Video' },
    { name: 'categoria', label: 'Categoría', type: 'select', options: catOptions },
    { name: 'duracion', label: 'Duración' },
    { name: 'anio', label: 'Año', type: 'number' },
    { name: 'evento', label: 'Evento' },
    { name: 'ubicacion', label: 'Ubicación' },
    { name: 'descripcion', label: 'Descripción', type: 'textarea', fullWidth: true, rows: 3 },
    {
      name: 'thumbnail',
      label: 'Miniatura (Opcional)',
      type: 'image',
      group: 'Imagen',
      helpText: 'YouTube genera thumbnail automático. Solo necesario para otros tipos.'
    },
  ];

  return (
    <AdminLayout
      title="Editar Video"
      breadcrumbs={[{ label: 'Multimedia', href: '/admin' }, { label: 'Videos', href: '/admin/videos' }, { label: 'Editar' }]}
    >
      <Head title="Editar Video - Admin" />
      <div className="max-w-3xl">
        <CrudForm item={item} fields={fields} updateRoute={`/admin/videos/${item.id}`} indexRoute="/admin/videos" />
      </div>
    </AdminLayout>
  );
}
