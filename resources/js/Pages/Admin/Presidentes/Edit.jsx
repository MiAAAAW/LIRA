import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import CrudForm from '@/Components/admin/CrudForm';

export default function Edit({ item }) {
  const fields = [
    // Datos principales
    { name: 'nombres', label: 'Nombres', required: true },
    { name: 'apellidos', label: 'Apellidos', required: true },
    { name: 'periodo_inicio', label: 'Año Inicio', type: 'number', required: true },
    { name: 'periodo_fin', label: 'Año Fin', type: 'number', placeholder: 'Dejar vacío si es actual' },
    { name: 'profesion', label: 'Profesión', fullWidth: true },
    { name: 'email', label: 'Email', type: 'email' },
    { name: 'telefono', label: 'Teléfono' },
    { name: 'es_actual', label: 'Es Presidente Actual', type: 'checkbox', fullWidth: true, helpText: 'Solo uno puede ser actual' },
    { name: 'biografia', label: 'Biografía', type: 'textarea', fullWidth: true, rows: 4, group: 'Información' },
    { name: 'logros', label: 'Logros', type: 'textarea', fullWidth: true, rows: 4, group: 'Información' },
    { name: 'foto', label: 'Foto', type: 'image', group: 'Imagen' },
  ];

  return (
    <AdminLayout
      title="Editar Presidente"
      breadcrumbs={[{ label: 'Marco Legal', href: '/admin' }, { label: 'Presidentes', href: '/admin/presidentes' }, { label: 'Editar' }]}
    >
      <Head title="Editar Presidente - Admin" />
      <div className="max-w-3xl">
        <CrudForm item={item} fields={fields} updateRoute={`/admin/presidentes/${item.id}`} indexRoute="/admin/presidentes" />
      </div>
    </AdminLayout>
  );
}
