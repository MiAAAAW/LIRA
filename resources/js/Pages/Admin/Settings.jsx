import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import DynamicIcon from '@/Components/DynamicIcon';

export default function Settings({ config }) {
  return (
    <AdminLayout
      title="Configuración"
      breadcrumbs={[{ label: 'Configuración' }]}
    >
      <Head title="Configuración - Admin" />

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DynamicIcon name="Building" className="h-5 w-5" />
              Información del Conjunto
            </CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Nombre</dt>
                <dd className="text-lg">{config.nombre}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Nombre Corto</dt>
                <dd className="text-lg">{config.nombre_corto}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Fundación</dt>
                <dd className="text-lg">{config.fundacion}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DynamicIcon name="Mail" className="h-5 w-5" />
              Contacto
            </CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd>{config.contacto?.email || '-'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Teléfono</dt>
                <dd>{config.contacto?.telefono || '-'}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Dirección</dt>
                <dd>{config.contacto?.direccion || '-'}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DynamicIcon name="Share2" className="h-5 w-5" />
              Redes Sociales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-4 sm:grid-cols-2">
              {Object.entries(config.redes_sociales || {}).map(([key, value]) => (
                value && (
                  <div key={key}>
                    <dt className="text-sm font-medium text-gray-500 capitalize">{key}</dt>
                    <dd className="truncate">
                      <a href={value} target="_blank" rel="noopener" className="text-primary hover:underline">
                        {value}
                      </a>
                    </dd>
                  </div>
                )
              ))}
            </dl>
          </CardContent>
        </Card>

        <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950 dark:border-amber-800">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <DynamicIcon name="Info" className="h-5 w-5 text-amber-600 mt-0.5" />
              <div>
                <p className="font-medium text-amber-800 dark:text-amber-200">
                  Configuración desde archivo
                </p>
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  Estos valores se cargan desde <code className="bg-amber-100 dark:bg-amber-900 px-1 rounded">config/pandilla.php</code>.
                  Para editarlos, modifica ese archivo o las variables de entorno.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
