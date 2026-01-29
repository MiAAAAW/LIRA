import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import DataTable from '@/Components/admin/DataTable';

export default function Index({ items }) {
  const columns = [
    { key: 'thumbnail', label: 'Miniatura', type: 'image' },
    { key: 'titulo', label: 'Título' },
    { key: 'tipo_fuente', label: 'Fuente' },
    { key: 'categoria', label: 'Categoría' },
    { key: 'duracion', label: 'Duración' },
    { key: 'is_published', label: 'Estado', type: 'badge' },
  ];

  return (
    <AdminLayout
      title="Videos"
      breadcrumbs={[{ label: 'Multimedia', href: '/admin' }, { label: 'Videos' }]}
    >
      <Head title="Videos - Admin" />
      <DataTable
        title="Galería de Videos"
        data={items.data}
        columns={columns}
        createRoute="/admin/videos/create"
        createLabel="Agregar video"
        editRoute="/admin/videos/:id/edit"
        deleteRoute="/admin/videos/:id"
        emptyMessage="No hay videos"
        emptyIcon="Video"
        pagination={items}
      />
    </AdminLayout>
  );
}
