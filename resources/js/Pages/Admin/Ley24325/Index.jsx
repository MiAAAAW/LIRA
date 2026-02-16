import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import DataTable from '@/Components/admin/DataTable';

export default function Index({ items, sectionVisible }) {
  const columns = [
    {
      key: 'titulo',
      label: 'Título',
    },
    {
      key: 'numero_ley',
      label: 'Número',
    },
    {
      key: 'fecha_promulgacion',
      label: 'Fecha',
      type: 'date',
    },
    {
      key: 'is_published',
      label: 'Estado',
      type: 'badge',
    },
  ];

  // Form fields for modal creation (simplificado - el PDF contiene todo el detalle)
  const createFields = [
    {
      name: 'titulo',
      label: 'Título',
      required: true,
      placeholder: 'Ej: Ley que declara Patrimonio Cultural...',
    },
    {
      name: 'numero_ley',
      label: 'Número de Ley',
      placeholder: 'Ej: 24325',
    },
    {
      name: 'fecha_promulgacion',
      label: 'Fecha de Promulgación',
      type: 'date',
    },
    {
      name: 'documento_pdf',
      label: 'Documento PDF',
      type: 'direct-upload',
      uploadType: 'documents/ley24325',
      keyField: 'r2_pdf_key',
      urlField: 'r2_pdf_url',
      required: true,
      fullWidth: true,
      helpText: 'Max 50MB. Subida directa a CDN.',
    },
  ];

  return (
    <AdminLayout
      title="Ley 24325"
      breadcrumbs={[
        { label: 'Marco Legal', href: '/admin' },
        { label: 'Ley 24325' },
      ]}
    >
      <Head title="Ley 24325 - Admin" />

      <DataTable
        title="Gestión Ley 24325"
        sectionToggle={{ sectionKey: 'ley24325', isVisible: sectionVisible }}
        data={items.data}
        columns={columns}
        createLabel="Agregar registro"
        formFields={createFields}
        storeRoute="/admin/ley24325"
        updateRoute="/admin/ley24325/:id"
        modalTitleCreate="Nuevo Registro Ley 24325"
        modalTitleEdit="Editar Registro Ley 24325"
        modalDescription="El PDF oficial contiene todo el detalle de la ley."
        deleteRoute="/admin/ley24325/:id"
        emptyMessage="No hay registros de la Ley 24325"
        emptyIcon="Scale"
        pagination={items}
      />
    </AdminLayout>
  );
}
