import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import CrudForm from '@/Components/admin/CrudForm';

export default function Edit({ item, tipos, fuentes }) {
  const tipoOptions = Object.entries(tipos).map(([value, label]) => ({ value, label }));
  const fuenteOptions = Object.entries(fuentes).map(([value, label]) => ({ value, label }));

  const isCloudflareAudio = item.tipo_fuente === 'cloudflare' || item.r2_key;

  const fields = [
    { name: 'titulo', label: 'Título', required: true, fullWidth: true },
    { name: 'tipo', label: 'Tipo de Música', type: 'select', options: tipoOptions, required: true },
    {
      name: 'tipo_fuente',
      label: 'Fuente',
      type: 'select',
      options: fuenteOptions,
      required: true,
      helpText: 'Selecciona "Cloudflare R2 (CDN)" para subir archivos directamente'
    },
    {
      name: 'audio_file',
      label: 'Reemplazar Audio',
      type: 'file',
      accept: 'audio/mpeg,audio/wav,audio/ogg,audio/mp4',
      helpText: isCloudflareAudio
        ? 'Audio actual en CDN. Sube uno nuevo para reemplazarlo.'
        : 'Solo para Cloudflare R2. Máx 100MB.',
      fullWidth: true,
      group: 'Archivo CDN'
    },
    {
      name: 'url_audio',
      label: 'URL del Audio',
      fullWidth: true,
      helpText: isCloudflareAudio
        ? 'URL actual del CDN (se actualiza automáticamente al subir nuevo audio)'
        : 'Requerido para SoundCloud/Spotify'
    },
    { name: 'compositor', label: 'Compositor' },
    { name: 'interprete', label: 'Intérprete' },
    { name: 'arreglista', label: 'Arreglista' },
    { name: 'duracion', label: 'Duración' },
    { name: 'anio_composicion', label: 'Año Composición', type: 'number' },
    { name: 'anio_grabacion', label: 'Año Grabación', type: 'number' },
    { name: 'descripcion', label: 'Descripción', type: 'textarea', fullWidth: true, rows: 3 },
    { name: 'letra', label: 'Letra', type: 'textarea', fullWidth: true, rows: 6, group: 'Letra' },
    { name: 'thumbnail', label: 'Imagen', type: 'image', group: 'Archivos Locales' },
    { name: 'partitura_pdf', label: 'Partitura (PDF)', type: 'file', accept: '.pdf', group: 'Archivos Locales' },
  ];

  return (
    <AdminLayout
      title="Editar Audio"
      breadcrumbs={[{ label: 'Multimedia', href: '/admin' }, { label: 'Audios', href: '/admin/audios' }, { label: 'Editar' }]}
    >
      <Head title="Editar Audio - Admin" />
      <div className="max-w-3xl">
        <CrudForm item={item} fields={fields} updateRoute={`/admin/audios/${item.id}`} indexRoute="/admin/audios" />
      </div>
    </AdminLayout>
  );
}
