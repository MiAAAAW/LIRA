import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import CrudForm from '@/Components/admin/CrudForm';

export default function Create({ categorias, fuentes }) {
  const catOptions = Object.entries(categorias).map(([value, label]) => ({ value, label }));
  const fuenteOptions = Object.entries(fuentes).map(([value, label]) => ({ value, label }));

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
      label: 'Subir Video',
      type: 'file',
      accept: 'video/mp4,video/webm,video/quicktime',
      helpText: 'Solo para Cloudflare R2. Máx 500MB. Se genera thumbnail automáticamente.',
      fullWidth: true,
      group: 'Archivo'
    },
    {
      name: 'url_video',
      label: 'URL del Video',
      placeholder: 'https://youtube.com/watch?v=...',
      fullWidth: true,
      helpText: 'Requerido para YouTube/Vimeo. Para Cloudflare se genera automáticamente.'
    },
    { name: 'video_id', label: 'ID del Video', placeholder: 'Se extrae automáticamente de la URL' },
    { name: 'categoria', label: 'Categoría', type: 'select', options: catOptions },
    { name: 'duracion', label: 'Duración', placeholder: 'Ej: 5:30' },
    { name: 'anio', label: 'Año', type: 'number', placeholder: '2024' },
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
      title="Nuevo Video"
      breadcrumbs={[{ label: 'Multimedia', href: '/admin' }, { label: 'Videos', href: '/admin/videos' }, { label: 'Nuevo' }]}
    >
      <Head title="Nuevo Video - Admin" />
      <div className="max-w-3xl">
        <CrudForm fields={fields} storeRoute="/admin/videos" indexRoute="/admin/videos" />
      </div>
    </AdminLayout>
  );
}
