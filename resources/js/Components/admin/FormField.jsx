import { cn } from '@/lib/utils';
import { Input } from '@/Components/ui/input';
import { Textarea } from '@/Components/ui/textarea';
import DynamicIcon from '@/Components/DynamicIcon';

export default function FormField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  required = false,
  placeholder,
  helpText,
  disabled = false,
  className,
  inputClassName,
  options = [],
  rows = 4,
  accept,
  ...props
}) {
  const id = `field-${name}`;

  const handleChange = (e) => {
    const newValue = type === 'checkbox' ? e.target.checked : e.target.value;
    onChange(name, newValue);
  };

  const handleFileChange = (e) => {
    onChange(name, e.target.files?.[0] || null);
  };

  const renderInput = () => {
    switch (type) {
      case 'textarea':
        return (
          <Textarea
            id={id}
            name={name}
            value={value || ''}
            onChange={handleChange}
            placeholder={placeholder}
            disabled={disabled}
            rows={rows}
            className={cn(
              error && 'border-red-500 focus:ring-red-500',
              inputClassName
            )}
            {...props}
          />
        );

      case 'select':
        return (
          <select
            id={id}
            name={name}
            value={value || ''}
            onChange={handleChange}
            disabled={disabled}
            className={cn(
              "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              "disabled:cursor-not-allowed disabled:opacity-50",
              error && 'border-red-500 focus:ring-red-500',
              inputClassName
            )}
            {...props}
          >
            <option value="">{placeholder || 'Seleccionar...'}</option>
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        );

      case 'checkbox':
        return (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id={id}
              name={name}
              checked={value || false}
              onChange={handleChange}
              disabled={disabled}
              className={cn(
                "h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary",
                error && 'border-red-500',
                inputClassName
              )}
              {...props}
            />
            <label
              htmlFor={id}
              className="text-sm text-gray-700 dark:text-gray-300"
            >
              {label}
            </label>
          </div>
        );

      case 'file':
        return (
          <div className="space-y-2">
            <Input
              id={id}
              name={name}
              type="file"
              onChange={handleFileChange}
              disabled={disabled}
              accept={accept}
              className={cn(
                error && 'border-red-500 focus:ring-red-500',
                inputClassName
              )}
              {...props}
            />
            {value && typeof value === 'string' && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <DynamicIcon name="FileCheck" className="h-4 w-4" />
                <span>Archivo actual: {value.split('/').pop()}</span>
              </div>
            )}
          </div>
        );

      case 'date':
        return (
          <Input
            id={id}
            name={name}
            type="date"
            value={value || ''}
            onChange={handleChange}
            placeholder={placeholder}
            disabled={disabled}
            className={cn(
              error && 'border-red-500 focus:ring-red-500',
              inputClassName
            )}
            {...props}
          />
        );

      case 'number':
        return (
          <Input
            id={id}
            name={name}
            type="number"
            value={value || ''}
            onChange={handleChange}
            placeholder={placeholder}
            disabled={disabled}
            className={cn(
              error && 'border-red-500 focus:ring-red-500',
              inputClassName
            )}
            {...props}
          />
        );

      default:
        return (
          <Input
            id={id}
            name={name}
            type={type}
            value={value || ''}
            onChange={handleChange}
            placeholder={placeholder}
            disabled={disabled}
            className={cn(
              error && 'border-red-500 focus:ring-red-500',
              inputClassName
            )}
            {...props}
          />
        );
    }
  };

  if (type === 'checkbox') {
    return (
      <div className={cn("space-y-1", className)}>
        {renderInput()}
        {error && (
          <p className="text-sm text-red-500 flex items-center gap-1">
            <DynamicIcon name="AlertCircle" className="h-3 w-3" />
            {error}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className={cn("space-y-2", className)}>
      <label
        htmlFor={id}
        className="text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {renderInput()}

      {helpText && !error && (
        <p className="text-sm text-gray-500">{helpText}</p>
      )}

      {error && (
        <p className="text-sm text-red-500 flex items-center gap-1">
          <DynamicIcon name="AlertCircle" className="h-3 w-3" />
          {error}
        </p>
      )}
    </div>
  );
}

export function FormSection({ title, description, children, className }) {
  return (
    <div className={cn("space-y-4", className)}>
      {(title || description) && (
        <div>
          {title && (
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-sm text-gray-500">{description}</p>
          )}
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-2">{children}</div>
    </div>
  );
}

export function FormActions({ children, className }) {
  return (
    <div className={cn("flex items-center justify-end gap-3 pt-6 border-t dark:border-gray-800", className)}>
      {children}
    </div>
  );
}
