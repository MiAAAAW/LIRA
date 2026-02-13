import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import DataTable from '@/Components/admin/DataTable';

export default function Index({ items, sectionVisible }) {
  const columns = [
    { key: 'imagen_principal', label: 'Imagen', type: 'image' },
    { key: 'titulo', label: 'Título' },
    { key: 'is_published', label: 'Estado', type: 'badge' },
  ];

  // Campos simplificados para el modal - solo titulo e imagen
  const formFields = [
    {
      name: 'titulo',
      label: 'Título',
      required: true,
      placeholder: 'Ej: Estandarte del Centenario',
    },
    {
      name: 'descripcion',
      label: 'Descripción (opcional)',
      type: 'textarea',
      rows: 2,
      placeholder: 'Breve descripción del estandarte',
      fullWidth: true,
    },
    {
      name: 'imagen_principal',
      label: 'Imagen',
      type: 'image',
      required: true,
      helpText: 'Imagen del estandarte (JPG, PNG, max 5MB)',
      fullWidth: true,
    },
  ];

  return (
    <AdminLayout
      title="Estandartes"
      breadcrumbs={[{ label: 'Marco Legal', href: '/admin' }, { label: 'Estandartes' }]}
    >
      <Head title="Estandartes - Admin" />
      <DataTable
        title="Estandartes del Conjunto"
        sectionToggle={{ sectionKey: 'estandartes', isVisible: sectionVisible }}
        data={items.data}
        columns={columns}
        formFields={formFields}
        storeRoute="/admin/estandartes"
        updateRoute="/admin/estandartes/:id"
        deleteRoute="/admin/estandartes/:id"
        modalTitleCreate="Nuevo Estandarte"
        modalTitleEdit="Editar Estandarte"
        modalDescription="Sube la imagen del estandarte con su información básica."
        createLabel="Agregar estandarte"
        emptyMessage="No hay estandartes"
        emptyIcon="Flag"
        pagination={items}
      />
    </AdminLayout>
  );
}
