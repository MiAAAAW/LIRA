import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import DataTable from '@/Components/admin/DataTable';

export default function Index({ items }) {
  const columns = [
    { key: 'thumbnail', label: 'Imagen', type: 'image' },
    { key: 'titulo', label: 'Título' },
    { key: 'tipo', label: 'Tipo' },
    { key: 'compositor', label: 'Compositor' },
    { key: 'duracion', label: 'Duración' },
    { key: 'is_published', label: 'Estado', type: 'badge' },
  ];

  return (
    <AdminLayout
      title="Audios"
      breadcrumbs={[{ label: 'Multimedia', href: '/admin' }, { label: 'Audios' }]}
    >
      <Head title="Audios - Admin" />
      <DataTable
        title="Música Tradicional"
        data={items.data}
        columns={columns}
        createRoute="/admin/audios/create"
        createLabel="Agregar audio"
        editRoute="/admin/audios/:id/edit"
        deleteRoute="/admin/audios/:id"
        emptyMessage="No hay audios"
        emptyIcon="Music"
        pagination={items}
      />
    </AdminLayout>
  );
}
