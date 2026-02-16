import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import DataTable from '@/Components/admin/DataTable';
import { Badge } from '@/Components/ui/badge';

export default function Index({ items, tipos, cargos }) {
  const tipoOptions = Object.entries(tipos).map(([value, label]) => ({ value, label }));
  const cargoOptions = [
    { value: '', label: 'Sin cargo' },
    ...Object.entries(cargos).map(([value, label]) => ({ value, label })),
  ];

  const columns = [
    { key: 'foto', label: 'Foto', type: 'image' },
    {
      key: 'apellidos',
      label: 'Apellidos',
      render: (value) => (
        <span className="block max-w-[180px] sm:max-w-[250px] truncate" title={value}>{value}</span>
      ),
    },
    {
      key: 'nombres',
      label: 'Nombres',
      render: (value) => (
        <span className="block max-w-[180px] sm:max-w-[250px] truncate" title={value}>{value}</span>
      ),
    },
    {
      key: 'tipo',
      label: 'Tipo',
      render: (value) => (
        <Badge variant={value === 'directivo' ? 'default' : 'secondary'}>
          {tipos[value] || value}
        </Badge>
      ),
    },
    {
      key: 'cargo',
      label: 'Cargo',
      render: (value) => value ? (cargos[value] || value) : '—',
    },
    {
      key: 'is_active',
      label: 'Activo',
      render: (value) => (
        <Badge variant={value ? 'default' : 'destructive'}>
          {value ? 'Activo' : 'Inactivo'}
        </Badge>
      ),
    },
  ];

  const formFields = [
    { name: 'apellidos', label: 'Apellidos', required: true, placeholder: 'Ej: Palacios Quispe' },
    { name: 'nombres', label: 'Nombres', required: true, placeholder: 'Ej: Mary Nina' },
    { name: 'dni', label: 'DNI', placeholder: '12345678' },
    { name: 'telefono', label: 'Teléfono', placeholder: '+51 951 000 000' },
    {
      name: 'tipo',
      label: 'Tipo de Miembro',
      type: 'select',
      required: true,
      options: tipoOptions,
    },
    {
      name: 'cargo',
      label: 'Cargo',
      type: 'select',
      options: cargoOptions,
      dependsOn: { field: 'tipo', value: 'directivo' },
    },
    { name: 'is_active', label: 'Miembro Activo', type: 'checkbox', fullWidth: true, defaultValue: true },
    { name: 'foto', label: 'Foto', type: 'image', fullWidth: true },
  ];

  return (
    <AdminLayout
      title="Miembros"
      breadcrumbs={[{ label: 'Miembros', href: '/admin' }, { label: 'Lista de Miembros' }]}
    >
      <Head title="Miembros - Admin" />
      <DataTable
        title="Miembros del Conjunto"
        data={items.data}
        columns={columns}
        createLabel="Agregar miembro"
        deleteRoute="/admin/miembros/:id"
        emptyMessage="No hay miembros registrados"
        emptyIcon="UserPlus"
        pagination={items}
        formFields={formFields}
        storeRoute="/admin/miembros"
        updateRoute="/admin/miembros/:id"
        modalTitleCreate="Nuevo Miembro"
        modalTitleEdit="Editar Miembro"
        modalDescription="Complete los datos del miembro."
        hidePublishOptions
      />
    </AdminLayout>
  );
}
