import * as React from "react"
import { X, ZoomIn, ZoomOut, ChevronLeft, ChevronRight, Download } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
} from "@/Components/ui/dialog"
import { Button } from "@/Components/ui/button"

/**
 * ImageLightbox - Modal fullscreen para ver imágenes en detalle
 *
 * @example
 * const [open, setOpen] = useState(false);
 * const [selectedImage, setSelectedImage] = useState(null);
 *
 * <ImageLightbox
 *   open={open}
 *   onOpenChange={setOpen}
 *   src={selectedImage?.src}
 *   alt={selectedImage?.alt}
 *   title={selectedImage?.title}
 *   description={selectedImage?.description}
 * />
 */

const ImageLightbox = React.forwardRef(({
  open,
  onOpenChange,
  src,
  alt,
  title,
  description,
  images = [], // Para galería con navegación
  currentIndex = 0,
  onNavigate,
  className,
  ...props
}, ref) => {
  const [zoom, setZoom] = React.useState(1);
  const [position, setPosition] = React.useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = React.useState(false);
  const imageRef = React.useRef(null);

  // Reset zoom when image changes
  React.useEffect(() => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  }, [src, currentIndex]);

  // Keyboard navigation
  React.useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onOpenChange(false);
      } else if (e.key === 'ArrowLeft' && images.length > 1) {
        handlePrevious();
      } else if (e.key === 'ArrowRight' && images.length > 1) {
        handleNext();
      } else if (e.key === '+' || e.key === '=') {
        handleZoomIn();
      } else if (e.key === '-') {
        handleZoomOut();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, currentIndex, images.length]);

  const handleZoomIn = () => setZoom(z => Math.min(z + 0.5, 4));
  const handleZoomOut = () => {
    setZoom(z => {
      const newZoom = Math.max(z - 0.5, 1);
      if (newZoom === 1) setPosition({ x: 0, y: 0 });
      return newZoom;
    });
  };

  const handlePrevious = () => {
    if (onNavigate && images.length > 1) {
      const newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
      onNavigate(newIndex);
    }
  };

  const handleNext = () => {
    if (onNavigate && images.length > 1) {
      const newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
      onNavigate(newIndex);
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = src;
    link.download = title || 'image';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Pan functionality when zoomed
  const handleMouseDown = (e) => {
    if (zoom > 1) {
      setIsDragging(true);
      e.preventDefault();
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && zoom > 1) {
      setPosition(p => ({
        x: p.x + e.movementX,
        y: p.y + e.movementY,
      }));
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  const currentImage = images.length > 0 ? images[currentIndex] : { src, alt, title, description };
  const imageSrc = currentImage.src || src;
  const imageAlt = currentImage.alt || alt;
  const imageTitle = currentImage.title || title;
  const imageDesc = currentImage.description || description;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay className="bg-black/95" />
        <div
          ref={ref}
          className={cn(
            "fixed inset-0 z-50 flex flex-col",
            className
          )}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          {...props}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-b from-black/50 to-transparent">
            <div className="text-white">
              {imageTitle && (
                <h3 className="text-lg font-semibold">{imageTitle}</h3>
              )}
              {imageDesc && (
                <p className="text-sm text-white/70 line-clamp-1">{imageDesc}</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={handleZoomOut}
                disabled={zoom <= 1}
              >
                <ZoomOut className="h-5 w-5" />
              </Button>
              <span className="text-white text-sm w-16 text-center">
                {Math.round(zoom * 100)}%
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={handleZoomIn}
                disabled={zoom >= 4}
              >
                <ZoomIn className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={handleDownload}
              >
                <Download className="h-5 w-5" />
              </Button>
              <DialogClose asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20"
                >
                  <X className="h-5 w-5" />
                </Button>
              </DialogClose>
            </div>
          </div>

          {/* Image Container */}
          <div
            className="flex-1 flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
          >
            {imageSrc && (
              <img
                ref={imageRef}
                src={imageSrc}
                alt={imageAlt || ''}
                className="max-h-full max-w-full object-contain select-none transition-transform duration-200"
                style={{
                  transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
                }}
                draggable={false}
              />
            )}
          </div>

          {/* Navigation */}
          {images.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 h-12 w-12"
                onClick={handlePrevious}
              >
                <ChevronLeft className="h-8 w-8" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 h-12 w-12"
                onClick={handleNext}
              >
                <ChevronRight className="h-8 w-8" />
              </Button>
            </>
          )}

          {/* Footer with dots */}
          {images.length > 1 && (
            <div className="p-4 flex justify-center gap-2 bg-gradient-to-t from-black/50 to-transparent">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all",
                    idx === currentIndex
                      ? "bg-white w-6"
                      : "bg-white/50 hover:bg-white/70"
                  )}
                  onClick={() => onNavigate?.(idx)}
                />
              ))}
            </div>
          )}
        </div>
      </DialogPortal>
    </Dialog>
  );
});

ImageLightbox.displayName = "ImageLightbox";

export { ImageLightbox };
