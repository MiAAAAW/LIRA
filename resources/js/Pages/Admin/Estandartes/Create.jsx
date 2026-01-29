import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import CrudForm from '@/Components/admin/CrudForm';

export default function Create({ tipos }) {
  const tipoOptions = Object.entries(tipos).map(([value, label]) => ({ value, label }));

  const fields = [
    { name: 'titulo', label: 'Título', required: true, fullWidth: true },
    { name: 'tipo', label: 'Tipo', type: 'select', options: tipoOptions, required: true },
    { name: 'anio', label: 'Año', type: 'number', placeholder: '2024' },
    { name: 'autor', label: 'Autor/Creador' },
    { name: 'donante', label: 'Donante' },
    { name: 'dimensiones', label: 'Dimensiones', placeholder: 'Ej: 1.5m x 1m' },
    { name: 'materiales', label: 'Materiales', fullWidth: true },
    { name: 'ubicacion_actual', label: 'Ubicación Actual', fullWidth: true },
    { name: 'descripcion', label: 'Descripción', type: 'textarea', required: true, fullWidth: true, rows: 3 },
    { name: 'historia', label: 'Historia', type: 'textarea', fullWidth: true, rows: 6, group: 'Historia' },
    { name: 'imagen_principal', label: 'Imagen Principal', type: 'image', required: true, group: 'Imágenes' },
  ];

  return (
    <AdminLayout
      title="Nuevo Estandarte"
      breadcrumbs={[{ label: 'Marco Legal', href: '/admin' }, { label: 'Estandartes', href: '/admin/estandartes' }, { label: 'Nuevo' }]}
    >
      <Head title="Nuevo Estandarte - Admin" />
      <div className="max-w-3xl">
        <CrudForm fields={fields} storeRoute="/admin/estandartes" indexRoute="/admin/estandartes" />
      </div>
    </AdminLayout>
  );
}
