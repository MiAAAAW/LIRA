import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import CrudForm from '@/Components/admin/CrudForm';

export default function Edit({ item, tipos, fuentes }) {
  const tipoOptions = Object.entries(tipos).map(([value, label]) => ({ value, label }));
  const fuenteOptions = Object.entries(fuentes).map(([value, label]) => ({ value, label }));

  const fields = [
    { name: 'titulo', label: 'Título', required: true, fullWidth: true },
    { name: 'tipo', label: 'Tipo de Música', type: 'select', options: tipoOptions, required: true },
    { name: 'tipo_fuente', label: 'Fuente', type: 'select', options: fuenteOptions, required: true },
    { name: 'url_audio', label: 'URL del Audio', required: true, fullWidth: true },
    { name: 'compositor', label: 'Compositor' },
    { name: 'interprete', label: 'Intérprete' },
    { name: 'arreglista', label: 'Arreglista' },
    { name: 'duracion', label: 'Duración' },
    { name: 'anio_composicion', label: 'Año Composición', type: 'number' },
    { name: 'anio_grabacion', label: 'Año Grabación', type: 'number' },
    { name: 'descripcion', label: 'Descripción', type: 'textarea', fullWidth: true, rows: 3 },
    { name: 'letra', label: 'Letra', type: 'textarea', fullWidth: true, rows: 6, group: 'Letra' },
    { name: 'thumbnail', label: 'Imagen', type: 'image', group: 'Archivos' },
    { name: 'partitura_pdf', label: 'Partitura (PDF)', type: 'file', accept: '.pdf', group: 'Archivos' },
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
