import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import DataTable from '@/Components/admin/DataTable';
import { Badge } from '@/Components/ui/badge';

export default function Index({ items, sectionVisible }) {
  const columns = [
    { key: 'foto', label: 'Foto', type: 'image' },
    {
      key: 'nombres',
      label: 'Nombre Completo',
      render: (_, item) => `${item.nombres} ${item.apellidos}`,
    },
    {
      key: 'periodo',
      label: 'Periodo',
      render: (_, item) => `${item.periodo_inicio} - ${item.periodo_fin || 'Presente'}`,
    },
    {
      key: 'es_actual',
      label: 'Actual',
      render: (value) => value ? <Badge>Actual</Badge> : null,
    },
    { key: 'is_published', label: 'Estado', type: 'badge' },
  ];

  const formFields = [
    { name: 'nombres', label: 'Nombres', required: true },
    { name: 'apellidos', label: 'Apellidos', required: true },
    { name: 'periodo_inicio', label: 'Año Inicio', type: 'number', required: true, placeholder: '2020' },
    { name: 'periodo_fin', label: 'Año Fin', type: 'number', placeholder: 'Vacío si es actual' },
    { name: 'profesion', label: 'Profesión', fullWidth: true },
    { name: 'email', label: 'Email', type: 'email' },
    { name: 'telefono', label: 'Teléfono' },
    { name: 'es_actual', label: 'Es Presidente Actual', type: 'checkbox', fullWidth: true },
    { name: 'biografia', label: 'Biografía', type: 'textarea', fullWidth: true, rows: 3 },
    { name: 'logros', label: 'Logros', type: 'textarea', fullWidth: true, rows: 3 },
    { name: 'foto', label: 'Foto', type: 'image', fullWidth: true },
  ];

  return (
    <AdminLayout
      title="Presidentes"
      breadcrumbs={[{ label: 'Marco Legal', href: '/admin' }, { label: 'Presidentes' }]}
    >
      <Head title="Presidentes - Admin" />
      <DataTable
        title="Presidentes del Conjunto"
        sectionToggle={{ sectionKey: 'presidentes', isVisible: sectionVisible }}
        data={items.data}
        columns={columns}
        createLabel="Agregar presidente"
        deleteRoute="/admin/presidentes/:id"
        emptyMessage="No hay presidentes"
        emptyIcon="Users"
        pagination={items}
        formFields={formFields}
        storeRoute="/admin/presidentes"
        updateRoute="/admin/presidentes/:id"
        modalTitleCreate="Nuevo Presidente"
        modalTitleEdit="Editar Presidente"
        modalDescription="Complete los datos del presidente. Solo uno puede ser 'Actual'."
      />
    </AdminLayout>
  );
}
