import { useState, useEffect } from 'react';
import { Link, router, useForm } from '@inertiajs/react';
import { cn, storageUrl } from '@/lib/utils';
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
import DirectUpload from './DirectUpload';
import RichTextEditor from './RichTextEditor';
import SectionToggle from './SectionToggle';

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
  // Section toggle (optional)
  sectionToggle,
  // Modal props
  formFields = null,
  storeRoute = null,
  updateRoute = null,
  modalTitleCreate = 'Crear registro',
  modalTitleEdit = 'Editar registro',
  modalDescription = 'Complete los campos del formulario.',
  // Featured config (optional) - controls "Destacar" behavior
  // { exclusive: bool, label: string, warningText: string }
  featuredConfig = null,
  // Hide publish/featured/orden controls for internal-use modules
  hidePublishOptions = false,
  // Default orden for new records (auto-increment)
  defaultOrden = null,
}) {
  const [search, setSearch] = useState('');
  const [deleteItem, setDeleteItem] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [clientErrors, setClientErrors] = useState({});

  // Determine if using modal mode
  const useModal = formFields && (storeRoute || updateRoute);

  // Build initial form data from fields
  const buildInitialData = (item = null) => {
    const initial = { is_published: true, is_featured: false, orden: item ? 0 : (defaultOrden ?? 0) };
    formFields?.forEach((field) => {
      if (field.type === 'checkbox') {
        initial[field.name] = item?.[field.name] ?? false;
      } else {
        // Use field.defaultValue for new records, fallback to empty
        initial[field.name] = item?.[field.name] ?? (field.defaultValue || '');
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
    // Clear dependent fields when their condition is no longer met
    formFields?.forEach(field => {
      if (field.dependsOn && field.dependsOn.field === name && value !== field.dependsOn.value) {
        setFormData(field.name, '');
      }
    });
    // Clear client error for this field when user changes it
    if (clientErrors[name]) {
      setClientErrors(prev => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleOpenCreate = () => {
    setEditingItem(null);
    reset();
    // Set defaults for new record
    setFormData('is_published', true);
    setFormData('is_featured', false);
    setFormData('orden', defaultOrden ?? 0);
    // Apply field-level defaults (e.g. select defaultValue)
    formFields?.forEach(field => {
      if (field.defaultValue !== undefined) {
        setFormData(field.name, field.defaultValue);
      }
    });
    clearErrors();
    setClientErrors({});
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
    setIsUploading(false);
    setClientErrors({});
    reset();
    clearErrors();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Client-side validation for required fields
    const newClientErrors = {};
    const fileTypes = ['direct-upload', 'file', 'image'];
    formFields?.forEach(field => {
      if (!field.required) return;
      const val = formData[field.name];
      if (fileTypes.includes(field.type)) {
        // In edit mode, existing file is handled by backend - skip file validation
        if (!val && !editingItem) {
          newClientErrors[field.name] = `${field.label} es obligatorio`;
        }
      } else if (!val && val !== 0 && val !== false) {
        newClientErrors[field.name] = `${field.label} es obligatorio`;
      }
    });

    if (Object.keys(newClientErrors).length > 0) {
      setClientErrors(newClientErrors);
      return;
    }
    setClientErrors({});

    const submitData = new FormData();

    // Get field types by name for special handling
    const fieldTypes = {};
    formFields?.forEach(f => { fieldTypes[f.name] = f.type; });

    // Get file field names to skip string values (existing URLs)
    const fileFieldNames = formFields
      ?.filter(f => f.type === 'file' || f.type === 'image')
      .map(f => f.name) || [];

    // Get direct-upload field names
    const directUploadFieldNames = formFields
      ?.filter(f => f.type === 'direct-upload')
      .map(f => f.name) || [];

    // Build a map of direct-upload field configs for custom key/url field names
    const directUploadFieldConfigs = {};
    formFields?.filter(f => f.type === 'direct-upload').forEach(f => {
      directUploadFieldConfigs[f.name] = {
        keyField: f.keyField || 'r2_key',
        urlField: f.urlField || 'r2_url',
      };
    });

    // Add all form fields
    Object.entries(formData).forEach(([key, value]) => {
      // Handle direct-upload fields (already uploaded to R2)
      if (directUploadFieldNames.includes(key)) {
        if (value && typeof value === 'object' && value.key) {
          // Usar los nombres de campo personalizados si están definidos
          const config = directUploadFieldConfigs[key];
          submitData.append(config.keyField, value.key);
          submitData.append(config.urlField, value.url);
          // Solo agregar tipo_fuente si no es documents (es video/audio)
          if (!config.keyField.includes('pdf')) {
            submitData.append('tipo_fuente', 'cloudflare');
          }
        }
        return;
      }

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
      } else if (value !== null && value !== undefined) {
        // Send empty strings too — Laravel's ConvertEmptyStringsToNull
        // middleware converts '' to null for nullable fields
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
          <div className="flex items-center gap-4">
            <CardTitle>{title}</CardTitle>
            {sectionToggle && <SectionToggle {...sectionToggle} />}
          </div>

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
                      className="border-b last:border-0 dark:border-gray-800/60 transition-colors hover:bg-gray-50 dark:hover:bg-white/[0.06]"
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
        description={`¿Estás seguro de eliminar "${deleteItem?.titulo || deleteItem?.titulo_principal || deleteItem?.nombres || deleteItem?.nombre || 'este registro'}"? Esta acción no se puede deshacer.`}
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

            <div className="flex-1 overflow-y-auto pr-2">
              <form id="crud-form" onSubmit={handleSubmit} className="space-y-3 py-1">
                {/* Publish Options - FIRST for visibility */}
                {!hidePublishOptions && (
                <div className="flex flex-wrap items-center gap-4 p-3 bg-muted/50 rounded-lg border">
                  <FormField
                    label="Publicar"
                    name="is_published"
                    type="checkbox"
                    value={formData.is_published}
                    onChange={handleFormChange}
                  />
                  <div className="w-px h-5 bg-border" />
                  <div>
                    <FormField
                      label={featuredConfig?.label || 'Destacar'}
                      name="is_featured"
                      type="checkbox"
                      value={formData.is_featured}
                      onChange={handleFormChange}
                    />
                    {featuredConfig?.exclusive && formData.is_featured && (() => {
                      const currentFeatured = data.find(item => item.is_featured && item.id !== editingItem?.id);
                      return currentFeatured ? (
                        <p className="text-xs text-amber-500 mt-1 flex items-center gap-1">
                          <DynamicIcon name="AlertTriangle" className="h-3 w-3 flex-shrink-0" />
                          {featuredConfig.warningText}
                        </p>
                      ) : null;
                    })()}
                  </div>
                  <div className="w-px h-5 bg-border" />
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Orden</span>
                    <input
                      type="number"
                      value={formData.orden || 0}
                      onChange={(e) => handleFormChange('orden', e.target.value)}
                      className="w-16 h-8 rounded-md border border-input bg-background px-2 text-sm text-center"
                    />
                  </div>
                </div>
                )}

                {/* Dynamic Fields */}
                <div className="grid gap-3 sm:grid-cols-2">
                  {formFields?.map((field) => {
                    if (field.dependsOn) {
                      if (formData[field.dependsOn.field] !== field.dependsOn.value) {
                        return null;
                      }
                    }

                    const isFullWidth = field.fullWidth || field.type === 'textarea' || field.type === 'rich-text' || field.type === 'file' || field.type === 'image' || field.type === 'direct-upload';

                    // Rich Text Editor (Tiptap)
                    if (field.type === 'rich-text') {
                      return (
                        <div key={field.name} className="sm:col-span-2">
                          <RichTextEditor
                            label={field.label}
                            name={field.name}
                            value={formData[field.name]}
                            onChange={handleFormChange}
                            error={errors[field.name] || clientErrors[field.name]}
                            required={field.required}
                            placeholder={field.placeholder}
                          />
                        </div>
                      );
                    }

                    // Direct Upload para videos/audios/documentos grandes (va directo a CDN)
                    if (field.type === 'direct-upload') {
                      // Obtener info del archivo existente si estamos editando
                      // Usar urlField/keyField si están definidos, sino usar fallbacks
                      const urlFieldName = field.urlField || field.existingUrlField || 'r2_video_url';
                      const keyFieldName = field.keyField || field.existingKeyField || 'r2_key';
                      const existingFile = editingItem ? {
                        url: editingItem[urlFieldName] || editingItem.playable_url || editingItem.pdf_url,
                        key: editingItem[keyFieldName],
                        name: editingItem.titulo || 'Archivo existente',
                      } : null;

                      return (
                        <div key={field.name} className="sm:col-span-2">
                          <DirectUpload
                            label={field.label}
                            name={field.name}
                            type={field.uploadType || 'videos'}
                            accept={field.accept}
                            maxSize={field.maxSize}
                            required={field.required && !editingItem}
                            helpText={field.helpText}
                            error={errors[field.name] || clientErrors[field.name]}
                            onChange={handleFormChange}
                            onUploadingChange={setIsUploading}
                            value={formData[field.name]}
                            existingFile={existingFile}
                          />
                        </div>
                      );
                    }

                    if (field.type === 'file' || field.type === 'image') {
                      return (
                        <div key={field.name} className={isFullWidth ? 'sm:col-span-2' : ''}>
                          <FileUpload
                            label={field.label}
                            name={field.name}
                            value={formData[field.name]}
                            onChange={handleFormChange}
                            error={errors[field.name] || clientErrors[field.name]}
                            accept={field.accept || (field.type === 'image' ? 'image/*' : '*')}
                            maxSize={field.maxSize}
                            required={field.required}
                            helpText={field.helpText}
                            currentFile={editingItem?.[field.name]}
                          />
                        </div>
                      );
                    }

                    // Extract known config keys, pass the rest (min, max, step, suffix, etc.) to FormField
                    const { name: fName, label: fLabel, type: fType, fullWidth: _fw, defaultValue: _dv, dependsOn: _dep,
                      uploadType: _ut, keyField: _kf, urlField: _uf, existingUrlField: _euf, existingKeyField: _ekf, ...fieldExtra } = field;

                    return (
                      <div key={field.name} className={isFullWidth ? 'sm:col-span-2' : ''}>
                        <FormField
                          label={field.label}
                          name={field.name}
                          type={field.type || 'text'}
                          value={formData[field.name]}
                          onChange={handleFormChange}
                          error={errors[field.name] || clientErrors[field.name]}
                          required={field.required}
                          placeholder={field.placeholder}
                          helpText={field.helpText}
                          options={field.options}
                          rows={field.rows}
                          {...fieldExtra}
                        />
                      </div>
                    );
                  })}
                </div>

              </form>
            </div>

            {/* Actions outside scroll area - always visible */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t dark:border-gray-800 flex-shrink-0">
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseModal}
                disabled={processing}
              >
                Cancelar
              </Button>
              <Button type="submit" form="crud-form" disabled={processing || isUploading}>
                {processing ? (
                  <>
                    <DynamicIcon name="Loader2" className="h-4 w-4 mr-2 animate-spin" />
                    Guardando...
                  </>
                ) : isUploading ? (
                  <>
                    <DynamicIcon name="Loader2" className="h-4 w-4 mr-2 animate-spin" />
                    Subiendo archivo...
                  </>
                ) : (
                  <>
                    <DynamicIcon name="Save" className="h-4 w-4 mr-2" />
                    {isEdit ? 'Actualizar' : 'Crear'}
                  </>
                )}
              </Button>
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

  if (col.type === 'featured') {
    return value ? (
      <Badge className="bg-amber-500/15 text-amber-500 border-amber-500/20">
        <DynamicIcon name="Star" className="h-3 w-3 mr-1 fill-current" />
        {col.featuredLabel || 'Destacado'}
      </Badge>
    ) : null;
  }

  if (col.type === 'date') {
    if (!value) return '-';
    const [y, m, d] = String(value).split('T')[0].split('-').map(Number);
    return new Date(y, m - 1, d).toLocaleDateString('es-PE');
  }

  if (col.type === 'image') {
    const imgUrl = storageUrl(value);
    return imgUrl ? (
      <img
        src={imgUrl}
        alt=""
        className="h-10 w-10 rounded object-cover"
        onError={(e) => {
          e.target.style.display = 'none';
          e.target.nextSibling?.classList?.remove('hidden');
        }}
      />
    ) : null;
  }

  return value ?? '-';
}
