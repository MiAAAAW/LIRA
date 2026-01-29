import * as LucideIcons from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Renderiza iconos de lucide-react dinámicamente
 * @param {string} name - Nombre del icono (PascalCase)
 * @param {string} className - Clases CSS adicionales
 */
export default function DynamicIcon({ name, className, ...props }) {
  if (!name) return null;

  const Icon = LucideIcons[name];

  if (!Icon) {
    console.warn(`Icon "${name}" not found in lucide-react`);
    return null;
  }

  return <Icon className={cn("h-4 w-4", className)} {...props} />;
}
