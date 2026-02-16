import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { Input } from '@/Components/ui/input';
import { Button } from '@/Components/ui/button';
import { Card, CardContent } from '@/Components/ui/card';
import DynamicIcon from '@/Components/DynamicIcon';
import { EVENTO_TIPO_LABELS } from '@/lib/admin-constants';
import axios from 'axios';

const ESTADOS = {
  presente: { label: 'P', color: 'bg-green-500 hover:bg-green-600 text-white', activeRing: 'ring-2 ring-green-300' },
  ausente: { label: 'A', color: 'bg-red-500 hover:bg-red-600 text-white', activeRing: 'ring-2 ring-red-300' },
  tardanza: { label: 'T', color: 'bg-amber-500 hover:bg-amber-600 text-white', activeRing: 'ring-2 ring-amber-300' },
  justificado: { label: 'J', color: 'bg-blue-500 hover:bg-blue-600 text-white', activeRing: 'ring-2 ring-blue-300' },
};

export function AsistenciaContent({ evento, initialMiembros, initialAsistencias, onClose }) {
  const [search, setSearch] = useState('');
  const [miembros, setMiembros] = useState(initialMiembros);
  const [asistenciaMap, setAsistenciaMap] = useState(() => {
    const map = {};
    Object.entries(initialAsistencias).forEach(([miembroId, asistencia]) => {
      map[miembroId] = {
        estado: asistencia.estado,
        observacion: asistencia.observacion,
        logs: asistencia.logs || [],
      };
    });
    return map;
  });
  const [savingStates, setSavingStates] = useState({}); // miembroId -> 'saving' | 'saved' | 'error'
  const [estadoLista, setEstadoLista] = useState(evento.estado_lista);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [quickAddData, setQuickAddData] = useState({ nombres: '', apellidos: '', tipo: 'danzante' });
  const [quickAddSaving, setQuickAddSaving] = useState(false);
  const [showLogFor, setShowLogFor] = useState(null);
  const saveTimers = useRef({});
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
      Object.values(saveTimers.current).forEach(clearTimeout);
    };
  }, []);

  const isListaCerrada = estadoLista === 'cerrada';

  // Filter miembros by search
  const filteredMiembros = useMemo(() => {
    if (!search.trim()) return miembros;
    const term = search.toLowerCase().trim();
    return miembros.filter(m =>
      `${m.nombres} ${m.apellidos}`.toLowerCase().includes(term) ||
      `${m.apellidos} ${m.nombres}`.toLowerCase().includes(term)
    );
  }, [miembros, search]);

  // Stats counts
  const stats = useMemo(() => {
    const counts = { presente: 0, ausente: 0, tardanza: 0, justificado: 0, sinMarcar: 0 };
    miembros.forEach(m => {
      const a = asistenciaMap[m.id];
      if (a && a.estado) {
        counts[a.estado]++;
      } else {
        counts.sinMarcar++;
      }
    });
    return counts;
  }, [miembros, asistenciaMap]);

  // Mark attendance (atomic POST)
  const marcarAsistencia = useCallback(async (miembroId, estado) => {
    if (isListaCerrada) return;

    // Optimistic update
    setAsistenciaMap(prev => ({
      ...prev,
      [miembroId]: { ...prev[miembroId], estado },
    }));
    setSavingStates(prev => ({ ...prev, [miembroId]: 'saving' }));

    // Clear previous timers (saved indicator + pending retry)
    if (saveTimers.current[miembroId]) {
      clearTimeout(saveTimers.current[miembroId]);
    }
    if (saveTimers.current[`retry_${miembroId}`]) {
      clearTimeout(saveTimers.current[`retry_${miembroId}`]);
    }

    try {
      await axios.post(`/admin/eventos/${evento.id}/asistencia`, {
        miembro_id: miembroId,
        estado,
        observacion: asistenciaMap[miembroId]?.observacion || null,
      });

      if (!isMounted.current) return;
      setSavingStates(prev => ({ ...prev, [miembroId]: 'saved' }));

      // Clear saved indicator after 2s
      saveTimers.current[miembroId] = setTimeout(() => {
        if (isMounted.current) setSavingStates(prev => ({ ...prev, [miembroId]: null }));
      }, 2000);
    } catch (err) {
      console.error('Error saving attendance:', err);
      if (!isMounted.current) return;
      setSavingStates(prev => ({ ...prev, [miembroId]: 'error' }));

      // Retry after 3s
      const retryTimer = setTimeout(() => {
        if (isMounted.current) marcarAsistencia(miembroId, estado);
      }, 3000);
      saveTimers.current[`retry_${miembroId}`] = retryTimer;
    }
  }, [evento.id, asistenciaMap, isListaCerrada]);

  // Quick add member
  const handleQuickAdd = useCallback(async () => {
    if (!quickAddData.nombres.trim() || !quickAddData.apellidos.trim()) return;

    setQuickAddSaving(true);
    try {
      const { data } = await axios.post(`/admin/eventos/${evento.id}/quick-add-miembro`, quickAddData);
      if (!isMounted.current) return;
      if (data.success) {
        setMiembros(prev => [data.miembro, ...prev]);
        setQuickAddData({ nombres: '', apellidos: '', tipo: 'danzante' });
        setShowQuickAdd(false);
      }
    } catch (err) {
      console.error('Error quick-adding member:', err);
    } finally {
      if (isMounted.current) setQuickAddSaving(false);
    }
  }, [evento.id, quickAddData]);

  // Toggle lista estado
  const toggleLista = useCallback(async () => {
    const action = isListaCerrada ? 'reabrir' : 'cerrar';
    try {
      const { data } = await axios.post(`/admin/eventos/${evento.id}/${action}-lista`);
      if (isMounted.current && data.success) {
        setEstadoLista(data.estado_lista);
      }
    } catch (err) {
      console.error('Error toggling lista:', err);
    }
  }, [evento.id, isListaCerrada]);

  const fechaFormatted = new Date(evento.fecha).toLocaleDateString('es-PE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="mx-auto max-w-3xl space-y-3">
      {/* Header */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                {onClose ? (
                  <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                    <DynamicIcon name="ArrowLeft" className="h-5 w-5" />
                  </button>
                ) : (
                  <Link href="/admin/eventos" className="text-gray-400 hover:text-gray-600">
                    <DynamicIcon name="ArrowLeft" className="h-5 w-5" />
                  </Link>
                )}
                <h1 className="text-lg font-bold text-gray-900 truncate">
                  {evento.titulo}
                </h1>
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-gray-500">
                <span className="capitalize">{EVENTO_TIPO_LABELS[evento.tipo] || evento.tipo}</span>
                <span>·</span>
                <span className="capitalize">{fechaFormatted}</span>
                {evento.hora_inicio && (
                  <>
                    <span>·</span>
                    <span>{evento.hora_inicio}{evento.hora_fin ? ` - ${evento.hora_fin}` : ''}</span>
                  </>
                )}
              </div>
            </div>
            <Button
              variant={isListaCerrada ? 'outline' : 'destructive'}
              size="sm"
              onClick={toggleLista}
              className="flex-shrink-0 gap-1.5"
            >
              <DynamicIcon name={isListaCerrada ? 'LockOpen' : 'Lock'} className="h-4 w-4" />
              <span className="hidden sm:inline">{isListaCerrada ? 'Reabrir' : 'Cerrar'}</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Search */}
      <div className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-900 pb-2">
        <div className="relative">
          <DynamicIcon name="Search" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Buscar miembro..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-11"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <DynamicIcon name="X" className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Quick Add */}
      <div>
        {!showQuickAdd ? (
          <Button
            variant="outline"
            className="w-full gap-2 border-dashed"
            onClick={() => setShowQuickAdd(true)}
            disabled={isListaCerrada}
          >
            <DynamicIcon name="UserPlus" className="h-4 w-4" />
            Agregar miembro nuevo
          </Button>
        ) : (
          <Card>
            <CardContent className="p-3">
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                <Input
                  placeholder="Nombres"
                  value={quickAddData.nombres}
                  onChange={(e) => setQuickAddData(prev => ({ ...prev, nombres: e.target.value }))}
                  className="h-10"
                  autoFocus
                />
                <Input
                  placeholder="Apellidos"
                  value={quickAddData.apellidos}
                  onChange={(e) => setQuickAddData(prev => ({ ...prev, apellidos: e.target.value }))}
                  className="h-10"
                />
                <select
                  value={quickAddData.tipo}
                  onChange={(e) => setQuickAddData(prev => ({ ...prev, tipo: e.target.value }))}
                  className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="danzante">Danzante</option>
                  <option value="directivo">Directivo</option>
                </select>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={handleQuickAdd}
                    disabled={quickAddSaving || !quickAddData.nombres.trim() || !quickAddData.apellidos.trim()}
                    className="flex-1 h-10"
                  >
                    {quickAddSaving ? 'Guardando...' : 'Agregar'}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowQuickAdd(false)}
                    className="h-10 px-2"
                  >
                    <DynamicIcon name="X" className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Stats Summary Bar */}
      <div className="flex items-center justify-between rounded-lg bg-white dark:bg-gray-800 px-4 py-2.5 shadow-sm border">
        <div className="flex items-center gap-4 text-sm">
          <span className="flex items-center gap-1.5" title="Presentes">
            <span className="inline-block h-3 w-3 rounded-full bg-green-500" />
            <span className="font-semibold">{stats.presente}</span>
          </span>
          <span className="flex items-center gap-1.5" title="Ausentes">
            <span className="inline-block h-3 w-3 rounded-full bg-red-500" />
            <span className="font-semibold">{stats.ausente}</span>
          </span>
          <span className="flex items-center gap-1.5" title="Tardanzas">
            <span className="inline-block h-3 w-3 rounded-full bg-amber-500" />
            <span className="font-semibold">{stats.tardanza}</span>
          </span>
          <span className="flex items-center gap-1.5" title="Justificados">
            <span className="inline-block h-3 w-3 rounded-full bg-blue-500" />
            <span className="font-semibold">{stats.justificado}</span>
          </span>
        </div>
        <span className="text-xs text-gray-500">
          {miembros.length - stats.sinMarcar}/{miembros.length} marcados
        </span>
      </div>

      {isListaCerrada && (
        <div className="flex items-center gap-2 rounded-lg bg-amber-50 border border-amber-200 px-4 py-2 text-sm text-amber-700">
          <DynamicIcon name="Lock" className="h-4 w-4" />
          Lista cerrada. Reabra para modificar.
        </div>
      )}

      {/* Members List */}
      <div className="space-y-1.5">
        {filteredMiembros.length === 0 && (
          <div className="py-12 text-center text-gray-500">
            <DynamicIcon name="SearchX" className="mx-auto h-8 w-8 mb-2 text-gray-300" />
            <p>No se encontraron miembros</p>
          </div>
        )}

        {filteredMiembros.map((miembro) => {
          const asistencia = asistenciaMap[miembro.id];
          const currentEstado = asistencia?.estado || null;
          const saveState = savingStates[miembro.id];

          return (
            <div
              key={miembro.id}
              className="flex items-center gap-3 rounded-lg bg-white dark:bg-gray-800 px-3 py-2.5 shadow-sm border"
            >
              {/* Name & Type */}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {miembro.apellidos}, {miembro.nombres}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">
                    {miembro.tipo === 'directivo' ? `Dir. ${miembro.cargo || ''}` : 'Danz.'}
                  </span>
                  {/* Save indicator */}
                  {saveState === 'saving' && (
                    <span className="text-xs text-gray-400 animate-pulse">guardando...</span>
                  )}
                  {saveState === 'saved' && (
                    <span className="flex items-center gap-0.5 text-xs text-green-600">
                      <DynamicIcon name="Check" className="h-3 w-3" />
                      guardado
                    </span>
                  )}
                  {saveState === 'error' && (
                    <span className="flex items-center gap-0.5 text-xs text-red-600 animate-pulse">
                      <DynamicIcon name="AlertCircle" className="h-3 w-3" />
                      error, reintentando...
                    </span>
                  )}
                </div>
              </div>

              {/* Estado Buttons */}
              <div className="flex gap-1">
                {Object.entries(ESTADOS).map(([key, config]) => (
                  <button
                    key={key}
                    onClick={() => marcarAsistencia(miembro.id, key)}
                    disabled={isListaCerrada}
                    className={`
                      flex h-9 w-9 items-center justify-center rounded-md text-xs font-bold transition-all
                      ${currentEstado === key
                        ? `${config.color} ${config.activeRing} scale-105`
                        : 'bg-gray-100 text-gray-400 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-500'
                      }
                      ${isListaCerrada ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer active:scale-95'}
                    `}
                    title={key.charAt(0).toUpperCase() + key.slice(1)}
                  >
                    {config.label}
                  </button>
                ))}
              </div>

              {/* Log link */}
              {asistencia?.logs?.length > 0 && (
                <button
                  onClick={() => setShowLogFor(showLogFor === miembro.id ? null : miembro.id)}
                  className="text-xs text-gray-400 hover:text-gray-600 flex-shrink-0"
                  title="Ver historial"
                >
                  <DynamicIcon name="History" className="h-4 w-4" />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Log Modal (inline) */}
      {showLogFor && asistenciaMap[showLogFor]?.logs?.length > 0 && (
        <Card className="border-blue-200 bg-blue-50/50">
          <CardContent className="p-3">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-semibold text-blue-900">
                Historial de cambios
              </h4>
              <button onClick={() => setShowLogFor(null)} className="text-blue-400 hover:text-blue-600">
                <DynamicIcon name="X" className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-1">
              {asistenciaMap[showLogFor].logs.map((log, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-blue-800">
                  <span className="text-blue-400">
                    {new Date(log.created_at).toLocaleString('es-PE', { dateStyle: 'short', timeStyle: 'short' })}
                  </span>
                  <span>
                    {log.estado_anterior
                      ? `${log.estado_anterior} → ${log.estado_nuevo}`
                      : `Marcado: ${log.estado_nuevo}`
                    }
                  </span>
                  {log.user && (
                    <span className="text-blue-400">por {log.user.name}</span>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default function Asistencia({ evento, miembros, asistencias }) {
  return (
    <AdminLayout
      title="Tomar Lista"
      breadcrumbs={[
        { label: 'Eventos', href: '/admin/eventos' },
        { label: evento.titulo },
        { label: 'Asistencia' },
      ]}
    >
      <Head title={`Asistencia - ${evento.titulo}`} />
      <AsistenciaContent
        evento={evento}
        initialMiembros={miembros}
        initialAsistencias={asistencias}
      />
    </AdminLayout>
  );
}
