import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import DataTable from '@/Components/admin/DataTable';

export default function Index({ items, sectionVisible }) {
  const columns = [
    {
      key: 'preview',
      label: 'Preview',
      render: (value, item) => {
        const thumbnailUrl = item.thumbnail_url || item.thumbnail;
        const videoUrl = item.playable_url || item.r2_video_url || item.url_video;

        return (
          <div className="relative h-12 w-20 rounded overflow-hidden bg-muted flex items-center justify-center group">
            {thumbnailUrl ? (
              // Mostrar thumbnail
              <img src={thumbnailUrl} alt="" className="h-full w-full object-cover" />
            ) : videoUrl ? (
              // Mostrar video preview pequeño
              <video
                src={videoUrl}
                className="h-full w-full object-cover"
                muted
                preload="metadata"
                onMouseEnter={(e) => e.target.play().catch(() => {})}
                onMouseLeave={(e) => { e.target.pause(); e.target.currentTime = 0; }}
              />
            ) : (
              // Placeholder
              <span className="text-xs text-muted-foreground">Sin video</span>
            )}
            {/* Play icon overlay */}
            {videoUrl && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            )}
          </div>
        );
      }
    },
    { key: 'titulo', label: 'Título' },
    {
      key: 'tipo_fuente',
      label: 'Fuente',
      render: (value) => {
        const labels = { youtube: 'YouTube', vimeo: 'Vimeo', cloudflare: 'CDN', local: 'Local' };
        return labels[value] || value;
      }
    },
    { key: 'is_published', label: 'Estado', type: 'badge' },
  ];

  const formFields = [
    { name: 'titulo', label: 'Título del video', required: true, fullWidth: true },
    { name: 'descripcion', label: 'Descripción', type: 'textarea', rows: 2, fullWidth: true },
    {
      name: 'tipo_fuente',
      label: 'Fuente del video',
      type: 'select',
      defaultValue: 'cloudflare',
      options: [
        { value: 'cloudflare', label: 'Subir archivo al CDN' },
        { value: 'youtube', label: 'YouTube (enlace)' },
      ],
    },
    // Solo visible cuando tipo_fuente = 'youtube'
    {
      name: 'url_video',
      label: 'Enlace de YouTube',
      placeholder: 'https://www.youtube.com/watch?v=...',
      helpText: 'youtube.com/watch?v=... · youtu.be/... · youtube.com/shorts/...',
      fullWidth: true,
      dependsOn: { field: 'tipo_fuente', value: 'youtube' },
    },
    // Solo visible cuando tipo_fuente = 'cloudflare'
    {
      name: 'video_file',
      label: 'Archivo de video',
      type: 'direct-upload',
      uploadType: 'videos',
      helpText: 'MP4 o WebM. Hasta 5GB. Se sube directo al CDN.',
      existingUrlField: 'playable_url',
      existingKeyField: 'r2_key',
      dependsOn: { field: 'tipo_fuente', value: 'cloudflare' },
    },
  ];

  return (
    <AdminLayout
      title="Videos"
      breadcrumbs={[{ label: 'Multimedia', href: '/admin' }, { label: 'Videos' }]}
    >
      <Head title="Videos - Admin" />
      <DataTable
        title="Galería de Videos"
        sectionToggle={{ sectionKey: 'videos', isVisible: sectionVisible }}
        data={items.data}
        columns={columns}
        createLabel="Subir video"
        deleteRoute="/admin/videos/:id"
        emptyMessage="No hay videos"
        emptyIcon="Video"
        pagination={items}
        // Modal mode
        formFields={formFields}
        storeRoute="/admin/videos"
        updateRoute="/admin/videos/:id"
        modalTitleCreate="Subir nuevo video"
        modalTitleEdit="Editar video"
        modalDescription="Sube un archivo al CDN o pega un enlace de YouTube."
      />
    </AdminLayout>
  );
}
