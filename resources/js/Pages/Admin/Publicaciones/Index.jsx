import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import DataTable from '@/Components/admin/DataTable';

export default function Index({ items }) {
  const columns = [
    { key: 'imagen_portada', label: 'Portada', type: 'image' },
    { key: 'titulo', label: 'Título' },
    { key: 'tipo', label: 'Tipo' },
    { key: 'autor', label: 'Autor' },
    { key: 'anio_publicacion', label: 'Año' },
    { key: 'is_published', label: 'Estado', type: 'badge' },
  ];

  return (
    <AdminLayout
      title="Publicaciones"
      breadcrumbs={[{ label: 'Multimedia', href: '/admin' }, { label: 'Publicaciones' }]}
    >
      <Head title="Publicaciones - Admin" />
      <DataTable
        title="Libros y Publicaciones"
        data={items.data}
        columns={columns}
        createRoute="/admin/publicaciones/create"
        createLabel="Agregar publicación"
        editRoute="/admin/publicaciones/:id/edit"
        deleteRoute="/admin/publicaciones/:id"
        emptyMessage="No hay publicaciones"
        emptyIcon="Newspaper"
        pagination={items}
      />
    </AdminLayout>
  );
}
