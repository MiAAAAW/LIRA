import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import DataTable from '@/Components/admin/DataTable';

export default function Index({ items, tipos, sectionVisible }) {
  const tipoOptions = Object.entries(tipos || {}).map(([value, label]) => ({ value, label }));

  const columns = [
    { key: 'titulo', label: 'Título' },
    { key: 'tipo', label: 'Tipo', render: (value) => tipos?.[value] || value },
    { key: 'numero', label: 'Número' },
    { key: 'fecha', label: 'Fecha', type: 'date' },
    { key: 'firmante', label: 'Firmante' },
    { key: 'is_featured', label: 'Anuncio', type: 'featured', featuredLabel: 'Fijado' },
    { key: 'is_published', label: 'Estado', type: 'badge' },
  ];

  const formFields = [
    { name: 'titulo', label: 'Título', required: true, fullWidth: true, placeholder: 'Ej: Resolución sobre actividades 2026' },
    { name: 'tipo', label: 'Tipo', type: 'select', options: tipoOptions, required: true, defaultValue: 'comunicado' },
    { name: 'numero', label: 'Número', placeholder: 'Ej: 001-2026' },
    { name: 'fecha', label: 'Fecha', type: 'date', required: true },
    { name: 'firmante', label: 'Firmante', placeholder: 'Nombre del firmante' },
    { name: 'contenido', label: 'Contenido', type: 'rich-text', required: true, fullWidth: true, placeholder: 'Escribe el contenido del comunicado...' },
    { name: 'imagen', label: 'Imagen adjunta', type: 'image' },
  ];

  return (
    <AdminLayout
      title="Comunicados"
      breadcrumbs={[{ label: 'Multimedia', href: '/admin' }, { label: 'Comunicados' }]}
    >
      <Head title="Comunicados - Admin" />
      <DataTable
        title="Comunicados Oficiales"
        sectionToggle={{ sectionKey: 'comunicados', isVisible: sectionVisible }}
        data={items.data}
        columns={columns}
        createLabel="Nuevo comunicado"
        deleteRoute="/admin/comunicados/:id"
        emptyMessage="No hay comunicados"
        emptyIcon="Megaphone"
        pagination={items}
        formFields={formFields}
        storeRoute="/admin/comunicados"
        updateRoute="/admin/comunicados/:id"
        modalTitleCreate="Nuevo Comunicado"
        modalTitleEdit="Editar Comunicado"
        modalDescription="Registra comunicados oficiales, resoluciones y circulares."
        featuredConfig={{
          exclusive: true,
          label: 'Fijar como anuncio',
          warningText: 'Solo 1 comunicado puede ser anuncio. Reemplazará al actual.',
        }}
      />
    </AdminLayout>
  );
}
