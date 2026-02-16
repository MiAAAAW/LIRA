import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import DataTable from '@/Components/admin/DataTable';
import { Badge } from '@/Components/ui/badge';

export default function Index({ items, sectionVisible, nextDefaults }) {
  const columns = [
    { key: 'foto', label: 'Foto', type: 'image' },
    {
      key: 'nombres',
      label: 'Nombre Completo',
      render: (_, item) => item.nombre_con_titulo,
    },
    {
      key: 'periodo',
      label: 'Periodo',
    },
    {
      key: 'es_actual',
      label: 'Actual',
      render: (value) => value ? <Badge>Actual</Badge> : null,
    },
    { key: 'is_published', label: 'Estado', type: 'badge' },
  ];

  // Defaults inteligentes basados en el último presidente registrado
  const suggestedStart = nextDefaults?.periodo_inicio;
  const suggestedOrden = nextDefaults?.orden;

  const formFields = [
    {
      name: 'profesion',
      label: 'Título',
      type: 'combobox',
      placeholder: 'Ej: Dr., Ing., Prof.',
      options: [
        { value: 'Sr.', label: 'Sr.' },
        { value: 'Sra.', label: 'Sra.' },
        { value: 'Dr.', label: 'Dr.' },
        { value: 'Prof.', label: 'Prof.' },
        { value: 'Ing.', label: 'Ing.' },
        { value: 'CPC', label: 'CPC' },
        { value: 'Lic.', label: 'Lic.' },
        { value: 'Abog.', label: 'Abog.' },
        { value: 'Mg.', label: 'Mg.' },
        { value: 'Bach.', label: 'Bach.' },
      ],
    },
    { name: 'nombres', label: 'Nombres', required: true },
    { name: 'apellidos', label: 'Apellidos', required: true },
    {
      name: 'periodo_inicio',
      label: 'Año Inicio',
      type: 'number',
      defaultValue: suggestedStart || '',
      placeholder: suggestedStart ? `Sugerido: ${suggestedStart}` : 'Ej: 2027',
    },
    {
      name: 'periodo_fin',
      label: 'Año Fin',
      type: 'number',
      placeholder: 'Vacío si es actual',
    },
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
        modalDescription={
          suggestedStart
            ? `Último periodo termina en ${suggestedStart}. Año inicio se pre-llena.`
            : 'Complete los datos del presidente. Solo uno puede ser "Actual".'
        }
        defaultOrden={suggestedOrden}
      />
    </AdminLayout>
  );
}
