import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card, CardContent } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import DynamicIcon from '@/Components/DynamicIcon';

const estadoConfig = {
  presente: { label: 'Presente', color: 'bg-green-100 text-green-700', icon: 'Check' },
  ausente: { label: 'Ausente', color: 'bg-red-100 text-red-700', icon: 'X' },
  tardanza: { label: 'Tardanza', color: 'bg-amber-100 text-amber-700', icon: 'Clock' },
  justificado: { label: 'Justificado', color: 'bg-blue-100 text-blue-700', icon: 'FileCheck' },
};

export default function PorMiembro({ miembro, asistencias, stats, totalEventos }) {
  return (
    <AdminLayout
      title={`Asistencia - ${miembro.nombres}`}
      breadcrumbs={[
        { label: 'Reportes', href: '/admin/reportes/asistencia' },
        { label: `${miembro.apellidos}, ${miembro.nombres}` },
      ]}
    >
      <Head title={`Asistencia ${miembro.nombres} ${miembro.apellidos} - Admin`} />

      <div className="space-y-4">
        {/* Member Header */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Link href="/admin/reportes/asistencia" className="text-gray-400 hover:text-gray-600">
                <DynamicIcon name="ArrowLeft" className="h-5 w-5" />
              </Link>
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  {miembro.apellidos}, {miembro.nombres}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant={miembro.tipo === 'directivo' ? 'default' : 'secondary'}>
                    {miembro.tipo === 'directivo' ? 'Directivo' : 'Danzante'}
                  </Badge>
                  {miembro.cargo && (
                    <span className="text-sm text-gray-500">{miembro.cargo}</span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-5">
          <Card>
            <CardContent className="p-3 text-center">
              <p className="text-xs text-gray-500">Presentes</p>
              <p className="text-xl font-bold text-green-600">{stats.presentes}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <p className="text-xs text-gray-500">Ausentes</p>
              <p className="text-xl font-bold text-red-600">{stats.ausentes}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <p className="text-xs text-gray-500">Tardanzas</p>
              <p className="text-xl font-bold text-amber-600">{stats.tardanzas}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <p className="text-xs text-gray-500">Justificados</p>
              <p className="text-xl font-bold text-blue-600">{stats.justificados}</p>
            </CardContent>
          </Card>
          <Card className="col-span-2 sm:col-span-1">
            <CardContent className="p-3 text-center">
              <p className="text-xs text-gray-500">% Asistencia</p>
              <p className={`text-xl font-bold ${stats.porcentaje < 70 ? 'text-red-600' : 'text-green-600'}`}>
                {stats.porcentaje}%
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Attendance History */}
        <Card>
          <CardContent className="p-0">
            <div className="px-4 py-3 border-b">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Historial de Asistencia
              </h3>
              <p className="text-sm text-gray-500">
                {totalEventos} eventos totales
              </p>
            </div>

            <div className="divide-y">
              {asistencias.data.map((a) => {
                const config = estadoConfig[a.estado] || estadoConfig.ausente;
                return (
                  <div key={a.id} className="flex items-center justify-between px-4 py-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {a.evento?.titulo || 'Evento sin título'}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span className="capitalize">{a.evento?.tipo}</span>
                        {a.evento?.fecha && (
                          <>
                            <span>·</span>
                            <span>
                              {(() => { const [y,m,d] = String(a.evento.fecha).split('T')[0].split('-').map(Number); return new Date(y,m-1,d).toLocaleDateString('es-PE', { day: 'numeric', month: 'short', year: 'numeric' }); })()}
                            </span>
                          </>
                        )}
                        {a.evento?.hora_inicio && (
                          <>
                            <span>·</span>
                            <span>{a.evento.hora_inicio}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${config.color}`}>
                      <DynamicIcon name={config.icon} className="h-3 w-3" />
                      {config.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {asistencias.data.length === 0 && (
              <div className="py-12 text-center text-gray-500">
                <DynamicIcon name="ClipboardList" className="mx-auto h-8 w-8 mb-2 text-gray-300" />
                <p>No hay registros de asistencia</p>
              </div>
            )}

            {/* Pagination */}
            {asistencias.last_page > 1 && (
              <div className="flex items-center justify-between border-t px-4 py-3">
                <p className="text-sm text-gray-500">
                  Página {asistencias.current_page} de {asistencias.last_page}
                </p>
                <div className="flex gap-2">
                  {asistencias.prev_page_url && (
                    <Link href={asistencias.prev_page_url}>
                      <Button variant="outline" size="sm">Anterior</Button>
                    </Link>
                  )}
                  {asistencias.next_page_url && (
                    <Link href={asistencias.next_page_url}>
                      <Button variant="outline" size="sm">Siguiente</Button>
                    </Link>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
