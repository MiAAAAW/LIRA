import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import CrudForm from '@/Components/admin/CrudForm';

export default function Edit({ item, tipos }) {
  const tipoOptions = Object.entries(tipos).map(([value, label]) => ({ value, label }));

  const fields = [
    { name: 'titulo', label: 'Título', required: true, fullWidth: true },
    { name: 'tipo', label: 'Tipo', type: 'select', options: tipoOptions, required: true },
    { name: 'autor', label: 'Autor', required: true },
    { name: 'editorial', label: 'Editorial' },
    { name: 'isbn', label: 'ISBN' },
    { name: 'anio_publicacion', label: 'Año de Publicación', type: 'number' },
    { name: 'edicion', label: 'Edición' },
    { name: 'paginas', label: 'Páginas', type: 'number' },
    { name: 'precio', label: 'Precio (S/)', type: 'number' },
    { name: 'enlace_compra', label: 'Enlace de Compra' },
    { name: 'enlace_descarga', label: 'Enlace de Descarga' },
    { name: 'descripcion', label: 'Descripción', type: 'textarea', required: true, fullWidth: true, rows: 3 },
    { name: 'resumen', label: 'Resumen', type: 'textarea', fullWidth: true, rows: 6, group: 'Contenido' },
    { name: 'imagen_portada', label: 'Portada', type: 'image', group: 'Archivos' },
    { name: 'documento_pdf', label: 'PDF Completo', type: 'file', accept: '.pdf', group: 'Archivos' },
  ];

  return (
    <AdminLayout
      title="Editar Publicación"
      breadcrumbs={[{ label: 'Multimedia', href: '/admin' }, { label: 'Publicaciones', href: '/admin/publicaciones' }, { label: 'Editar' }]}
    >
      <Head title="Editar Publicación - Admin" />
      <div className="max-w-3xl">
        <CrudForm item={item} fields={fields} updateRoute={`/admin/publicaciones/${item.id}`} indexRoute="/admin/publicaciones" />
      </div>
    </AdminLayout>
  );
}
