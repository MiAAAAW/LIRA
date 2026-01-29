import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import CrudForm from '@/Components/admin/CrudForm';

export default function Create() {
  const fields = [
    { name: 'nombres', label: 'Nombres', required: true },
    { name: 'apellidos', label: 'Apellidos', required: true },
    { name: 'periodo_inicio', label: 'Año Inicio', type: 'number', required: true, placeholder: '2020' },
    { name: 'periodo_fin', label: 'Año Fin', type: 'number', placeholder: 'Dejar vacío si es actual' },
    { name: 'profesion', label: 'Profesión', fullWidth: true },
    { name: 'email', label: 'Email', type: 'email' },
    { name: 'telefono', label: 'Teléfono' },
    { name: 'es_actual', label: 'Es Presidente Actual', type: 'checkbox', fullWidth: true },
    { name: 'biografia', label: 'Biografía', type: 'textarea', fullWidth: true, rows: 4, group: 'Información' },
    { name: 'logros', label: 'Logros', type: 'textarea', fullWidth: true, rows: 4, group: 'Información' },
    { name: 'foto', label: 'Foto', type: 'image', group: 'Imagen' },
  ];

  return (
    <AdminLayout
      title="Nuevo Presidente"
      breadcrumbs={[{ label: 'Marco Legal', href: '/admin' }, { label: 'Presidentes', href: '/admin/presidentes' }, { label: 'Nuevo' }]}
    >
      <Head title="Nuevo Presidente - Admin" />
      <div className="max-w-3xl">
        <CrudForm fields={fields} storeRoute="/admin/presidentes" indexRoute="/admin/presidentes" />
      </div>
    </AdminLayout>
  );
}
