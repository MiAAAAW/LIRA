import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import CrudForm from '@/Components/admin/CrudForm';

export default function Create({ tipos }) {
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
    { name: 'precio', label: 'Precio (S/)', type: 'number', placeholder: '0.00' },
    { name: 'enlace_compra', label: 'Enlace de Compra', placeholder: 'https://' },
    { name: 'enlace_descarga', label: 'Enlace de Descarga', placeholder: 'https://' },
    { name: 'descripcion', label: 'Descripción', type: 'textarea', required: true, fullWidth: true, rows: 3 },
    { name: 'resumen', label: 'Resumen', type: 'textarea', fullWidth: true, rows: 6, group: 'Contenido' },
    { name: 'imagen_portada', label: 'Portada', type: 'image', required: true, group: 'Archivos' },
    { name: 'documento_pdf', label: 'PDF Completo', type: 'file', accept: '.pdf', group: 'Archivos' },
  ];

  return (
    <AdminLayout
      title="Nueva Publicación"
      breadcrumbs={[{ label: 'Multimedia', href: '/admin' }, { label: 'Publicaciones', href: '/admin/publicaciones' }, { label: 'Nuevo' }]}
    >
      <Head title="Nueva Publicación - Admin" />
      <div className="max-w-3xl">
        <CrudForm fields={fields} storeRoute="/admin/publicaciones" indexRoute="/admin/publicaciones" />
      </div>
    </AdminLayout>
  );
}
