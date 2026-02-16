import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import DynamicIcon from '@/Components/DynamicIcon';
import { useState, useMemo } from 'react';

export default function Reportes({ miembros, totalEventos, filtroTipo }) {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('porcentaje'); // porcentaje | nombre | ausentes

  const filteredMiembros = useMemo(() => {
    let list = [...miembros];

    if (search.trim()) {
      const term = search.toLowerCase();
      list = list.filter(m =>
        m.nombre_completo.toLowerCase().includes(term)
      );
    }

    list.sort((a, b) => {
      if (sortBy === 'porcentaje') return a.porcentaje - b.porcentaje; // lowest first (most problematic)
      if (sortBy === 'nombre') return a.apellidos.localeCompare(b.apellidos);
      if (sortBy === 'ausentes') return b.ausentes - a.ausentes;
      return 0;
    });

    return list;
  }, [miembros, search, sortBy]);

  const handleFilterTipo = (tipo) => {
    router.get('/admin/reportes/asistencia', tipo ? { tipo } : {}, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  return (
    <AdminLayout
      title="Reportes de Asistencia"
      breadcrumbs={[
        { label: 'Miembros', href: '/admin' },
        { label: 'Reportes de Asistencia' },
      ]}
    >
      <Head title="Reportes de Asistencia - Admin" />

      <div className="space-y-4">
        {/* Summary Stats */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-500">Total Eventos</p>
              <p className="text-2xl font-bold">{totalEventos}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-500">Miembros Activos</p>
              <p className="text-2xl font-bold">{miembros.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-500">Baja Asistencia (&lt;70%)</p>
              <p className="text-2xl font-bold text-red-600">
                {miembros.filter(m => m.baja_asistencia).length}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <DynamicIcon name="Search" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Buscar miembro..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={!filtroTipo ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleFilterTipo(null)}
                >
                  Todos
                </Button>
                <Button
                  variant={filtroTipo === 'danzante' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleFilterTipo('danzante')}
                >
                  Danzantes
                </Button>
                <Button
                  variant={filtroTipo === 'directivo' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleFilterTipo('directivo')}
                >
                  Directivos
                </Button>
              </div>
              <div className="flex gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="porcentaje">Menor asistencia</option>
                  <option value="ausentes">Más ausencias</option>
                  <option value="nombre">Nombre A-Z</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-50 dark:bg-gray-800">
                    <th className="px-4 py-3 text-left font-medium text-gray-500">Miembro</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">Tipo</th>
                    <th className="px-4 py-3 text-center font-medium text-gray-500">
                      <span className="inline-block h-3 w-3 rounded-full bg-green-500" title="Presentes" />
                    </th>
                    <th className="px-4 py-3 text-center font-medium text-gray-500">
                      <span className="inline-block h-3 w-3 rounded-full bg-red-500" title="Ausentes" />
                    </th>
                    <th className="px-4 py-3 text-center font-medium text-gray-500">
                      <span className="inline-block h-3 w-3 rounded-full bg-amber-500" title="Tardanzas" />
                    </th>
                    <th className="px-4 py-3 text-center font-medium text-gray-500">
                      <span className="inline-block h-3 w-3 rounded-full bg-blue-500" title="Justificados" />
                    </th>
                    <th className="px-4 py-3 text-center font-medium text-gray-500">% Asist.</th>
                    <th className="px-4 py-3 text-center font-medium text-gray-500"></th>
                  </tr>
                </thead>
                <tbody className="divide-y dark:divide-gray-800/60">
                  {filteredMiembros.map((m) => (
                    <tr
                      key={m.id}
                      className="transition-colors hover:bg-gray-50 dark:hover:bg-white/[0.06]"
                    >
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {m.apellidos}, {m.nombres}
                        </p>
                        {m.cargo && <p className="text-xs text-gray-500">{m.cargo}</p>}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={m.tipo === 'directivo' ? 'default' : 'secondary'}>
                          {m.tipo === 'directivo' ? 'Dir.' : 'Danz.'}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-center font-medium text-green-600">{m.presentes}</td>
                      <td className="px-4 py-3 text-center font-medium text-red-600">{m.ausentes}</td>
                      <td className="px-4 py-3 text-center font-medium text-amber-600">{m.tardanzas}</td>
                      <td className="px-4 py-3 text-center font-medium text-blue-600">{m.justificados}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`font-bold ${m.baja_asistencia ? 'text-red-600' : 'text-green-600'}`}>
                          {m.porcentaje}%
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Link href={`/admin/reportes/asistencia/miembro/${m.id}`}>
                          <Button variant="ghost" size="sm">
                            <DynamicIcon name="Eye" className="h-4 w-4" />
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredMiembros.length === 0 && (
              <div className="py-12 text-center text-gray-500">
                <DynamicIcon name="Users" className="mx-auto h-8 w-8 mb-2 text-gray-300" />
                <p>No se encontraron miembros</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
