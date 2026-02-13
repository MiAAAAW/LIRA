import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import DataTable from '@/Components/admin/DataTable';

export default function Index({ items, tipos, sectionVisible }) {
  const tipoOptions = Object.entries(tipos || {}).map(([value, label]) => ({ value, label }));

  const columns = [
    { key: 'titulo', label: 'Título' },
    {
      key: 'tipo',
      label: 'Tipo',
      render: (value) => {
        const labels = tipos || {};
        return labels[value] || value;
      }
    },
    { key: 'compositor', label: 'Compositor' },
    { key: 'is_published', label: 'Estado', type: 'badge' },
  ];

  // Simplified form fields - upload directo a CDN con progress bar
  const formFields = [
    { name: 'titulo', label: 'Título', required: true, fullWidth: true },
    { name: 'tipo', label: 'Tipo de música', type: 'select', options: tipoOptions, required: true, defaultValue: 'pandilla' },
    {
      name: 'audio_file',
      label: 'Archivo de audio',
      type: 'direct-upload',
      uploadType: 'audios',
      helpText: 'MP3, WAV u OGG. Hasta 500MB. Se sube directo al CDN.',
      required: true
    },
    { name: 'compositor', label: 'Compositor' },
    { name: 'interprete', label: 'Intérprete' },
  ];

  return (
    <AdminLayout
      title="Audios"
      breadcrumbs={[{ label: 'Multimedia', href: '/admin' }, { label: 'Audios' }]}
    >
      <Head title="Audios - Admin" />
      <DataTable
        title="Música Tradicional"
        sectionToggle={{ sectionKey: 'audios', isVisible: sectionVisible }}
        data={items.data}
        columns={columns}
        createLabel="Subir audio"
        deleteRoute="/admin/audios/:id"
        emptyMessage="No hay audios"
        emptyIcon="Music"
        pagination={items}
        // Modal mode
        formFields={formFields}
        storeRoute="/admin/audios"
        updateRoute="/admin/audios/:id"
        modalTitleCreate="Subir nuevo audio"
        modalTitleEdit="Editar audio"
        modalDescription="El audio se sube directo al CDN con progress bar"
      />
    </AdminLayout>
  );
}
