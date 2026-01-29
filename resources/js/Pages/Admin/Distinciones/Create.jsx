import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import CrudForm from '@/Components/admin/CrudForm';

export default function Create({ tipos }) {
  const tipoOptions = Object.entries(tipos).map(([value, label]) => ({ value, label }));

  const fields = [
    { name: 'titulo', label: 'Título', required: true, fullWidth: true },
    { name: 'tipo', label: 'Tipo', type: 'select', options: tipoOptions, required: true },
    { name: 'otorgante', label: 'Institución Otorgante', required: true },
    { name: 'fecha_otorgamiento', label: 'Fecha de Otorgamiento', type: 'date', required: true },
    { name: 'lugar', label: 'Lugar', fullWidth: true },
    { name: 'resolucion', label: 'N° Resolución' },
    { name: 'descripcion', label: 'Descripción', type: 'textarea', required: true, fullWidth: true, rows: 3 },
    { name: 'contenido', label: 'Contenido Detallado', type: 'textarea', fullWidth: true, rows: 6, group: 'Contenido' },
    { name: 'imagen', label: 'Imagen Principal', type: 'image', required: true, group: 'Archivos' },
    { name: 'documento_pdf', label: 'Documento PDF', type: 'file', accept: '.pdf', group: 'Archivos' },
  ];

  return (
    <AdminLayout
      title="Nueva Distinción"
      breadcrumbs={[{ label: 'Multimedia', href: '/admin' }, { label: 'Distinciones', href: '/admin/distinciones' }, { label: 'Nuevo' }]}
    >
      <Head title="Nueva Distinción - Admin" />
      <div className="max-w-3xl">
        <CrudForm fields={fields} storeRoute="/admin/distinciones" indexRoute="/admin/distinciones" />
      </div>
    </AdminLayout>
  );
}
