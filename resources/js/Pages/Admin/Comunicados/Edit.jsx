import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import CrudForm from '@/Components/admin/CrudForm';

export default function Edit({ item, tipos }) {
  const tipoOptions = Object.entries(tipos).map(([value, label]) => ({ value, label }));

  const fields = [
    { name: 'titulo', label: 'Título', required: true, fullWidth: true },
    { name: 'tipo', label: 'Tipo', type: 'select', options: tipoOptions, required: true },
    { name: 'numero', label: 'Número' },
    { name: 'fecha', label: 'Fecha', type: 'date', required: true },
    { name: 'firmante', label: 'Firmante' },
    { name: 'cargo_firmante', label: 'Cargo del Firmante' },
    { name: 'fecha_vigencia', label: 'Fecha de Vigencia', type: 'date' },
    { name: 'extracto', label: 'Extracto', type: 'textarea', required: true, fullWidth: true, rows: 2 },
    { name: 'contenido', label: 'Contenido', type: 'textarea', required: true, fullWidth: true, rows: 10, group: 'Contenido' },
    { name: 'imagen', label: 'Imagen', type: 'image', group: 'Archivos' },
  ];

  return (
    <AdminLayout
      title="Editar Comunicado"
      breadcrumbs={[{ label: 'Multimedia', href: '/admin' }, { label: 'Comunicados', href: '/admin/comunicados' }, { label: 'Editar' }]}
    >
      <Head title="Editar Comunicado - Admin" />
      <div className="max-w-3xl">
        <CrudForm item={item} fields={fields} updateRoute={`/admin/comunicados/${item.id}`} indexRoute="/admin/comunicados" />
      </div>
    </AdminLayout>
  );
}
