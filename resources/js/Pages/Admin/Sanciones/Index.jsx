import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import DataTable from '@/Components/admin/DataTable';
import { Badge } from '@/Components/ui/badge';

const tipoColors = {
  multa: 'bg-red-100 text-red-700',
  amonestacion: 'bg-amber-100 text-amber-700',
  suspension: 'bg-orange-100 text-orange-700',
};

const estadoColors = {
  pendiente: 'bg-yellow-100 text-yellow-700',
  pagado: 'bg-green-100 text-green-700',
  condonado: 'bg-gray-100 text-gray-600',
};

export default function Index({ items, miembros }) {
  const miembroOptions = miembros.map(m => ({
    value: String(m.id),
    label: `${m.apellidos}, ${m.nombres}`,
  }));

  const columns = [
    {
      key: 'miembro_nombre',
      label: 'Miembro',
    },
    {
      key: 'tipo',
      label: 'Tipo',
      render: (value) => (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${tipoColors[value] || ''}`}>
          {value === 'multa' ? 'Multa' : value === 'amonestacion' ? 'Amonestación' : 'Suspensión'}
        </span>
      ),
    },
    {
      key: 'monto',
      label: 'Monto',
      render: (value) => value ? `S/ ${parseFloat(value).toFixed(2)}` : '—',
    },
    {
      key: 'motivo',
      label: 'Motivo',
    },
    {
      key: 'estado',
      label: 'Estado',
      render: (value) => (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${estadoColors[value] || ''}`}>
          {value === 'pendiente' ? 'Pendiente' : value === 'pagado' ? 'Pagado' : 'Condonado'}
        </span>
      ),
    },
    {
      key: 'fecha',
      label: 'Fecha',
      render: (value) => value ? new Date(value).toLocaleDateString('es-PE') : '—',
    },
  ];

  const formFields = [
    {
      name: 'miembro_id',
      label: 'Miembro',
      type: 'select',
      required: true,
      options: miembroOptions,
    },
    {
      name: 'tipo',
      label: 'Tipo',
      type: 'select',
      required: true,
      options: [
        { value: 'multa', label: 'Multa' },
        { value: 'amonestacion', label: 'Amonestación' },
        { value: 'suspension', label: 'Suspensión' },
      ],
    },
    { name: 'monto', label: 'Monto (S/)', type: 'number', placeholder: '0.00' },
    { name: 'motivo', label: 'Motivo', required: true, fullWidth: true },
    {
      name: 'estado',
      label: 'Estado',
      type: 'select',
      required: true,
      options: [
        { value: 'pendiente', label: 'Pendiente' },
        { value: 'pagado', label: 'Pagado' },
        { value: 'condonado', label: 'Condonado' },
      ],
    },
    { name: 'fecha', label: 'Fecha', type: 'date', required: true },
    { name: 'descripcion', label: 'Descripción', type: 'textarea', fullWidth: true, rows: 3 },
  ];

  return (
    <AdminLayout
      title="Sanciones"
      breadcrumbs={[{ label: 'Miembros', href: '/admin' }, { label: 'Sanciones' }]}
    >
      <Head title="Sanciones - Admin" />
      <DataTable
        title="Sanciones"
        data={items.data}
        columns={columns}
        createLabel="Agregar sanción"
        deleteRoute="/admin/sanciones/:id"
        emptyMessage="No hay sanciones registradas"
        emptyIcon="AlertTriangle"
        pagination={items}
        formFields={formFields}
        storeRoute="/admin/sanciones"
        updateRoute="/admin/sanciones/:id"
        modalTitleCreate="Nueva Sanción"
        modalTitleEdit="Editar Sanción"
        modalDescription="Complete los datos de la sanción."
        hidePublishOptions
      />
    </AdminLayout>
  );
}
