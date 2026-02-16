import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import DataTable from '@/Components/admin/DataTable';

export default function Index({ items, tiposRegistro, sectionVisible }) {
  const columns = [
    { key: 'titulo', label: 'Titulo' },
    { key: 'tipo_registro', label: 'Tipo' },
    { key: 'numero_registro', label: 'N Registro' },
    { key: 'fecha_registro', label: 'Fecha', type: 'date' },
    { key: 'is_published', label: 'Estado', type: 'badge' },
  ];

  // Convertir tipos de registro a opciones para el select
  const tipoOptions = tiposRegistro
    ? Object.entries(tiposRegistro).map(([value, label]) => ({ value, label }))
    : [
        { value: 'marca', label: 'Marca' },
        { value: 'denominacion_origen', label: 'Denominacion de Origen' },
        { value: 'patrimonio', label: 'Patrimonio Cultural' },
      ];

  // Form fields for modal creation (simplificado - el PDF contiene todo el detalle)
  const createFields = [
    {
      name: 'titulo',
      label: 'Titulo del Registro',
      required: true,
      placeholder: 'Ej: Registro de Marca Colectiva...',
    },
    {
      name: 'tipo_registro',
      label: 'Tipo de Registro',
      type: 'select',
      options: tipoOptions,
    },
    {
      name: 'numero_registro',
      label: 'Numero de Registro',
      placeholder: 'Ej: 00123456',
    },
    {
      name: 'fecha_registro',
      label: 'Fecha de Registro',
      type: 'date',
    },
    {
      name: 'certificado_pdf',
      label: 'Certificado PDF',
      type: 'direct-upload',
      uploadType: 'documents/indecopi',
      keyField: 'r2_pdf_key',
      urlField: 'r2_pdf_url',
      required: true,
      fullWidth: true,
      helpText: 'Max 50MB. Subida directa a CDN.',
    },
  ];

  return (
    <AdminLayout
      title="INDECOPI"
      breadcrumbs={[
        { label: 'Marco Legal', href: '/admin' },
        { label: 'INDECOPI' },
      ]}
    >
      <Head title="INDECOPI - Admin" />
      <DataTable
        title="Registros INDECOPI"
        sectionToggle={{ sectionKey: 'indecopi', isVisible: sectionVisible }}
        data={items.data}
        columns={columns}
        createLabel="Agregar registro"
        formFields={createFields}
        storeRoute="/admin/indecopi"
        updateRoute="/admin/indecopi/:id"
        modalTitleCreate="Nuevo Registro INDECOPI"
        modalTitleEdit="Editar Registro INDECOPI"
        modalDescription="El certificado PDF contiene todo el detalle del registro."
        deleteRoute="/admin/indecopi/:id"
        emptyMessage="No hay registros INDECOPI"
        emptyIcon="Shield"
        pagination={items}
      />
    </AdminLayout>
  );
}
