import { useState, useEffect } from 'react';
import { Link, router, useForm } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Badge } from '@/Components/ui/badge';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/Components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/Components/ui/dialog';
import { ScrollArea } from '@/Components/ui/scroll-area';
import DynamicIcon from '@/Components/DynamicIcon';
import DeleteDialog from './DeleteDialog';
import FormField from './FormField';
import FileUpload from './FileUpload';

export default function DataTable({
  title,
  data = [],
  columns = [],
  createRoute,
  createLabel = 'Crear nuevo',
  searchPlaceholder = 'Buscar...',
  emptyMessage = 'No hay registros',
  emptyIcon = 'Inbox',
  actions = true,
  onDelete,
  deleteRoute,
  editRoute,
  showRoute,
  pagination,
  className,
  // Modal props
  formFields = null,
  storeRoute = null,
  updateRoute = null,
  modalTitleCreate = 'Crear registro',
  modalTitleEdit = 'Editar registro',
  modalDescription = 'Complete los campos del formulario.',
}) {
  const [search, setSearch] = useState('');
  const [deleteItem, setDeleteItem] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Determine if using modal mode
  const useModal = formFields && (storeRoute || updateRoute);

  // Build initial form data from fields
  const buildInitialData = (item = null) => {
    const initial = { is_published: true, is_featured: false, orden: 0 };
    formFields?.forEach((field) => {
      if (field.type === 'checkbox') {
        initial[field.name] = item?.[field.name] ?? false;
      } else {
        initial[field.name] = item?.[field.name] ?? '';
      }
    });
    if (item) {
      // Explicitly convert to boolean to handle 0/1, "0"/"1", true/false
      initial.is_published = item.is_published !== undefined ? Boolean(item.is_published) : true;
      initial.is_featured = item.is_featured !== undefined ? Boolean(item.is_featured) : false;
      initial.orden = item.orden ?? 0;
    }
    return initial;
  };

  const { data: formData, setData: setFormData, post, processing, errors, reset, clearErrors } = useForm(buildInitialData());

  // Update form when editing item changes
  useEffect(() => {
    if (editingItem) {
      const newData = buildInitialData(editingItem);
      Object.keys(newData).forEach(key => {
        setFormData(key, newData[key]);
      });
    }
  }, [editingItem]);

  const filteredData = search
    ? data.filter((item) =>
        columns.some((col) => {
          const value = getNestedValue(item, col.key);
          return value?.toString().toLowerCase().includes(search.toLowerCase());
        })
      )
    : data;

  const handleDelete = () => {
    if (deleteItem && deleteRoute) {
      router.delete(deleteRoute.replace(':id', deleteItem.id), {
        onSuccess: () => setDeleteItem(null),
      });
    }
    if (onDelete) {
      onDelete(deleteItem);
      setDeleteItem(null);
    }
  };

  const handleFormChange = (name, value) => {
    setFormData(name, value);
  };

  const handleOpenCreate = () => {
    setEditingItem(null);
    reset();
    // Set defaults for new record
    setFormData('is_published', true);
    setFormData('is_featured', false);
    setFormData('orden', 0);
    clearErrors();
    setModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    // Set form data directly to avoid race condition with useEffect
    const newData = buildInitialData(item);
    Object.keys(newData).forEach(key => {
      setFormData(key, newData[key]);
    });
    clearErrors();
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingItem(null);
    reset();
    clearErrors();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const submitData = new FormData();

    // Get file field names to skip string values (existing URLs)
    const fileFieldNames = formFields
      ?.filter(f => f.type === 'file' || f.type === 'image')
      .map(f => f.name) || [];

    // Add all form fields
    Object.entries(formData).forEach(([key, value]) => {
      if (value instanceof File) {
        // Always append actual files
        submitData.append(key, value);
      } else if (fileFieldNames.includes(key)) {
        // Skip string values for file fields (existing URLs)
        // Only send if it's a new File
        return;
      } else if (typeof value === 'boolean') {
        // Convert boolean to 1/0 for Laravel
        submitData.append(key, value ? '1' : '0');
      } else if (value !== null && value !== undefined && value !== '') {
        submitData.append(key, value);
      }
    });

    const isEdit = !!editingItem;
    const route = isEdit
      ? (updateRoute?.replace(':id', editingItem.id) || storeRoute)
      : storeRoute;

    if (isEdit) {
      submitData.append('_method', 'PUT');
    }

    router.post(route, submitData, {
      onSuccess: () => {
        handleCloseModal();
      },
      onError: (errors) => {
        console.error('Form errors:', errors);
      },
    });
  };

  const isEdit = !!editingItem;

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle>{title}</CardTitle>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            {/* Search */}
            <div className="relative">
              <DynamicIcon
                name="Search"
                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
              />
              <Input
                placeholder={searchPlaceholder}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 w-full sm:w-64"
              />
            </div>

            {/* Create Button */}
            {useModal ? (
              <Button onClick={handleOpenCreate}>
                <DynamicIcon name="Plus" className="h-4 w-4 mr-2" />
                {createLabel}
              </Button>
            ) : createRoute && (
              <Button asChild>
                <Link href={createRoute}>
                  <DynamicIcon name="Plus" className="h-4 w-4 mr-2" />
                  {createLabel}
                </Link>
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {filteredData.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <DynamicIcon
              name={emptyIcon}
              className="h-12 w-12 mx-auto mb-4 opacity-50"
            />
            <p className="font-medium">{emptyMessage}</p>
            {useModal ? (
              <Button variant="outline" className="mt-4" onClick={handleOpenCreate}>
                <DynamicIcon name="Plus" className="h-4 w-4 mr-2" />
                {createLabel}
              </Button>
            ) : createRoute && (
              <Button variant="outline" className="mt-4" asChild>
                <Link href={createRoute}>
                  <DynamicIcon name="Plus" className="h-4 w-4 mr-2" />
                  {createLabel}
                </Link>
              </Button>
            )}
          </div>
        ) : (
          <>
            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b dark:border-gray-800">
                    {columns.map((col) => (
                      <th
                        key={col.key}
                        className={cn(
                          "px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400",
                          col.className
                        )}
                      >
                        {col.label}
                      </th>
                    ))}
                    {actions && (
                      <th className="px-4 py-3 text-right text-sm font-medium text-gray-500 dark:text-gray-400">
                        Acciones
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((item, index) => (
                    <tr
                      key={item.id || index}
                      className="border-b last:border-0 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900"
                    >
                      {columns.map((col) => (
                        <td
                          key={col.key}
                          className={cn(
                            "px-4 py-3 text-sm",
                            col.className
                          )}
                        >
                          {renderCell(item, col)}
                        </td>
                      ))}
                      {actions && (
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            {showRoute && (
                              <Button variant="ghost" size="icon" asChild>
                                <Link href={showRoute.replace(':id', item.id)}>
                                  <DynamicIcon name="Eye" className="h-4 w-4" />
                                </Link>
                              </Button>
                            )}
                            {/* Edit: Modal or Page */}
                            {useModal && updateRoute ? (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleOpenEdit(item)}
                              >
                                <DynamicIcon name="Pencil" className="h-4 w-4" />
                              </Button>
                            ) : editRoute && (
                              <Button variant="ghost" size="icon" asChild>
                                <Link href={editRoute.replace(':id', item.id)}>
                                  <DynamicIcon name="Pencil" className="h-4 w-4" />
                                </Link>
                              </Button>
                            )}
                            {(deleteRoute || onDelete) && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setDeleteItem(item)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <DynamicIcon name="Trash2" className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t dark:border-gray-800">
                <p className="text-sm text-gray-500">
                  Mostrando {pagination.from} a {pagination.to} de {pagination.total}
                </p>
                <div className="flex gap-2">
                  {pagination.prev_page_url && (
                    <Button variant="outline" size="sm" asChild>
                      <Link href={pagination.prev_page_url}>
                        <DynamicIcon name="ChevronLeft" className="h-4 w-4" />
                      </Link>
                    </Button>
                  )}
                  {pagination.next_page_url && (
                    <Button variant="outline" size="sm" asChild>
                      <Link href={pagination.next_page_url}>
                        <DynamicIcon name="ChevronRight" className="h-4 w-4" />
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>

      {/* Delete Dialog */}
      <DeleteDialog
        open={!!deleteItem}
        onOpenChange={(open) => !open && setDeleteItem(null)}
        onConfirm={handleDelete}
        title="Eliminar registro"
        description={`¿Estás seguro de eliminar "${deleteItem?.titulo || deleteItem?.nombres || 'este registro'}"? Esta acción no se puede deshacer.`}
      />

      {/* Create/Edit Modal - Dialog centrado */}
      {useModal && (
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
            <DialogHeader className="flex-shrink-0">
              <DialogTitle>
                {isEdit ? modalTitleEdit : modalTitleCreate}
              </DialogTitle>
              <DialogDescription>{modalDescription}</DialogDescription>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto max-h-[60vh] pr-2">
              <form id="crud-form" onSubmit={handleSubmit} className="space-y-4 py-2">
                {/* Publish Options - FIRST for visibility */}
                <div className="p-3 bg-muted/50 rounded-lg border">
                  <div className="flex flex-wrap items-center gap-6">
                    <FormField
                      label="Publicar"
                      name="is_published"
                      type="checkbox"
                      value={formData.is_published}
                      onChange={handleFormChange}
                    />
                    <FormField
                      label="Destacar"
                      name="is_featured"
                      type="checkbox"
                      value={formData.is_featured}
                      onChange={handleFormChange}
                    />
                    <div className="w-24">
                      <FormField
                        label="Orden"
                        name="orden"
                        type="number"
                        value={formData.orden}
                        onChange={handleFormChange}
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>

                {/* Dynamic Fields */}
                <div className="grid gap-4 sm:grid-cols-2">
                  {formFields?.map((field) => {
                    const isFullWidth = field.fullWidth || field.type === 'textarea' || field.type === 'file' || field.type === 'image';

                    if (field.type === 'file' || field.type === 'image') {
                      return (
                        <div key={field.name} className={isFullWidth ? 'sm:col-span-2' : ''}>
                          <FileUpload
                            label={field.label}
                            name={field.name}
                            value={formData[field.name]}
                            onChange={handleFormChange}
                            error={errors[field.name]}
                            accept={field.accept || (field.type === 'image' ? 'image/*' : '*')}
                            required={field.required}
                            helpText={field.helpText}
                            currentFile={editingItem?.[field.name]}
                          />
                        </div>
                      );
                    }

                    return (
                      <div key={field.name} className={isFullWidth ? 'sm:col-span-2' : ''}>
                        <FormField
                          label={field.label}
                          name={field.name}
                          type={field.type || 'text'}
                          value={formData[field.name]}
                          onChange={handleFormChange}
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

                {/* Actions inside form */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t dark:border-gray-800">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCloseModal}
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
            </div>
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );
}

function getNestedValue(obj, path) {
  return path.split('.').reduce((acc, part) => acc?.[part], obj);
}

function renderCell(item, col) {
  const value = getNestedValue(item, col.key);

  if (col.render) {
    return col.render(value, item);
  }

  if (col.type === 'badge') {
    return (
      <Badge variant={value ? 'default' : 'secondary'}>
        {value ? 'Publicado' : 'Borrador'}
      </Badge>
    );
  }

  if (col.type === 'date') {
    return value ? new Date(value).toLocaleDateString('es-PE') : '-';
  }

  if (col.type === 'image') {
    return value ? (
      <img
        src={value}
        alt=""
        className="h-10 w-10 rounded object-cover"
      />
    ) : (
      <div className="h-10 w-10 rounded bg-gray-100 dark:bg-gray-800" />
    );
  }

  return value ?? '-';
}
