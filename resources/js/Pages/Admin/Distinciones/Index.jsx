import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import DataTable from '@/Components/admin/DataTable';

export default function Index({ items, tipos }) {
  const tipoOptions = Object.entries(tipos || {}).map(([value, label]) => ({ value, label }));

  const columns = [
    { key: 'titulo', label: 'Titulo' },
    {
      key: 'tipo',
      label: 'Tipo',
      render: (value) => tipos?.[value] || value
    },
    { key: 'otorgante', label: 'Otorgante' },
    { key: 'fecha_otorgamiento', label: 'Fecha', type: 'date' },
    {
      key: 'pdf_url',
      label: 'PDF',
      render: (value) => value ? (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline text-sm"
        >
          Ver PDF
        </a>
      ) : (
        <span className="text-gray-400 text-sm">Sin PDF</span>
      )
    },
    { key: 'is_published', label: 'Estado', type: 'badge' },
  ];

  // Campos simplificados para modal (5 campos)
  const formFields = [
    {
      name: 'titulo',
      label: 'Titulo de la distincion',
      required: true,
      fullWidth: true,
      placeholder: 'Ej: Reconocimiento al Merito Cultural'
    },
    {
      name: 'tipo',
      label: 'Tipo',
      type: 'select',
      options: tipoOptions,
      required: true
    },
    {
      name: 'otorgante',
      label: 'Institucion otorgante',
      required: true,
      placeholder: 'Ej: Ministerio de Cultura'
    },
    {
      name: 'fecha_otorgamiento',
      label: 'Fecha de otorgamiento',
      type: 'date',
      required: true
    },
    {
      name: 'documento_pdf',
      label: 'Documento PDF',
      type: 'direct-upload',
      uploadType: 'documents',
      required: true,
      fullWidth: true,
      helpText: 'Certificado o resolucion en PDF. Maximo 50MB.',
      // Mapeo de campos para el formulario
      keyField: 'r2_pdf_key',
      urlField: 'r2_pdf_url',
    },
  ];

  return (
    <AdminLayout
      title="Distinciones"
      breadcrumbs={[{ label: 'Multimedia', href: '/admin' }, { label: 'Distinciones' }]}
    >
      <Head title="Distinciones - Admin" />
      <DataTable
        title="Premios y Reconocimientos"
        data={items.data}
        columns={columns}
        createLabel="Agregar distincion"
        deleteRoute="/admin/distinciones/:id"
        emptyMessage="No hay distinciones registradas"
        emptyIcon="Award"
        pagination={items}
        // Modal mode
        formFields={formFields}
        storeRoute="/admin/distinciones"
        updateRoute="/admin/distinciones/:id"
        modalTitleCreate="Nueva Distincion"
        modalTitleEdit="Editar Distincion"
        modalDescription="Registra premios, reconocimientos y condecoraciones recibidas."
      />
    </AdminLayout>
  );
}
