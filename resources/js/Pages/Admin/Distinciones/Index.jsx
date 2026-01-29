import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import DataTable from '@/Components/admin/DataTable';

export default function Index({ items }) {
  const columns = [
    { key: 'imagen', label: 'Imagen', type: 'image' },
    { key: 'titulo', label: 'Título' },
    { key: 'tipo', label: 'Tipo' },
    { key: 'otorgante', label: 'Otorgante' },
    { key: 'fecha_otorgamiento', label: 'Fecha', type: 'date' },
    { key: 'is_published', label: 'Estado', type: 'badge' },
  ];

  return (
    <AdminLayout
      title="Distinciones"
      breadcrumbs={[{ label: 'Multimedia', href: '/admin' }, { label: 'Distinciones' }]}
    >
      <Head title="Distinciones - Admin" />
      <DataTable
        title="Premios y Reconocimientos"
        data={items.data}
        columns={columns}
        createRoute="/admin/distinciones/create"
        createLabel="Agregar distinción"
        editRoute="/admin/distinciones/:id/edit"
        deleteRoute="/admin/distinciones/:id"
        emptyMessage="No hay distinciones"
        emptyIcon="Award"
        pagination={items}
      />
    </AdminLayout>
  );
}
