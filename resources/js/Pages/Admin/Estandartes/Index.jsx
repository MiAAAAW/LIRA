import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import DataTable from '@/Components/admin/DataTable';

export default function Index({ items }) {
  const columns = [
    { key: 'imagen_principal', label: 'Imagen', type: 'image' },
    { key: 'titulo', label: 'Título' },
    { key: 'tipo', label: 'Tipo' },
    { key: 'anio', label: 'Año' },
    { key: 'is_published', label: 'Estado', type: 'badge' },
  ];

  return (
    <AdminLayout
      title="Estandartes"
      breadcrumbs={[{ label: 'Marco Legal', href: '/admin' }, { label: 'Estandartes' }]}
    >
      <Head title="Estandartes - Admin" />
      <DataTable
        title="Estandartes del Conjunto"
        data={items.data}
        columns={columns}
        createRoute="/admin/estandartes/create"
        createLabel="Agregar estandarte"
        editRoute="/admin/estandartes/:id/edit"
        deleteRoute="/admin/estandartes/:id"
        emptyMessage="No hay estandartes"
        emptyIcon="Flag"
        pagination={items}
      />
    </AdminLayout>
  );
}
