import { Button } from '@/Components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/Components/ui/card';
import DynamicIcon from '@/Components/DynamicIcon';

export default function DeleteDialog({
  open,
  onOpenChange,
  onConfirm,
  title = 'Eliminar registro',
  description = '¿Estás seguro de eliminar este registro? Esta acción no se puede deshacer.',
  confirmLabel = 'Eliminar',
  cancelLabel = 'Cancelar',
  loading = false,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50"
        onClick={() => onOpenChange(false)}
      />

      {/* Dialog */}
      <Card className="relative z-10 w-full max-w-md mx-4 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-red-600">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-950">
              <DynamicIcon name="AlertTriangle" className="h-5 w-5" />
            </div>
            {title}
          </CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-gray-600 dark:text-gray-400">
            {description}
          </p>
        </CardContent>

        <CardFooter className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            {cancelLabel}
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? (
              <>
                <DynamicIcon name="Loader2" className="h-4 w-4 mr-2 animate-spin" />
                Eliminando...
              </>
            ) : (
              <>
                <DynamicIcon name="Trash2" className="h-4 w-4 mr-2" />
                {confirmLabel}
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
