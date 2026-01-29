import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import DataTable from '@/Components/admin/DataTable';
import { Badge } from '@/Components/ui/badge';

export default function Index({ items }) {
  const columns = [
    { key: 'foto', label: 'Foto', type: 'image' },
    {
      key: 'nombres',
      label: 'Nombre Completo',
      render: (_, item) => `${item.nombres} ${item.apellidos}`,
    },
    {
      key: 'periodo',
      label: 'Periodo',
      render: (_, item) => `${item.periodo_inicio} - ${item.periodo_fin || 'Presente'}`,
    },
    {
      key: 'es_actual',
      label: 'Actual',
      render: (value) => value ? <Badge>Actual</Badge> : null,
    },
    { key: 'is_published', label: 'Estado', type: 'badge' },
  ];

  return (
    <AdminLayout
      title="Presidentes"
      breadcrumbs={[{ label: 'Marco Legal', href: '/admin' }, { label: 'Presidentes' }]}
    >
      <Head title="Presidentes - Admin" />
      <DataTable
        title="Presidentes del Conjunto"
        data={items.data}
        columns={columns}
        createRoute="/admin/presidentes/create"
        createLabel="Agregar presidente"
        editRoute="/admin/presidentes/:id/edit"
        deleteRoute="/admin/presidentes/:id"
        emptyMessage="No hay presidentes"
        emptyIcon="Users"
        pagination={items}
      />
    </AdminLayout>
  );
}
