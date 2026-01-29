import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import CrudForm from '@/Components/admin/CrudForm';

export default function Edit({ item, tipos }) {
  const tipoOptions = Object.entries(tipos).map(([value, label]) => ({ value, label }));

  const fields = [
    { name: 'titulo', label: 'Título', required: true, fullWidth: true },
    { name: 'tipo', label: 'Tipo', type: 'select', options: tipoOptions, required: true },
    { name: 'anio', label: 'Año', type: 'number' },
    { name: 'autor', label: 'Autor/Creador' },
    { name: 'donante', label: 'Donante' },
    { name: 'dimensiones', label: 'Dimensiones' },
    { name: 'materiales', label: 'Materiales', fullWidth: true },
    { name: 'ubicacion_actual', label: 'Ubicación Actual', fullWidth: true },
    { name: 'descripcion', label: 'Descripción', type: 'textarea', required: true, fullWidth: true, rows: 3 },
    { name: 'historia', label: 'Historia', type: 'textarea', fullWidth: true, rows: 6, group: 'Historia' },
    { name: 'imagen_principal', label: 'Imagen Principal', type: 'image', group: 'Imágenes' },
  ];

  return (
    <AdminLayout
      title="Editar Estandarte"
      breadcrumbs={[{ label: 'Marco Legal', href: '/admin' }, { label: 'Estandartes', href: '/admin/estandartes' }, { label: 'Editar' }]}
    >
      <Head title="Editar Estandarte - Admin" />
      <div className="max-w-3xl">
        <CrudForm item={item} fields={fields} updateRoute={`/admin/estandartes/${item.id}`} indexRoute="/admin/estandartes" />
      </div>
    </AdminLayout>
  );
}
