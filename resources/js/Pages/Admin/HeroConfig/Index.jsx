import { Head } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import DataTable from '@/Components/admin/DataTable';
import { Badge } from '@/Components/ui/badge';

const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'avif'];

function isImageUrl(url) {
  if (!url) return false;
  const ext = url.split('?')[0].split('.').pop()?.toLowerCase();
  return IMAGE_EXTENSIONS.includes(ext);
}

export default function Index({ items }) {
  const columns = [
    { key: 'titulo_principal', label: 'Título' },
    { key: 'titulo_highlight', label: 'Highlight' },
    {
      key: 'media_url',
      label: 'Fondo',
      render: (value) => {
        if (!value) return <span className="text-xs text-muted-foreground">Sin media</span>;
        if (isImageUrl(value)) {
          return (
            <div className="h-12 w-20 rounded overflow-hidden bg-muted">
              <img src={value} alt="Hero" className="h-full w-full object-cover" />
            </div>
          );
        }
        return (
          <div className="relative h-12 w-20 rounded overflow-hidden bg-muted flex items-center justify-center group">
            <video
              src={value}
              className="h-full w-full object-cover"
              muted
              preload="metadata"
              onMouseEnter={(e) => e.target.play().catch(() => {})}
              onMouseLeave={(e) => { e.target.pause(); e.target.currentTime = 0; }}
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        );
      }
    },
    {
      key: 'is_featured',
      label: 'Estado',
      render: (value, item) => (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            router.post(`/admin/hero-config/${item.id}/toggle-featured`, {}, { preserveScroll: true });
          }}
          className="cursor-pointer"
        >
          {value ? (
            <Badge className="bg-emerald-500/15 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/25 transition-colors">
              Hero activo
            </Badge>
          ) : (
            <Badge variant="outline" className="text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors">
              Activar
            </Badge>
          )}
        </button>
      ),
    },
  ];

  const formFields = [
    { name: 'titulo_principal', label: 'Título Principal', required: true, fullWidth: true, defaultValue: 'Conjunto Pandillero' },
    { name: 'titulo_highlight', label: 'Texto Destacado (con comillas y gradiente)', defaultValue: 'Lira Puno' },
    { name: 'subtitulo', label: 'Subtítulo', fullWidth: true, defaultValue: 'ALMA MATER DE LA PANDILLA PUNEÑA' },
    { name: 'anios', label: 'Años', defaultValue: '1926 - 2026' },
    {
      name: 'media_file',
      label: 'Fondo del Hero (video o imagen)',
      type: 'direct-upload',
      uploadType: 'hero',
      helpText: 'Video (MP4, WebM) o imagen (JPG, PNG, WebP). Se sube directo al CDN.',
      keyField: 'r2_key_media',
      urlField: 'media_url',
      existingUrlField: 'media_url',
      existingKeyField: 'r2_key_media',
      fullWidth: true,
    },
  ];

  return (
    <AdminLayout
      title="Hero Config"
      breadcrumbs={[{ label: 'Landing Page', href: '/admin' }, { label: 'Hero' }]}
    >
      <Head title="Hero Config - Admin" />
      <DataTable
        title="Configuración del Hero"
        data={items.data}
        columns={columns}
        createLabel="Nuevo Hero"
        deleteRoute="/admin/hero-config/:id"
        emptyMessage="No hay configuraciones de hero"
        emptyIcon="Monitor"
        pagination={items}
        formFields={formFields}
        storeRoute="/admin/hero-config"
        updateRoute="/admin/hero-config/:id"
        modalTitleCreate="Nuevo Hero"
        modalTitleEdit="Editar Hero"
        modalDescription="Configura los textos y fondo del hero."
        hidePublishOptions
      />
    </AdminLayout>
  );
}
