import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import DataTable from '@/Components/admin/DataTable';

export default function Index({ items, tiposDocumento, sectionVisible }) {
  const columns = [
    { key: 'titulo', label: 'Título' },
    { key: 'tipo_documento', label: 'Tipo' },
    { key: 'numero_documento', label: 'Número' },
    { key: 'fecha_emision', label: 'Fecha', type: 'date' },
    { key: 'is_published', label: 'Estado', type: 'badge' },
  ];

  // Convertir tipos de documento a opciones para el select (viene como objeto clave-valor)
  const tipoOptions = tiposDocumento
    ? Object.entries(tiposDocumento).map(([value, label]) => ({ value, label }))
    : [
        { value: 'Resolución', label: 'Resolución' },
        { value: 'Decreto', label: 'Decreto' },
        { value: 'Ley', label: 'Ley' },
        { value: 'Ordenanza', label: 'Ordenanza' },
        { value: 'Directiva', label: 'Directiva' },
        { value: 'Otro', label: 'Otro' },
      ];

  // Form fields for modal creation (simplificado - el PDF contiene todo el detalle)
  const createFields = [
    {
      name: 'titulo',
      label: 'Título del Documento',
      required: true,
      placeholder: 'Ej: Resolución que aprueba...',
    },
    {
      name: 'tipo_documento',
      label: 'Tipo de Documento',
      type: 'select',
      options: tipoOptions,
      required: true,
      defaultValue: 'resolucion',
    },
    {
      name: 'numero_documento',
      label: 'Número de Documento',
      placeholder: 'Ej: 001-2026',
    },
    {
      name: 'fecha_emision',
      label: 'Fecha de Emisión',
      type: 'date',
    },
    {
      name: 'documento_pdf',
      label: 'Documento PDF',
      type: 'file',
      accept: '.pdf',
      required: true,
      helpText: 'Resolución, decreto o normativa en PDF',
    },
  ];

  return (
    <AdminLayout
      title="Base Legal"
      breadcrumbs={[
        { label: 'Marco Legal', href: '/admin' },
        { label: 'Base Legal' },
      ]}
    >
      <Head title="Base Legal - Admin" />
      <DataTable
        title="Documentos Legales"
        sectionToggle={{ sectionKey: 'base_legal', isVisible: sectionVisible }}
        data={items.data}
        columns={columns}
        createLabel="Agregar documento"
        formFields={createFields}
        storeRoute="/admin/base-legal"
        updateRoute="/admin/base-legal/:id"
        modalTitleCreate="Nuevo Documento Legal"
        modalTitleEdit="Editar Documento Legal"
        modalDescription="El PDF oficial contiene todo el detalle del documento."
        deleteRoute="/admin/base-legal/:id"
        emptyMessage="No hay documentos legales"
        emptyIcon="FileText"
        pagination={items}
      />
    </AdminLayout>
  );
}
