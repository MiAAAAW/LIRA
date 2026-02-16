import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import DataTable from '@/Components/admin/DataTable';
import { Button } from '@/Components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/Components/ui/dialog';
import DynamicIcon from '@/Components/DynamicIcon';
import { EVENTO_TIPO_LABELS, EVENTO_TIPO_COLORS } from '@/lib/admin-constants';
import { AsistenciaContent } from './Asistencia';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Index({ items }) {
  const [selectedEvento, setSelectedEvento] = useState(null);
  const [asistenciaData, setAsistenciaData] = useState(null);
  const [loadingAsistencia, setLoadingAsistencia] = useState(false);

  useEffect(() => {
    if (!selectedEvento) {
      setAsistenciaData(null);
      return;
    }

    const controller = new AbortController();
    setLoadingAsistencia(true);
    setAsistenciaData(null);

    axios.get(`/admin/eventos/${selectedEvento.id}/asistencia`, {
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    })
      .then(res => {
        setAsistenciaData(res.data);
        setLoadingAsistencia(false);
      })
      .catch(err => {
        if (!axios.isCancel(err)) {
          console.error(err);
          setLoadingAsistencia(false);
        }
        // Si fue cancelado, NO tocar loading — el nuevo fetch ya lo controla
      });

    return () => controller.abort();
  }, [selectedEvento]);

  const handleCloseModal = () => {
    setSelectedEvento(null);
    router.reload({ only: ['items'] });
  };

  const columns = [
    {
      key: 'titulo',
      label: 'Título',
    },
    {
      key: 'tipo',
      label: 'Tipo',
      render: (value) => (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${EVENTO_TIPO_COLORS[value] || EVENTO_TIPO_COLORS.otro}`}>
          {EVENTO_TIPO_LABELS[value] || value}
        </span>
      ),
    },
    {
      key: 'fecha',
      label: 'Fecha',
      render: (value) => {
        if (!value) return '—';
        return new Date(value).toLocaleDateString('es-PE', {
          weekday: 'short',
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        });
      },
    },
    {
      key: 'id',
      label: 'Asistencia',
      render: (_, item) => (
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5"
          onClick={() => setSelectedEvento(item)}
        >
          <DynamicIcon name="ClipboardList" className="h-4 w-4" />
          <span className="hidden sm:inline">Tomar Lista</span>
        </Button>
      ),
    },
    {
      key: 'ubicacion',
      label: 'Ubicación',
      render: (value) => value || '—',
    },
  ];

  const formFields = [
    { name: 'titulo', label: 'Título', required: true, placeholder: 'Ej: Ensayo Martes 18 Feb' },
    {
      name: 'tipo',
      label: 'Tipo de Evento',
      type: 'select',
      required: true,
      options: [
        { value: 'ensayo', label: 'Ensayo' },
        { value: 'reunion', label: 'Reunión' },
        { value: 'presentacion', label: 'Presentación' },
        { value: 'otro', label: 'Otro' },
      ],
    },
    { name: 'fecha', label: 'Fecha', type: 'date', required: true },
    { name: 'hora_inicio', label: 'Hora Inicio', type: 'time' },
    { name: 'hora_fin', label: 'Hora Fin', type: 'time' },
    { name: 'ubicacion', label: 'Ubicación', fullWidth: true },
    { name: 'descripcion', label: 'Descripción', type: 'textarea', fullWidth: true, rows: 3 },
  ];

  return (
    <AdminLayout
      title="Eventos"
      breadcrumbs={[{ label: 'Miembros', href: '/admin' }, { label: 'Eventos' }]}
    >
      <Head title="Eventos - Admin" />
      <DataTable
        title="Eventos del Conjunto"
        data={items.data}
        columns={columns}
        createLabel="Crear evento"
        deleteRoute="/admin/eventos/:id"
        emptyMessage="No hay eventos registrados"
        emptyIcon="Calendar"
        pagination={items}
        formFields={formFields}
        storeRoute="/admin/eventos"
        updateRoute="/admin/eventos/:id"
        modalTitleCreate="Nuevo Evento"
        modalTitleEdit="Editar Evento"
        modalDescription="Complete los datos del evento."
        hidePublishOptions
      />

      <Dialog open={!!selectedEvento} onOpenChange={(open) => { if (!open) handleCloseModal(); }}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0 gap-0">
          <DialogTitle className="sr-only">
            {selectedEvento ? `Asistencia - ${selectedEvento.titulo}` : 'Asistencia'}
          </DialogTitle>
          {loadingAsistencia && (
            <div className="flex items-center justify-center py-20">
              <DynamicIcon name="Loader2" className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          )}
          {asistenciaData && (
            <div className="p-4">
              <AsistenciaContent
                evento={asistenciaData.evento}
                initialMiembros={asistenciaData.miembros}
                initialAsistencias={asistenciaData.asistencias}
                onClose={handleCloseModal}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
