import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import DataTable from '@/Components/admin/DataTable';

export default function Index({ items }) {
  const columns = [
    { key: 'titulo', label: 'Título' },
    { key: 'tipo', label: 'Tipo' },
    { key: 'numero', label: 'Número' },
    { key: 'fecha', label: 'Fecha', type: 'date' },
    { key: 'firmante', label: 'Firmante' },
    { key: 'is_published', label: 'Estado', type: 'badge' },
  ];

  return (
    <AdminLayout
      title="Comunicados"
      breadcrumbs={[{ label: 'Multimedia', href: '/admin' }, { label: 'Comunicados' }]}
    >
      <Head title="Comunicados - Admin" />
      <DataTable
        title="Comunicados Oficiales"
        data={items.data}
        columns={columns}
        createRoute="/admin/comunicados/create"
        createLabel="Nuevo comunicado"
        editRoute="/admin/comunicados/:id/edit"
        deleteRoute="/admin/comunicados/:id"
        emptyMessage="No hay comunicados"
        emptyIcon="Megaphone"
        pagination={items}
      />
    </AdminLayout>
  );
}
