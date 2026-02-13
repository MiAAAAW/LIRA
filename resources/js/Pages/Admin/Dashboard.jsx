import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import StatsCard, { StatsCardGrid, StatsSummary } from '@/Components/admin/StatsCard';
import DynamicIcon from '@/Components/DynamicIcon';
import { cn } from '@/lib/utils';

export default function Dashboard({ stats, recentActivity }) {
  return (
    <AdminLayout
      title="Dashboard"
      breadcrumbs={[{ label: 'Dashboard' }]}
    >
      <Head title="Admin Dashboard - Lira Puno" />

      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Panel de Administración
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Gestiona el contenido de Pandilla Lira Puno
            </p>
          </div>
          <StatsSummary
            total={stats.totals.total}
            published={stats.totals.published}
          />
        </div>

        {/* Stats Grid - Marco Legal */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <DynamicIcon name="Scale" className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Marco Legal e Historia
            </h2>
          </div>
          <StatsCardGrid stats={stats.legal} />
        </section>

        {/* Stats Grid - Multimedia */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <DynamicIcon name="PlayCircle" className="h-5 w-5 text-purple-600" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Multimedia y Comunicación
            </h2>
          </div>
          <StatsCardGrid stats={stats.multimedia} />
        </section>

        {/* Recent Activity & Quick Actions */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DynamicIcon name="Activity" className="h-5 w-5" />
                Actividad Reciente
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentActivity.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <DynamicIcon name="Inbox" className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No hay actividad reciente</p>
                  <p className="text-sm">Comienza agregando contenido</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div
                      key={`${activity.type}-${activity.id}`}
                      className="flex items-center gap-3"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                        <DynamicIcon
                          name={activity.icon}
                          className="h-4 w-4 text-gray-600 dark:text-gray-400"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {activity.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          {activity.type} {activity.action}
                        </p>
                      </div>
                      <Badge variant={activity.is_published ? "default" : "secondary"}>
                        {activity.is_published ? 'Publicado' : 'Borrador'}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DynamicIcon name="Zap" className="h-5 w-5" />
                Acciones Rápidas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2">
                <QuickActionButton
                  href="/admin/comunicados"
                  icon="Megaphone"
                  label="Nuevo Comunicado"
                  color="pink"
                />
                <QuickActionButton
                  href="/admin/videos"
                  icon="Video"
                  label="Agregar Video"
                  color="red"
                />
                <QuickActionButton
                  href="/admin/audios"
                  icon="Music"
                  label="Agregar Audio"
                  color="orange"
                />
                <QuickActionButton
                  href="/admin/distinciones"
                  icon="Award"
                  label="Nueva Distinción"
                  color="yellow"
                />
                <QuickActionButton
                  href="/admin/presidentes/create"
                  icon="Users"
                  label="Agregar Presidente"
                  color="violet"
                />
                <QuickActionButton
                  href="/admin/publicaciones"
                  icon="Newspaper"
                  label="Nueva Publicación"
                  color="indigo"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Help Card */}
        <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
                <DynamicIcon name="HelpCircle" className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  ¿Necesitas ayuda?
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Consulta la documentación o contacta al soporte técnico.
                </p>
              </div>
              <Button variant="outline" asChild>
                <Link href="/">
                  <DynamicIcon name="ExternalLink" className="h-4 w-4 mr-2" />
                  Ver Landing
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}

function QuickActionButton({ href, icon, label, color }) {
  const colorClasses = {
    pink: 'hover:bg-pink-50 hover:text-pink-600 hover:border-pink-200 dark:hover:bg-pink-950',
    red: 'hover:bg-red-50 hover:text-red-600 hover:border-red-200 dark:hover:bg-red-950',
    orange: 'hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 dark:hover:bg-orange-950',
    yellow: 'hover:bg-yellow-50 hover:text-yellow-600 hover:border-yellow-200 dark:hover:bg-yellow-950',
    violet: 'hover:bg-violet-50 hover:text-violet-600 hover:border-violet-200 dark:hover:bg-violet-950',
    indigo: 'hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 dark:hover:bg-indigo-950',
  };

  return (
    <Button
      variant="outline"
      className={cn(
        "justify-start h-auto py-3",
        colorClasses[color] || ''
      )}
      asChild
    >
      <Link href={href}>
        <DynamicIcon name={icon} className="h-4 w-4 mr-2" />
        {label}
      </Link>
    </Button>
  );
}
