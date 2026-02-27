import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import DataTable from '@/Components/admin/DataTable';

export default function Index({ items, tipos, sectionVisible }) {
  const tipoOptions = Object.entries(tipos || {}).map(([value, label]) => ({ value, label }));

  const columns = [
    { key: 'image_url', label: 'Portada', type: 'image' },
    { key: 'titulo', label: 'Titulo' },
    {
      key: 'tipo',
      label: 'Tipo',
      render: (value) => tipos?.[value] || value
    },
    { key: 'autor', label: 'Autor' },
    { key: 'anio_publicacion', label: 'Año' },
    {
      key: 'documento_pdf',
      label: 'PDF',
      render: (value, item) => {
        const pdfUrl = item.pdf_url || value;
        return pdfUrl ? (
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline text-sm"
          >
            Ver PDF
          </a>
        ) : item.enlace_externo ? (
          <a
            href={item.enlace_externo}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline text-sm"
          >
            Enlace
          </a>
        ) : (
          <span className="text-gray-400 text-sm">Sin PDF</span>
        );
      }
    },
    { key: 'is_published', label: 'Estado', type: 'badge' },
  ];

  // Formulario simplificado - solo campos esenciales
  const formFields = [
    {
      name: 'titulo',
      label: 'Titulo',
      required: true,
      fullWidth: true,
    },
    {
      name: 'tipo',
      label: 'Tipo',
      type: 'select',
      options: tipoOptions,
      required: true,
      defaultValue: 'libro',
    },
    {
      name: 'autor',
      label: 'Autor',
      required: true,
    },
    {
      name: 'anio_publicacion',
      label: 'Año',
      type: 'number',
      placeholder: '2024'
    },
    {
      name: 'imagen_portada',
      label: 'Portada',
      type: 'direct-upload',
      uploadType: 'images/publicaciones',
      keyField: 'r2_image_key',
      urlField: 'r2_image_url',
      required: true,
      helpText: 'Max 10MB. Subida directa a CDN.',
    },
    {
      name: 'documento_pdf',
      label: 'PDF',
      type: 'direct-upload',
      uploadType: 'documents/publicaciones',
      fullWidth: true,
      helpText: 'Opcional. Max 200MB. Subida directa a CDN.',
      keyField: 'r2_pdf_key',
      urlField: 'r2_pdf_url',
    },
  ];

  return (
    <AdminLayout
      title="Publicaciones"
      breadcrumbs={[{ label: 'Multimedia', href: '/admin' }, { label: 'Publicaciones' }]}
    >
      <Head title="Publicaciones - Admin" />
      <DataTable
        title="Libros y Publicaciones"
        sectionToggle={{ sectionKey: 'publicaciones', isVisible: sectionVisible }}
        data={items.data}
        columns={columns}
        createLabel="Agregar publicacion"
        deleteRoute="/admin/publicaciones/:id"
        emptyMessage="No hay publicaciones registradas"
        emptyIcon="BookOpen"
        pagination={items}
        // Modal mode con scroll
        formFields={formFields}
        storeRoute="/admin/publicaciones"
        updateRoute="/admin/publicaciones/:id"
        modalTitleCreate="Nueva Publicacion"
        modalTitleEdit="Editar Publicacion"
        modalDescription="Registra libros, revistas, articulos y otras publicaciones."
      />
    </AdminLayout>
  );
}
