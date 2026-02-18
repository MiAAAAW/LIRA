import { Head } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import DataTable from '@/Components/admin/DataTable';
import { Badge } from '@/Components/ui/badge';

export default function Index({ items }) {
  const columns = [
    { key: 'titulo', label: 'Título' },
    {
      key: 'audio_url',
      label: 'Audio',
      render: (value) => {
        if (!value) return <span className="text-xs text-muted-foreground">Sin audio</span>;
        return (
          <audio controls preload="metadata" className="w-64 min-w-[16rem] max-w-full">
            <source src={value} />
          </audio>
        );
      },
    },
    {
      key: 'volume',
      label: 'Volumen',
      render: (value) => (
        <span className="text-sm text-muted-foreground">{value ?? 30}%</span>
      ),
    },
    {
      key: 'loop',
      label: 'Loop',
      render: (value) => (
        <Badge variant={value ? 'default' : 'outline'} className={value ? 'bg-blue-500/15 text-blue-500 border-blue-500/20' : ''}>
          {value ? 'Sí' : 'No'}
        </Badge>
      ),
    },
    {
      key: 'is_featured',
      label: 'Estado',
      render: (value, item) => (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            router.post(`/admin/music-config/${item.id}/toggle-featured`, {}, { preserveScroll: true });
          }}
          className="cursor-pointer"
        >
          {value ? (
            <Badge className="bg-emerald-500/15 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/25 transition-colors">
              Activa
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
    { name: 'titulo', label: 'Título', required: true },
    { name: 'volume', label: 'Volumen', type: 'range', min: 0, max: 100, step: 5, suffix: '%', defaultValue: 30 },
    {
      name: 'audio_file',
      label: 'Archivo de Audio',
      type: 'direct-upload',
      uploadType: 'music',
      helpText: 'MP3, WAV, OGG o M4A. Se sube directo al CDN.',
      keyField: 'r2_key_audio',
      urlField: 'audio_url',
      existingUrlField: 'audio_url',
      existingKeyField: 'r2_key_audio',
      fullWidth: true,
    },
    { name: 'loop', label: 'Repetir en bucle', type: 'checkbox', defaultValue: true },
  ];

  return (
    <AdminLayout
      title="Música de Fondo"
      breadcrumbs={[{ label: 'Landing Page', href: '/admin' }, { label: 'Música de Fondo' }]}
    >
      <Head title="Música de Fondo - Admin" />
      <DataTable
        title="Música de Fondo"
        data={items.data}
        columns={columns}
        createLabel="Nueva Música"
        deleteRoute="/admin/music-config/:id"
        emptyMessage="No hay música de fondo configurada"
        emptyIcon="Music2"
        pagination={items}
        formFields={formFields}
        storeRoute="/admin/music-config"
        updateRoute="/admin/music-config/:id"
        modalTitleCreate="Nueva Música de Fondo"
        modalTitleEdit="Editar Música de Fondo"
        modalDescription="Configura el audio ambiental para el landing page."
        hidePublishOptions
      />
    </AdminLayout>
  );
}
