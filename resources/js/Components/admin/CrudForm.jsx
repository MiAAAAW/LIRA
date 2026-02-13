import { useForm, router } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import FormField, { FormSection, FormActions } from './FormField';
import FileUpload from './FileUpload';
import DynamicIcon from '@/Components/DynamicIcon';
import { cn } from '@/lib/utils';

export default function CrudForm({
  item = null,
  fields = [],
  storeRoute,
  updateRoute,
  indexRoute,
  title,
  className,
}) {
  const isEdit = !!item;

  // Build initial data from fields, plus standard publish options
  const initialData = fields.reduce((acc, field) => {
    if (field.type === 'checkbox') {
      acc[field.name] = item?.[field.name] ?? false;
    } else {
      acc[field.name] = item?.[field.name] ?? '';
    }
    return acc;
  }, {
    // Always include publish options with proper defaults (true = publicar por defecto)
    is_published: item?.is_published ?? true,
    is_featured: item?.is_featured ?? false,
    orden: item?.orden ?? 0,
  });

  const { data, setData, post, put, processing, errors } = useForm(initialData);

  const handleSubmit = (e) => {
    e.preventDefault();

    const options = {
      forceFormData: true,
    };

    if (isEdit) {
      put(updateRoute, options);
    } else {
      post(storeRoute, options);
    }
  };

  const handleChange = (name, value) => {
    setData(name, value);
  };

  const groupedFields = groupFields(fields);

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-6", className)}>
      {groupedFields.map((group, groupIndex) => (
        <Card key={groupIndex}>
          {group.title && (
            <CardHeader>
              <CardTitle className="text-lg">{group.title}</CardTitle>
            </CardHeader>
          )}
          <CardContent className={!group.title ? 'pt-6' : ''}>
            <div className="grid gap-4 sm:grid-cols-2">
              {group.fields.map((field) => {
                if (field.type === 'file' || field.type === 'image') {
                  return (
                    <div
                      key={field.name}
                      className={field.fullWidth ? 'sm:col-span-2' : ''}
                    >
                      <FileUpload
                        label={field.label}
                        name={field.name}
                        value={data[field.name]}
                        onChange={handleChange}
                        error={errors[field.name]}
                        accept={field.accept || (field.type === 'image' ? 'image/*' : '*')}
                        required={field.required}
                        helpText={field.helpText}
                      />
                    </div>
                  );
                }

                return (
                  <div
                    key={field.name}
                    className={field.fullWidth ? 'sm:col-span-2' : ''}
                  >
                    <FormField
                      label={field.label}
                      name={field.name}
                      type={field.type || 'text'}
                      value={data[field.name]}
                      onChange={handleChange}
                      error={errors[field.name]}
                      required={field.required}
                      placeholder={field.placeholder}
                      helpText={field.helpText}
                      options={field.options}
                      rows={field.rows}
                    />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Publish Options */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Opciones de Publicación</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-6">
            <FormField
              label="Publicar"
              name="is_published"
              type="checkbox"
              value={data.is_published}
              onChange={handleChange}
            />
            <FormField
              label="Destacar"
              name="is_featured"
              type="checkbox"
              value={data.is_featured}
              onChange={handleChange}
            />
            <FormField
              label="Orden"
              name="orden"
              type="number"
              value={data.orden}
              onChange={handleChange}
              placeholder="0"
              className="w-32"
            />
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.visit(indexRoute)}
          disabled={processing}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={processing}>
          {processing ? (
            <>
              <DynamicIcon name="Loader2" className="h-4 w-4 mr-2 animate-spin" />
              Guardando...
            </>
          ) : (
            <>
              <DynamicIcon name="Save" className="h-4 w-4 mr-2" />
              {isEdit ? 'Actualizar' : 'Crear'}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

function groupFields(fields) {
  const groups = [];
  let currentGroup = { title: null, fields: [] };

  fields.forEach((field) => {
    if (field.group && field.group !== currentGroup.title) {
      if (currentGroup.fields.length > 0) {
        groups.push(currentGroup);
      }
      currentGroup = { title: field.group, fields: [field] };
    } else {
      currentGroup.fields.push(field);
    }
  });

  if (currentGroup.fields.length > 0) {
    groups.push(currentGroup);
  }

  return groups;
}
