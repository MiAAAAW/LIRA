import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import CrudForm from '@/Components/admin/CrudForm';

export default function Edit({ item, categorias, fuentes }) {
  const catOptions = Object.entries(categorias).map(([value, label]) => ({ value, label }));
  const fuenteOptions = Object.entries(fuentes).map(([value, label]) => ({ value, label }));

  const fields = [
    { name: 'titulo', label: 'Título', required: true, fullWidth: true },
    { name: 'tipo_fuente', label: 'Fuente', type: 'select', options: fuenteOptions, required: true },
    { name: 'url_video', label: 'URL del Video', required: true, fullWidth: true },
    { name: 'video_id', label: 'ID del Video' },
    { name: 'categoria', label: 'Categoría', type: 'select', options: catOptions },
    { name: 'duracion', label: 'Duración' },
    { name: 'anio', label: 'Año', type: 'number' },
    { name: 'evento', label: 'Evento' },
    { name: 'ubicacion', label: 'Ubicación' },
    { name: 'descripcion', label: 'Descripción', type: 'textarea', fullWidth: true, rows: 3 },
    { name: 'thumbnail', label: 'Miniatura', type: 'image', group: 'Imagen' },
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
