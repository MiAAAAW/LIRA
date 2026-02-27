/**
 * @fileoverview Content Sections Layout
 * @description Secciones separadas con layout 2 columnas
 * Cada sección tiene: Institucional (izq) | Contenido (der)
 */

import React from 'react';
import {
  Scale, FileText, Shield, Flag, Users,
  Video, Music, Award, Newspaper, Megaphone,
  Play, Pause, Download, Calendar, User, FileIcon, GripVertical,
  ChevronLeft, ChevronRight, ChevronDown, ExternalLink, Volume2, VolumeX, Loader2,
  MoreVertical, Maximize2
} from 'lucide-react';
import { useMediaContext, useVideoContext } from '@/contexts/MediaContext';
import { cn, storageUrl } from '@/lib/utils';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { AspectRatio } from '@/Components/ui/aspect-ratio';
import { Slider } from '@/Components/ui/slider';
import { MotionWrapper } from '@/Components/motion/MotionWrapper';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '@/Components/ui/carousel';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/Components/ui/dialog';
import { ImageLightbox } from '@/Components/ui/image-lightbox';
import { PdfViewer } from '@/Components/ui/pdf-viewer';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/Components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';

// ═══════════════════════════════════════════════════════════════════════════════
// CONSTANTS - Valores configurables (extraer a config/i18n si necesario)
// ═══════════════════════════════════════════════════════════════════════════════

const DATE_LOCALE = 'es-PE';

// UI Constants
const PDF_PREVIEW_HEIGHT = 500; // px
const DRAG_ACTIVATION_DISTANCE = 8; // px mínimo para activar drag
const DRAG_Z_INDEX = 50;
const DRAG_OPACITY = 0.8;
const DRAG_SCALE = 1.02;
const PANEL_MAX_HEIGHT = 600; // px - altura máxima para paneles con scroll
const DOCUMENT_RENDER_TYPES = ['reorderable-documents', 'documents', 'documents-shield'];

// i18n strings (extraer a archivo de traducciones si necesario)
const STRINGS = {
  newTab: 'Nueva pestaña',
  download: 'Descargar',
  noDocument: 'Sin documento',
  previous: 'Anterior',
  next: 'Siguiente',
  fullscreen: 'Pantalla completa',
  listen: 'Escuchar',
  composer: 'Compositor',
  announcement: 'Comunicado',
  sectionTitle: '', // from config.columns.title
  sectionSubtitle: '', // from config.columns.subtitle
  docNavLabel: 'Navegación de documentos',
  viewLink: 'Ver enlace',
  showDesc: 'Ver descripción',
  hideDesc: 'Ocultar descripción',
};

// Utils
const getInitials = (name) => name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '';

// ═══════════════════════════════════════════════════════════════════════════════
// DOCUMENT VIEWER - Preview visible + Modal fullscreen
// - Preview del PDF siempre visible (1 solo iframe activo)
// - Navegación entre documentos
// - Modal para ver en pantalla completa
// ═══════════════════════════════════════════════════════════════════════════════

// Modal fullscreen para ver PDF en grande
const PDFFullscreenModal = React.memo(function PDFFullscreenModal({
  doc, isOpen, onClose, icon: Icon
}) {
  if (!doc) return null;

  const pdfUrl = doc.pdf_url || doc.documento_pdf || doc.certificado_pdf;
  const numero = doc.numero_ley || doc.numero_documento || doc.numero_registro;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl w-[95vw] h-[90vh] flex flex-col p-0 gap-0">
        <DialogHeader className="p-4 pb-3 border-b shrink-0">
          <div className="flex items-center gap-3 pr-8">
            <div className="p-2 rounded-lg bg-primary/10 shrink-0">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <DialogTitle className="line-clamp-1">{doc.titulo}</DialogTitle>
              <DialogDescription className="line-clamp-1">
                {numero && <span className="font-mono mr-2">{numero}</span>}
                {doc.descripcion}
              </DialogDescription>
            </div>
            <div className="flex gap-2 shrink-0">
              <Button variant="outline" size="sm" asChild>
                <a href={pdfUrl} target="_blank" rel="noopener noreferrer" aria-label={STRINGS.newTab}>
                  <ExternalLink className="h-4 w-4 sm:mr-1" />
                  <span className="hidden sm:inline">{STRINGS.newTab}</span>
                </a>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a href={pdfUrl} download aria-label={STRINGS.download}>
                  <Download className="h-4 w-4 sm:mr-1" />
                  <span className="hidden sm:inline">{STRINGS.download}</span>
                </a>
              </Button>
            </div>
          </div>
        </DialogHeader>
        <div className="flex-1 min-h-0 bg-muted/20">
          <PdfViewer
            url={pdfUrl}
            title={doc.titulo}
            className="w-full h-full"
            toolbar
          />
        </div>
      </DialogContent>
    </Dialog>
  );
});

// Visor de documentos con PREVIEW VISIBLE
const DocumentViewer = React.memo(function DocumentViewer({ documents, icon: Icon }) {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [isFullscreen, setIsFullscreen] = React.useState(false);

  const totalDocs = documents?.length || 0;

  const goToPrev = React.useCallback(() => {
    setActiveIndex(prev => (prev === 0 ? totalDocs - 1 : prev - 1));
  }, [totalDocs]);

  const goToNext = React.useCallback(() => {
    setActiveIndex(prev => (prev === totalDocs - 1 ? 0 : prev + 1));
  }, [totalDocs]);

  const goToIndex = React.useCallback((index) => {
    setActiveIndex(index);
  }, []);

  const openFullscreen = React.useCallback(() => setIsFullscreen(true), []);
  const closeFullscreen = React.useCallback(() => setIsFullscreen(false), []);

  if (!documents || documents.length === 0) return null;

  const activeDoc = documents[activeIndex];
  const pdfUrl = activeDoc?.pdf_url || activeDoc?.documento_pdf || activeDoc?.certificado_pdf;
  const hasPdf = !!pdfUrl;

  return (
    <>
      <Card className="border-border/50 overflow-hidden">
        {/* Header con info del documento + acciones dropdown + navegación */}
        <div className="flex items-center gap-2 p-3 border-b border-border/50 bg-muted/30">
          {/* Left: icon + title */}
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <div className="p-1.5 rounded-md bg-primary/10 shrink-0">
              <Icon className="h-4 w-4 text-primary" />
            </div>
            <h4 className="font-semibold text-sm line-clamp-1 min-w-0">{activeDoc.titulo}</h4>
          </div>

          {/* Right: actions dropdown + navigation */}
          <div className="flex items-center gap-1 shrink-0">
            {/* Actions dropdown — compact, works on all screen sizes */}
            {hasPdf && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={openFullscreen}>
                    <Maximize2 className="h-4 w-4 mr-2" /> {STRINGS.fullscreen}
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" /> {STRINGS.newTab}
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <a href={pdfUrl} download>
                      <Download className="h-4 w-4 mr-2" /> {STRINGS.download}
                    </a>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Navigation */}
            {totalDocs > 1 && (
              <div className="flex items-center gap-0.5">
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={goToPrev}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                {totalDocs <= 5 ? (
                  <div className="flex gap-1" role="tablist" aria-label={STRINGS.docNavLabel}>
                    {documents.map((doc, index) => (
                      <button
                        key={doc.id || index}
                        onClick={() => goToIndex(index)}
                        role="tab"
                        aria-selected={index === activeIndex}
                        aria-label={`Documento ${index + 1} de ${totalDocs}`}
                        className={cn(
                          "w-2 h-2 rounded-full transition-colors",
                          index === activeIndex ? "bg-primary" : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                        )}
                      />
                    ))}
                  </div>
                ) : (
                  /* Select dropdown — jump to any document */
                  <Select
                    value={String(activeIndex)}
                    onValueChange={(val) => goToIndex(Number(val))}
                  >
                    <SelectTrigger className="h-7 w-auto min-w-[50px] max-w-[120px] text-xs border-0 bg-transparent px-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {documents.map((doc, i) => (
                        <SelectItem key={doc.id || i} value={String(i)} className="text-xs">
                          {i + 1}. {doc.titulo?.substring(0, 40) || `Documento ${i + 1}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}

                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={goToNext}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* PREVIEW DEL PDF — heights must fit within PANEL_MAX_HEIGHT (600px) minus header (~56px) */}
        <div className="bg-muted/10 h-[350px] sm:h-[450px] md:h-[540px]">
          {hasPdf ? (
            <PdfViewer
              url={pdfUrl}
              title={activeDoc.titulo}
              className="w-full h-full"
              toolbar={false}
              iframeKey={activeDoc.id}
            />
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <FileIcon className="h-12 w-12 mx-auto mb-2 opacity-30" />
                <p className="text-sm">{STRINGS.noDocument}</p>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Modal fullscreen */}
      <PDFFullscreenModal
        doc={activeDoc}
        isOpen={isFullscreen}
        onClose={closeFullscreen}
        icon={Icon}
      />
    </>
  );
});

// MediaContext, MediaProvider, useMediaContext, useVideoContext
// → Moved to @/contexts/MediaContext.jsx for shared use with BackgroundMusicPlayer

// ═══════════════════════════════════════════════════════════════════════════════
// VIDEO MODAL CAROUSEL - Fullscreen modal con navegación entre videos
// ═══════════════════════════════════════════════════════════════════════════════

const VideoModalCarousel = React.memo(function VideoModalCarousel({
  videos,
  currentIndex,
  isOpen,
  onClose,
  onNavigate
}) {
  const videoRef = React.useRef(null);
  const { setModalOpen } = useVideoContext();
  const [localIndex, setLocalIndex] = React.useState(currentIndex);
  const [descExpanded, setDescExpanded] = React.useState(false);

  // Sync with external index when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setLocalIndex(currentIndex);
    }
  }, [isOpen, currentIndex]);

  // Sync modal state with context
  React.useEffect(() => {
    setModalOpen(isOpen);
  }, [isOpen, setModalOpen]);

  // Pause video on close or navigate
  React.useEffect(() => {
    if (!isOpen && videoRef.current) {
      videoRef.current.pause();
    }
  }, [isOpen]);

  const currentVideo = videos?.[localIndex];
  const hasMultiple = videos?.length > 1;
  const total = videos?.length || 0;

  // Collapse description when navigating to a different video
  React.useEffect(() => {
    setDescExpanded(false);
  }, [localIndex]);

  // Navigation handlers
  const goToPrev = React.useCallback(() => {
    if (videoRef.current) videoRef.current.pause();
    const newIndex = localIndex === 0 ? total - 1 : localIndex - 1;
    setLocalIndex(newIndex);
    onNavigate?.(newIndex);
  }, [localIndex, total, onNavigate]);

  const goToNext = React.useCallback(() => {
    if (videoRef.current) videoRef.current.pause();
    const newIndex = localIndex === total - 1 ? 0 : localIndex + 1;
    setLocalIndex(newIndex);
    onNavigate?.(newIndex);
  }, [localIndex, total, onNavigate]);

  // Keyboard navigation
  React.useEffect(() => {
    if (!isOpen || !hasMultiple) return;

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') goToPrev();
      if (e.key === 'ArrowRight') goToNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, hasMultiple, goToPrev, goToNext]);

  if (!currentVideo) return null;

  const videoUrl = currentVideo.playable_url || currentVideo.r2_video_url || currentVideo.url_video;
  const isYouTube = currentVideo.tipo_fuente === 'youtube';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl w-[95vw] p-0 gap-0 overflow-hidden">
        <DialogHeader className="p-4 pb-2 border-b">
          <div className="flex items-center justify-between pr-8">
            <div className="min-w-0 flex-1">
              <DialogTitle className="line-clamp-1">{currentVideo.titulo}</DialogTitle>
              {currentVideo.descripcion && (
                <DialogDescription className="line-clamp-1">
                  {currentVideo.descripcion}
                </DialogDescription>
              )}
            </div>
            {hasMultiple && (
              <Badge variant="secondary" className="ml-3 shrink-0">
                {localIndex + 1} / {total}
              </Badge>
            )}
          </div>
        </DialogHeader>

        <div className="relative bg-muted">
          <AspectRatio ratio={16 / 9}>
            {isYouTube ? (
              <iframe
                key={currentVideo.id}
                src={`https://www.youtube.com/embed/${currentVideo.video_id}?autoplay=1&rel=0`}
                title={currentVideo.titulo}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            ) : (
              <video
                key={currentVideo.id}
                ref={videoRef}
                src={videoUrl}
                controls
                autoPlay
                playsInline
                className="w-full h-full bg-muted"
              >
                Tu navegador no soporta el elemento video.
              </video>
            )}
          </AspectRatio>

          {/* Navigation arrows on video */}
          {hasMultiple && (
            <>
              <button
                onClick={goToPrev}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/80 hover:bg-background text-foreground shadow-lg transition-all hover:scale-110"
                aria-label="Video anterior"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/80 hover:bg-background text-foreground shadow-lg transition-all hover:scale-110"
                aria-label="Video siguiente"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}
        </div>

        {/* Footer with info + description + navigation */}
        <div className="border-t bg-muted/30">
          {/* Video info row */}
          <div className="flex items-center gap-3 text-sm text-muted-foreground px-4 pt-3 pb-2">
            {currentVideo.duracion && (
              <span className="flex items-center gap-1">
                <Play className="h-3 w-3" /> {currentVideo.duracion}
              </span>
            )}
            {currentVideo.anio && <span>{currentVideo.anio}</span>}
            {currentVideo.categoria && (
              <Badge variant="outline" className="text-xs">{currentVideo.categoria}</Badge>
            )}
          </div>

          {/* Expandable description (only if exists) */}
          {currentVideo.descripcion_larga && (
            <div className="px-4 pb-2">
              <button
                onClick={() => setDescExpanded(prev => !prev)}
                className="flex items-center gap-1.5 text-sm font-medium text-foreground hover:text-primary transition-colors mb-2"
              >
                <ChevronDown className={cn("h-4 w-4 transition-transform duration-200", descExpanded && "rotate-180")} />
                {descExpanded ? STRINGS.hideDesc : STRINGS.showDesc}
              </button>
              {descExpanded && (
                <div
                  className="prose prose-sm dark:prose-invert max-w-none max-h-40 overflow-y-auto pb-1
                    prose-p:my-1 prose-ul:my-1 prose-ol:my-1 prose-li:my-0"
                  dangerouslySetInnerHTML={{ __html: currentVideo.descripcion_larga }}
                />
              )}
            </div>
          )}

          {/* Unified navigation: Anterior | dots | Siguiente */}
          {hasMultiple && (
            <div className="flex items-center justify-center gap-4 px-4 pb-4">
              <Button variant="outline" size="sm" onClick={goToPrev} className="h-8">
                <ChevronLeft className="h-4 w-4 mr-1" /> {STRINGS.previous}
              </Button>
              <div className="flex gap-1.5">
                {videos.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      if (videoRef.current) videoRef.current.pause();
                      setLocalIndex(idx);
                      onNavigate?.(idx);
                    }}
                    className={cn(
                      "w-2 h-2 rounded-full transition-colors",
                      idx === localIndex ? "bg-primary" : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                    )}
                    aria-label={`Ir a video ${idx + 1}`}
                  />
                ))}
              </div>
              <Button variant="outline" size="sm" onClick={goToNext} className="h-8">
                {STRINGS.next} <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          )}
          {!hasMultiple && <div className="pb-1" />}
        </div>
      </DialogContent>
    </Dialog>
  );
});

// ═══════════════════════════════════════════════════════════════════════════════
// VIDEO CARD - TikTok style: inline video + optional fullscreen
// Solo 1 video activo a la vez, se pausa cuando modal está abierto
// ═══════════════════════════════════════════════════════════════════════════════

const VideoCard = React.memo(function VideoCard({ video, onOpenFullscreen }) {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [isMuted, setIsMuted] = React.useState(true);
  const [showControls, setShowControls] = React.useState(false);
  const [isVisible, setIsVisible] = React.useState(false);
  const [isVideoReady, setIsVideoReady] = React.useState(false);
  const [isBuffering, setIsBuffering] = React.useState(false);
  const [userPaused, setUserPaused] = React.useState(false);
  const videoRef = React.useRef(null);
  const cardRef = React.useRef(null);

  const { activeVideoId, setActiveVideo, modalOpen, activeMediaType } = useVideoContext();

  const videoUrl = video.playable_url || video.r2_video_url || video.url_video;
  const thumbnailUrl = video.thumbnail_url || storageUrl(video.thumbnail);
  const isCloudflare = video.tipo_fuente === 'cloudflare';
  const isYouTube = video.tipo_fuente === 'youtube';
  const canPlayInline = isCloudflare || (!isYouTube && videoUrl);

  const isThisActive = activeVideoId === video.id;
  const isAudioPlaying = activeMediaType === 'audio';

  // Video ready state handlers
  const handleCanPlay = React.useCallback(() => {
    setIsVideoReady(true);
    setIsBuffering(false);
  }, []);

  const handleWaiting = React.useCallback(() => {
    setIsBuffering(true);
  }, []);

  const handlePlaying = React.useCallback(() => {
    setIsBuffering(false);
  }, []);

  // Pause when another video becomes active OR modal opens
  React.useEffect(() => {
    if ((!isThisActive && activeVideoId !== null) || modalOpen) {
      if (videoRef.current && isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  }, [activeVideoId, isThisActive, modalOpen, isPlaying]);

  // IntersectionObserver para detectar visibilidad
  React.useEffect(() => {
    if (!canPlayInline || !cardRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const visible = entry.isIntersecting && entry.intersectionRatio > 0.6;
          setIsVisible(visible);

          // NO auto-reproducir si hay un audio activo, modal abierto, o usuario pausó
          if (visible && !modalOpen && !isAudioPlaying && !userPaused) {
            // Video visible y no hay modal ni audio ni pausa manual - reproducir
            if (videoRef.current && !isPlaying) {
              setActiveVideo(video.id);
              videoRef.current.play()
                .then(() => setIsPlaying(true))
                .catch(() => {
                  // Play falló (ej: autoplay bloqueado) - revertir estado
                  setActiveVideo(null);
                });
            }
          } else if (!visible) {
            // Video no visible - pausar y resetear pausa manual
            if (videoRef.current && isPlaying) {
              videoRef.current.pause();
              setIsPlaying(false);
              if (isThisActive) {
                setActiveVideo(null);
              }
            }
            setUserPaused(false);
          }
        });
      },
      { threshold: [0, 0.6, 1] }
    );

    observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, [canPlayInline, isPlaying, modalOpen, video.id, setActiveVideo, isThisActive, isAudioPlaying, userPaused]);

  // Toggle mute — also notify MediaContext about audibility
  const toggleMute = (e) => {
    e.stopPropagation();
    if (videoRef.current) {
      const newMuted = !isMuted;
      videoRef.current.muted = newMuted;
      setIsMuted(newMuted);
      // When unmuting, signal that this video now has audible sound
      if (isThisActive) {
        setActiveVideo(video.id, !newMuted);
      }
    }
  };

  // Toggle play/pause - click anywhere on video to pause/play
  const togglePlay = React.useCallback((e) => {
    e?.stopPropagation();
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
        setUserPaused(true);
        setActiveVideo(null);
      } else {
        setUserPaused(false);
        setActiveVideo(video.id);
        videoRef.current.play()
          .then(() => setIsPlaying(true))
          .catch(() => {
            setActiveVideo(null);
          });
      }
    }
  }, [isPlaying, video.id, setActiveVideo]);

  // Open fullscreen modal - pause inline first
  const openFullscreen = (e) => {
    e.stopPropagation();
    // Pause inline video before opening modal
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
    // Use callback if provided (carousel mode), otherwise no-op
    onOpenFullscreen?.();
  };

  return (
    <>
      <Card
        ref={cardRef}
        className="overflow-hidden border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg group"
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >
        <AspectRatio ratio={16 / 9}>
          <div className="relative w-full h-full bg-muted">
            {canPlayInline ? (
              <>
                {/* Thumbnail overlay - visible only before video is ready */}
                <div
                  className={cn(
                    "absolute inset-0 z-10 transition-opacity duration-500 bg-muted",
                    isVideoReady ? "opacity-0 pointer-events-none" : "opacity-100"
                  )}
                >
                  {thumbnailUrl ? (
                    <img
                      src={thumbnailUrl}
                      alt={video.titulo}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                      <Video className="h-12 w-12 text-primary/50" />
                    </div>
                  )}
                  {/* Loading spinner when buffering */}
                  {isBuffering && (
                    <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm">
                      <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </div>

                {/* Video inline - hidden until ready */}
                <video
                  ref={videoRef}
                  src={videoUrl}
                  muted={isMuted}
                  loop
                  playsInline
                  preload="metadata"
                  className={cn(
                    "w-full h-full object-cover",
                    !isVideoReady && "invisible"
                  )}
                  onClick={togglePlay}
                  onCanPlay={handleCanPlay}
                  onWaiting={handleWaiting}
                  onPlaying={handlePlaying}
                />

                {/* Controls overlay - center play/pause */}
                <div className={cn(
                  "absolute inset-0 z-20 flex items-center justify-center transition-opacity duration-200 pointer-events-none",
                  showControls || !isPlaying ? "opacity-100" : "opacity-0"
                )}>
                  <button
                    onClick={togglePlay}
                    className="p-4 rounded-full bg-black/50 hover:bg-black/70 transition-colors pointer-events-auto"
                    aria-label={isPlaying ? "Pausar" : "Reproducir"}
                  >
                    {isPlaying ? (
                      <svg className="h-10 w-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <rect x="6" y="4" width="4" height="16" />
                        <rect x="14" y="4" width="4" height="16" />
                      </svg>
                    ) : (
                      <Play className="h-10 w-10 text-white fill-white" />
                    )}
                  </button>
                </div>

                {/* Bottom controls bar */}
                <div className={cn(
                  "absolute bottom-0 left-0 right-0 z-20 p-3 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-between transition-opacity duration-200",
                  showControls ? "opacity-100" : "opacity-0 pointer-events-none"
                )}>
                  <div className="flex items-center gap-2">
                    {/* Play/Pause */}
                    <button
                      onClick={togglePlay}
                      className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                      aria-label={isPlaying ? "Pausar" : "Reproducir"}
                    >
                      {isPlaying ? (
                        <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <rect x="6" y="4" width="4" height="16" />
                          <rect x="14" y="4" width="4" height="16" />
                        </svg>
                      ) : (
                        <Play className="h-4 w-4 text-white fill-white" />
                      )}
                    </button>

                    {/* Mute/Unmute */}
                    <button
                      onClick={toggleMute}
                      className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                      aria-label={isMuted ? "Activar sonido" : "Silenciar"}
                    >
                      {isMuted ? (
                        <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M11 5L6 9H2v6h4l5 4V5z" />
                          <line x1="23" y1="9" x2="17" y2="15" />
                          <line x1="17" y1="9" x2="23" y2="15" />
                        </svg>
                      ) : (
                        <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M11 5L6 9H2v6h4l5 4V5z" />
                          <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                        </svg>
                      )}
                    </button>
                  </div>

                  {/* Fullscreen button */}
                  <button
                    onClick={openFullscreen}
                    className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                    aria-label="Pantalla completa"
                  >
                    <ExternalLink className="h-4 w-4 text-white" />
                  </button>
                </div>

                {/* Duration badge */}
                {video.duracion && !showControls && (
                  <Badge className="absolute bottom-2 right-2 bg-black/80 text-white">
                    {video.duracion}
                  </Badge>
                )}
              </>
            ) : (
              // Fallback for YouTube/external - show thumbnail with play overlay
              <>
                {thumbnailUrl ? (
                  <img
                    src={thumbnailUrl}
                    alt={video.titulo}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                    <Video className="h-12 w-12 text-primary/50" />
                  </div>
                )}
                <button
                  onClick={() => onOpenFullscreen?.()}
                  className="absolute inset-0 flex items-center justify-center bg-background/40 hover:bg-background/50 transition-colors"
                >
                  <div className="p-4 rounded-full bg-foreground/20">
                    <Play className="h-8 w-8 text-foreground fill-foreground" />
                  </div>
                </button>
                {video.duracion && (
                  <Badge className="absolute bottom-2 right-2 bg-background/80 text-foreground">
                    {video.duracion}
                  </Badge>
                )}
              </>
            )}
          </div>
        </AspectRatio>
        <CardContent className="p-4">
          <h4 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
            {video.titulo}
          </h4>
          {video.descripcion && (
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {video.descripcion}
            </p>
          )}
          <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
            {video.anio && <span>{video.anio}</span>}
            {video.categoria && (
              <Badge variant="outline" className="text-xs">{video.categoria}</Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
});

// ═══════════════════════════════════════════════════════════════════════════════
// VIDEO CAROUSEL - Muestra 1 video a la vez con navegación
// ═══════════════════════════════════════════════════════════════════════════════

const VideoCarousel = React.memo(function VideoCarousel({ videos }) {
  const [api, setApi] = React.useState(null);
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [modalVideoIndex, setModalVideoIndex] = React.useState(0);

  React.useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  // Open modal for specific video
  const openModalForVideo = React.useCallback((index) => {
    setModalVideoIndex(index);
    setIsModalOpen(true);
  }, []);

  // Close modal and optionally resume inline
  const closeModal = React.useCallback(() => {
    setIsModalOpen(false);
  }, []);

  // Navigate in modal (also sync carousel if needed)
  const handleModalNavigate = React.useCallback((newIndex) => {
    setModalVideoIndex(newIndex);
    // Optionally sync the inline carousel
    api?.scrollTo(newIndex);
  }, [api]);

  if (!videos || videos.length === 0) return null;

  return (
    <div className="w-full">
      <Carousel
        setApi={setApi}
        opts={{ align: "start", loop: true }}
        className="w-full"
      >
        <CarouselContent className="-ml-4">
          {videos.map((video, index) => (
            <CarouselItem key={video.id} className="pl-4 basis-full">
              <VideoCard
                video={video}
                onOpenFullscreen={() => openModalForVideo(index)}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        {/* Navigation - Unified design */}
        {count > 1 && (
          <div className="flex items-center justify-center gap-4 mt-4">
            <Button variant="outline" size="sm" onClick={() => api?.scrollPrev()} className="h-8">
              <ChevronLeft className="h-4 w-4 mr-1" /> {STRINGS.previous}
            </Button>
            <div className="flex gap-1.5">
              {videos.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => api?.scrollTo(idx)}
                  className={cn(
                    "w-2 h-2 rounded-full transition-colors",
                    idx === current - 1 ? "bg-primary" : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                  )}
                  aria-label={`Ir a video ${idx + 1}`}
                />
              ))}
            </div>
            <Button variant="outline" size="sm" onClick={() => api?.scrollNext()} className="h-8">
              {STRINGS.next} <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        )}
      </Carousel>

      {/* Modal carousel for fullscreen */}
      <VideoModalCarousel
        videos={videos}
        currentIndex={modalVideoIndex}
        isOpen={isModalOpen}
        onClose={closeModal}
        onNavigate={handleModalNavigate}
      />
    </div>
  );
});

// ═══════════════════════════════════════════════════════════════════════════════
// DOCUMENT LIST - Usa DocumentViewer (preview visible + fullscreen modal)
// ═══════════════════════════════════════════════════════════════════════════════

const DocumentList = React.memo(function DocumentList({ documents, icon: Icon }) {
  if (!documents || documents.length === 0) return null;

  // Siempre usar el grid con modal - máxima performance
  return <DocumentViewer documents={documents} icon={Icon} />;
});

// ═══════════════════════════════════════════════════════════════════════════════
// VIDEO LIST - Carrusel de videos (el drag es a nivel de panel)
// ═══════════════════════════════════════════════════════════════════════════════

const VideoList = React.memo(function VideoList({ videos }) {
  if (!videos || videos.length === 0) return null;

  return <VideoCarousel videos={videos} />;
});

// ═══════════════════════════════════════════════════════════════════════════════
// AUDIO CARD
// ═══════════════════════════════════════════════════════════════════════════════

const AudioCard = React.memo(function AudioCard({ audio }) {
  // Usar playable_url del backend (R2 o URL externa)
  const audioUrl = audio.playable_url || audio.url_audio;
  const audioRef = React.useRef(null);
  const lastTimeUpdateRef = React.useRef(0);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [isBuffering, setIsBuffering] = React.useState(false);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [duration, setDuration] = React.useState(0);
  const [volume, setVolume] = React.useState(80);
  const [isMuted, setIsMuted] = React.useState(false);
  const [isDetailOpen, setIsDetailOpen] = React.useState(false);

  // Media context para coordinar con videos y otros audios
  const { activeMediaId, activeMediaType, setActiveMedia, modalOpen } = useMediaContext();
  const audioId = `audio-${audio.id}`;
  const isThisActive = activeMediaId === audioId && activeMediaType === 'audio';

  // Pausar cuando otro media se activa o modal se abre
  // NOTA: isDetailOpen NO pausa el audio — se usa estado local para no tocar modalOpen
  React.useEffect(() => {
    if ((!isThisActive && activeMediaId !== null) || modalOpen) {
      if (audioRef.current && isPlaying) {
        audioRef.current.pause();
      }
    }
  }, [activeMediaId, isThisActive, modalOpen, isPlaying]);

  // Cleanup: pausar audio al desmontar el componente
  React.useEffect(() => {
    const audio = audioRef.current;
    return () => {
      if (audio) {
        audio.pause();
        audio.src = ''; // Liberar recursos
      }
    };
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setActiveMedia(null, null);
    } else {
      setActiveMedia(audioId, 'audio', true); // Audible — pausará música de fondo
      audioRef.current.play().catch(() => {});
    }
  };

  // Throttle timeUpdate para mejor performance (actualizar cada 250ms)
  const handleTimeUpdate = React.useCallback(() => {
    if (!audioRef.current) return;
    const now = Date.now();
    if (now - lastTimeUpdateRef.current > 250) {
      setCurrentTime(audioRef.current.currentTime);
      lastTimeUpdateRef.current = now;
    }
  }, []);

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
      setIsBuffering(false);
    }
  };

  const handleSeek = (value) => {
    if (!audioRef.current || !duration) return;
    const newTime = (value[0] / 100) * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (value) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
      setIsMuted(newVolume === 0);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = volume / 100;
        setIsMuted(false);
      } else {
        audioRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };

  const formatTime = (time) => {
    if (!time || isNaN(time)) return '0:00';
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const hasPdf = !!audio.partitura_pdf;

  return (
    <>
      <Card
        className="border-border/50 hover:border-violet-500/30 transition-all duration-300 hover:shadow-lg group cursor-default"
        onPointerDown={(e) => e.stopPropagation()}
      >
        <CardContent className="p-4">
          {/* Hidden audio element */}
          {audioUrl && (
            <audio
              ref={audioRef}
              src={audioUrl}
              preload="metadata"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={() => { setIsPlaying(false); setCurrentTime(0); setActiveMedia(null, null); }}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onWaiting={() => setIsBuffering(true)}
              onCanPlay={() => setIsBuffering(false)}
            />
          )}

          {/* Main layout */}
          <div className="flex items-center gap-3">
            {/* Play/Pause button — NO abre modal */}
            <button
              onClick={togglePlay}
              disabled={!audioUrl}
              className={cn(
                "flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-all relative",
                isPlaying
                  ? "bg-violet-500 text-white shadow-lg shadow-violet-500/30"
                  : "bg-violet-500/10 text-violet-500 hover:bg-violet-500 hover:text-white hover:shadow-lg hover:shadow-violet-500/30",
                !audioUrl && "opacity-50 cursor-not-allowed"
              )}
            >
              {isBuffering ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : isPlaying ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="h-5 w-5 ml-0.5" />
              )}
            </button>

            {/* Info + Progress — click abre el modal */}
            <div
              className="flex-1 min-w-0 space-y-1 cursor-pointer"
              onClick={() => setIsDetailOpen(true)}
            >
              {/* Title row */}
              <div className="flex items-center justify-between gap-2">
                <h4 className="font-semibold text-sm line-clamp-1">{audio.titulo}</h4>
                <div className="flex items-center gap-1 flex-shrink-0">
                  {hasPdf && (
                    <FileText className="h-3 w-3 text-muted-foreground/50" title="Tiene partitura" />
                  )}
                  {audio.tipo && (
                    <Badge variant="secondary" className="capitalize text-[10px]">
                      {audio.tipo}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Artist */}
              {audio.interprete && (
                <p className="text-xs text-muted-foreground line-clamp-1">{audio.interprete}</p>
              )}

              {/* Progress bar */}
              {audioUrl && (
                <div
                  className="flex items-center gap-2 pt-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span className="text-[10px] text-muted-foreground w-8 text-right tabular-nums">
                    {formatTime(currentTime)}
                  </span>
                  <Slider
                    value={[progress]}
                    max={100}
                    step={0.1}
                    onValueChange={handleSeek}
                    className="flex-1 cursor-pointer [&_[role=slider]]:h-3 [&_[role=slider]]:w-3 [&_[role=slider]]:border-violet-500 [&_.bg-primary]:bg-violet-500"
                  />
                  <span className="text-[10px] text-muted-foreground w-8 tabular-nums">
                    {formatTime(duration) || audio.duracion || '--:--'}
                  </span>
                </div>
              )}

              {/* Volume control */}
              {audioUrl && (
                <div
                  className={cn(
                    "flex items-center gap-2 transition-opacity",
                    isPlaying ? "opacity-100" : "opacity-50 group-hover:opacity-100"
                  )}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={toggleMute}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {isMuted || volume === 0 ? (
                      <VolumeX className="h-3.5 w-3.5" />
                    ) : (
                      <Volume2 className="h-3.5 w-3.5" />
                    )}
                  </button>
                  <Slider
                    value={[isMuted ? 0 : volume]}
                    max={100}
                    step={1}
                    onValueChange={handleVolumeChange}
                    className="w-20 cursor-pointer [&_[role=slider]]:h-2.5 [&_[role=slider]]:w-2.5"
                  />
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modal de detalle — usa estado local (no toca modalOpen del MediaContext) */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent
          className={cn(
            "flex flex-col gap-0 p-0 overflow-hidden",
            hasPdf
              ? "max-w-2xl max-h-[85vh]"
              : "max-w-md max-h-[90vh]"
          )}
        >
          {/* Header */}
          <DialogHeader className="p-4 pb-3 border-b shrink-0">
            <div className="flex items-start gap-3 pr-6">
              <div className="p-2 rounded-lg bg-violet-500/10 shrink-0">
                <Music className="h-5 w-5 text-violet-500" />
              </div>
              <div className="min-w-0 flex-1">
                <DialogTitle className="line-clamp-2 leading-snug">{audio.titulo}</DialogTitle>
                <DialogDescription className="sr-only">
                  Detalle del audio: {audio.titulo}
                </DialogDescription>
                {audio.tipo && (
                  <Badge variant="secondary" className="capitalize text-[10px] mt-1">
                    {audio.tipo}
                  </Badge>
                )}
              </div>
            </div>
          </DialogHeader>

          {/* Scrollable body */}
          <div className="flex-1 overflow-y-auto min-h-0">
            {/* Player inline */}
            <div className="p-4 border-b">
              <div className="flex items-center gap-3 group">
                {/* Play/Pause */}
                <button
                  onClick={togglePlay}
                  disabled={!audioUrl}
                  className={cn(
                    "flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-all",
                    isPlaying
                      ? "bg-violet-500 text-white shadow-lg shadow-violet-500/30"
                      : "bg-violet-500/10 text-violet-500 hover:bg-violet-500 hover:text-white hover:shadow-lg hover:shadow-violet-500/30",
                    !audioUrl && "opacity-50 cursor-not-allowed"
                  )}
                >
                  {isBuffering ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : isPlaying ? (
                    <Pause className="h-5 w-5" />
                  ) : (
                    <Play className="h-5 w-5 ml-0.5" />
                  )}
                </button>

                {/* Sliders */}
                <div className="flex-1 min-w-0 space-y-1">
                  {audioUrl && (
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-muted-foreground w-8 text-right tabular-nums">
                        {formatTime(currentTime)}
                      </span>
                      <Slider
                        value={[progress]}
                        max={100}
                        step={0.1}
                        onValueChange={handleSeek}
                        className="flex-1 cursor-pointer [&_[role=slider]]:h-3 [&_[role=slider]]:w-3 [&_[role=slider]]:border-violet-500 [&_.bg-primary]:bg-violet-500"
                      />
                      <span className="text-[10px] text-muted-foreground w-8 tabular-nums">
                        {formatTime(duration) || audio.duracion || '--:--'}
                      </span>
                    </div>
                  )}
                  {audioUrl && (
                    <div className={cn(
                      "flex items-center gap-2 transition-opacity",
                      isPlaying ? "opacity-100" : "opacity-50 group-hover:opacity-100"
                    )}>
                      <button
                        onClick={toggleMute}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {isMuted || volume === 0 ? (
                          <VolumeX className="h-3.5 w-3.5" />
                        ) : (
                          <Volume2 className="h-3.5 w-3.5" />
                        )}
                      </button>
                      <Slider
                        value={[isMuted ? 0 : volume]}
                        max={100}
                        step={1}
                        onValueChange={handleVolumeChange}
                        className="w-20 cursor-pointer [&_[role=slider]]:h-2.5 [&_[role=slider]]:w-2.5"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Condicional: PDF o metadata */}
            {hasPdf ? (
              <div className="flex flex-col">
                <div className="h-[50vh]">
                  <PdfViewer
                    url={audio.partitura_pdf}
                    title={`Partitura — ${audio.titulo}`}
                    className="w-full h-full"
                    toolbar
                  />
                </div>
                <div className="p-4 border-t shrink-0">
                  <Button variant="outline" size="sm" asChild className="w-full">
                    <a href={audio.partitura_pdf} download>
                      <Download className="h-4 w-4 mr-2" />
                      Descargar partitura
                    </a>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="p-4 space-y-3">
                {/* Metadata grid */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {audio.compositor && (
                    <div>
                      <p className="text-xs text-muted-foreground">Compositor</p>
                      <p className="font-medium">{audio.compositor}</p>
                    </div>
                  )}
                  {audio.interprete && (
                    <div>
                      <p className="text-xs text-muted-foreground">Intérprete</p>
                      <p className="font-medium">{audio.interprete}</p>
                    </div>
                  )}
                  {(audio.anio_composicion || audio.anio_grabacion) && (
                    <div>
                      <p className="text-xs text-muted-foreground">
                        {audio.anio_composicion ? 'Composición' : 'Grabación'}
                      </p>
                      <p className="font-medium">
                        {audio.anio_composicion || audio.anio_grabacion}
                      </p>
                    </div>
                  )}
                  {audio.tipo && (
                    <div>
                      <p className="text-xs text-muted-foreground">Tipo</p>
                      <p className="font-medium capitalize">{audio.tipo}</p>
                    </div>
                  )}
                </div>
                {/* Letra */}
                {audio.letra && (
                  <div className="border-t pt-3">
                    <p className="text-xs text-muted-foreground mb-2">Letra</p>
                    <div className="max-h-48 overflow-y-auto">
                      <p className="text-sm whitespace-pre-line leading-relaxed">{audio.letra}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
});

// ═══════════════════════════════════════════════════════════════════════════════
// DISTINCION CARD
// ═══════════════════════════════════════════════════════════════════════════════

const TIPOS_DISTINCION = {
  reconocimiento: 'Reconocimiento',
  premio: 'Premio',
  medalla: 'Medalla',
  diploma: 'Diploma',
  condecoracion: 'Condecoración',
};

const DistincionCard = React.memo(function DistincionCard({ item, onViewPdf }) {
  const tipoLabel = TIPOS_DISTINCION[item.tipo] || item.tipo;

  return (
    <Card className="border-border/50 hover:border-amber-500/30 transition-all duration-300 hover:shadow-lg border-l-4 border-l-amber-500">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-full bg-gradient-to-br from-amber-500/20 to-yellow-500/20">
            <Award className="h-6 w-6 text-amber-500" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400">
                {tipoLabel}
              </span>
            </div>
            <h4 className="font-semibold line-clamp-2">{item.titulo}</h4>
            {item.otorgante && (
              <p className="text-sm text-muted-foreground mt-1">
                {item.otorgante}
              </p>
            )}
            <div className="flex items-center justify-between mt-3">
              {item.fecha_otorgamiento && (
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {(() => { const [y,m,d] = String(item.fecha_otorgamiento).split('T')[0].split('-').map(Number); return new Date(y,m-1,d).toLocaleDateString(DATE_LOCALE, { year: 'numeric' }); })()}
                </p>
              )}
              {item.pdf_url && (
                <button
                  onClick={() => onViewPdf?.(item)}
                  className="text-xs text-amber-600 hover:text-amber-500 flex items-center gap-1 transition-colors"
                >
                  <FileText className="h-3 w-3" />
                  Ver documento
                </button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

// ═══════════════════════════════════════════════════════════════════════════════
// DISTINCIONES PDF MODAL - Modal para ver PDF de distincion
// ═══════════════════════════════════════════════════════════════════════════════

const DistincionPdfModal = React.memo(function DistincionPdfModal({ item, isOpen, onClose }) {
  if (!item) return null;

  const pdfUrl = item.pdf_url;
  const tipoLabel = TIPOS_DISTINCION[item.tipo] || item.tipo;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl w-[95vw] h-[85vh] flex flex-col p-0 gap-0">
        <DialogHeader className="p-4 pb-3 border-b shrink-0 bg-gradient-to-r from-amber-500/10 to-yellow-500/10">
          <div className="flex items-center gap-3 pr-8">
            <div className="p-2 rounded-lg bg-amber-500/20 shrink-0">
              <Award className="h-5 w-5 text-amber-500" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="secondary" className="text-xs bg-amber-500/10 text-amber-600">
                  {tipoLabel}
                </Badge>
                {item.fecha_otorgamiento && (
                  <span className="text-xs text-muted-foreground">
                    {String(item.fecha_otorgamiento).split('T')[0].split('-')[0]}
                  </span>
                )}
              </div>
              <DialogTitle className="line-clamp-1">{item.titulo}</DialogTitle>
              <DialogDescription className="line-clamp-1">
                {item.otorgante}
              </DialogDescription>
            </div>
            <div className="flex gap-2 shrink-0">
              <Button variant="outline" size="sm" asChild>
                <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 sm:mr-1" />
                  <span className="hidden sm:inline">{STRINGS.newTab}</span>
                </a>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a href={pdfUrl} download>
                  <Download className="h-4 w-4 sm:mr-1" />
                  <span className="hidden sm:inline">{STRINGS.download}</span>
                </a>
              </Button>
            </div>
          </div>
        </DialogHeader>
        <div className="flex-1 min-h-0 bg-muted/20">
          <PdfViewer
            url={pdfUrl}
            title={item.titulo}
            className="w-full h-full"
            toolbar
          />
        </div>
      </DialogContent>
    </Dialog>
  );
});

// ═══════════════════════════════════════════════════════════════════════════════
// DISTINCIONES LIST - Scroll para muchos items (20+)
// ═══════════════════════════════════════════════════════════════════════════════

const DistincionesList = React.memo(function DistincionesList({ items }) {
  const [selectedItem, setSelectedItem] = React.useState(null);
  const [modalOpen, setModalOpen] = React.useState(false);

  const handleViewPdf = React.useCallback((item) => {
    setSelectedItem(item);
    setModalOpen(true);
  }, []);

  const handleCloseModal = React.useCallback(() => {
    setModalOpen(false);
    setSelectedItem(null);
  }, []);

  if (!items || items.length === 0) return null;

  return (
    <>
      <div className="space-y-4">
        {items.map(item => (
          <DistincionCard key={item.id} item={item} onViewPdf={handleViewPdf} />
        ))}
      </div>

      {/* Modal para ver PDF */}
      <DistincionPdfModal
        item={selectedItem}
        isOpen={modalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
});

// ═══════════════════════════════════════════════════════════════════════════════
// ESTANDARTE CARD
// ═══════════════════════════════════════════════════════════════════════════════

const EstandarteCard = React.memo(function EstandarteCard({ item, onClick }) {
  const imageUrl = item.image_url || storageUrl(item.imagen_principal);
  return (
    <Card
      className="overflow-hidden border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg group cursor-pointer"
      onClick={onClick}
    >
      <AspectRatio ratio={3 / 4}>
        <div className="relative w-full h-full bg-muted">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={item.titulo}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-500/20 to-yellow-500/20">
              <Flag className="h-16 w-16 text-amber-500/50" />
            </div>
          )}
          {item.anio && (
            <Badge className="absolute top-3 right-3 bg-black/70">{item.anio}</Badge>
          )}
          {/* Overlay hint */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
            <div className="p-2 rounded-full bg-white/30 backdrop-blur-sm">
              <ExternalLink className="h-5 w-5 text-white" />
            </div>
          </div>
        </div>
      </AspectRatio>
      <CardContent className="p-4">
        <h4 className="font-semibold line-clamp-1 group-hover:text-primary transition-colors">
          {item.titulo}
        </h4>
        {item.descripcion && (
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
            {item.descripcion}
          </p>
        )}
      </CardContent>
    </Card>
  );
});

// ═══════════════════════════════════════════════════════════════════════════════
// ESTANDARTES CAROUSEL - Con Lightbox y dots
// ═══════════════════════════════════════════════════════════════════════════════

const EstandartesCarousel = React.memo(function EstandartesCarousel({ items }) {
  const [lightboxOpen, setLightboxOpen] = React.useState(false);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [carouselApi, setCarouselApi] = React.useState(null);
  const [currentSlide, setCurrentSlide] = React.useState(0);

  // Sync carousel position with dots
  React.useEffect(() => {
    if (!carouselApi) return;
    carouselApi.on('select', () => {
      setCurrentSlide(carouselApi.selectedScrollSnap());
    });
  }, [carouselApi]);

  const handleCardClick = (index) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  const handleNavigate = (index) => {
    setCurrentIndex(index);
  };

  // Prepare images for lightbox
  const lightboxImages = items.map(item => ({
    src: item.image_url || storageUrl(item.imagen_principal),
    alt: item.titulo,
    title: item.titulo,
    description: item.descripcion,
  }));

  return (
    <>
      <Carousel
        opts={{ align: 'start', loop: true }}
        setApi={setCarouselApi}
        className="w-full"
      >
        <CarouselContent className="-ml-2">
          {items.map((item, index) => (
            <CarouselItem key={item.id} className="pl-2 basis-full sm:basis-1/2">
              <EstandarteCard
                item={item}
                onClick={() => handleCardClick(index)}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        {items.length > 2 && (
          <>
            <CarouselPrevious className="left-0 bg-background/80 hover:bg-background" />
            <CarouselNext className="right-0 bg-background/80 hover:bg-background" />
          </>
        )}
      </Carousel>

      {/* Carousel Dots */}
      {items.length > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {items.map((_, idx) => (
            <button
              key={idx}
              className={cn(
                "w-2 h-2 rounded-full transition-all",
                idx === currentSlide
                  ? "bg-primary w-6"
                  : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
              )}
              onClick={() => carouselApi?.scrollTo(idx)}
              aria-label={`Ir a estandarte ${idx + 1}`}
            />
          ))}
        </div>
      )}

      {/* Image Lightbox */}
      <ImageLightbox
        open={lightboxOpen}
        onOpenChange={setLightboxOpen}
        images={lightboxImages}
        currentIndex={currentIndex}
        onNavigate={handleNavigate}
      />
    </>
  );
});

// ═══════════════════════════════════════════════════════════════════════════════
// PRESIDENTE TIMELINE - Vista profesional para muchos presidentes
// ═══════════════════════════════════════════════════════════════════════════════

const PresidenteTimeline = React.memo(function PresidenteTimeline({ members }) {
  if (!members || members.length === 0) return null;

  // Ordenar: actual primero, luego más reciente arriba, fundadores al fondo
  const sortedMembers = React.useMemo(() => {
    return [...members].sort((a, b) => {
      // Actual siempre primero
      if (a.isCurrent && !b.isCurrent) return -1;
      if (!a.isCurrent && b.isCurrent) return 1;
      // Luego por orden descendente (más reciente arriba, fundadores al fondo)
      return (b.orden ?? 0) - (a.orden ?? 0);
    });
  }, [members]);

  // Usar campo isCurrent del backend, con fallback a detección por texto
  const isCurrentPresident = (member) => {
    if (typeof member.isCurrent === 'boolean') return member.isCurrent;
    const period = member.period?.toLowerCase() || '';
    return period.includes('presente') || period.includes('actual') ||
           member.role?.toLowerCase().includes('actual');
  };

  return (
    <div className="relative">
      {/* Línea vertical central */}
      <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-primary/20" />

      <div className="space-y-1">
        {sortedMembers.map((member, index) => {
          const isCurrent = isCurrentPresident(member);

          return (
            <div
              key={member.id || index}
              className={cn(
                "relative pl-14 pr-2 py-3 rounded-lg transition-all duration-200",
                "hover:bg-muted/50",
                isCurrent && "bg-primary/5 border-l-2 border-l-primary"
              )}
            >
              {/* Nodo del timeline */}
              <div className={cn(
                "absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full border-2 transition-all",
                isCurrent
                  ? "bg-primary border-primary shadow-lg shadow-primary/30"
                  : "bg-background border-primary/50"
              )}>
                {isCurrent && (
                  <span className="absolute inset-0 rounded-full bg-primary animate-ping opacity-30" />
                )}
              </div>

              {/* Contenido */}
              <div className="flex items-start gap-3">
                {/* Avatar pequeño */}
                <div className={cn(
                  "shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold",
                  isCurrent
                    ? "bg-primary text-primary-foreground ring-2 ring-primary/30"
                    : "bg-muted text-muted-foreground"
                )}>
                  {member.avatar ? (
                    <img
                      src={storageUrl(member.avatar)}
                      alt={member.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    getInitials(member.initials || member.name)
                  )}
                </div>

                {/* Info — nombre toma ancho completo, period va con role */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-2 flex-wrap">
                    <h4 className={cn(
                      "font-semibold text-sm line-clamp-2",
                      isCurrent && "text-primary"
                    )}>
                      {member.name}
                    </h4>
                    {isCurrent && (
                      <Badge variant="default" className="text-[10px] px-1.5 py-0">
                        Actual
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center justify-between gap-2 mt-0.5">
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {member.role}
                    </p>
                    <span className={cn(
                      "text-xs font-mono shrink-0",
                      isCurrent ? "text-primary font-semibold" : "text-muted-foreground"
                    )}>
                      {member.period}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Indicador de más items si hay scroll */}
      {sortedMembers.length > 8 && (
        <div className="sticky bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-card to-transparent pointer-events-none" />
      )}
    </div>
  );
});

// ═══════════════════════════════════════════════════════════════════════════════
// PUBLICACION CARD
// ═══════════════════════════════════════════════════════════════════════════════

const PublicacionCard = React.memo(function PublicacionCard({ item, onClick }) {
  const imageUrl = item.image_url || storageUrl(item.imagen_portada);
  const hasPdf = !!(item.pdf_url || item.documento_pdf || item.enlace_externo);
  return (
    <Card
      className="overflow-hidden border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg group cursor-pointer"
      onClick={() => onClick?.(item)}
    >
      <AspectRatio ratio={3 / 4}>
        <div className="relative w-full h-full bg-muted">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={item.titulo}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500/20 to-cyan-500/20">
              <Newspaper className="h-16 w-16 text-blue-500/50" />
            </div>
          )}
          {item.tipo && (
            <Badge className="absolute top-3 left-3 capitalize">{item.tipo}</Badge>
          )}
          {hasPdf && (
            <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm rounded-full p-1.5">
              <FileText className="h-3.5 w-3.5 text-white" />
            </div>
          )}
        </div>
      </AspectRatio>
      <CardContent className="p-4">
        <h4 className="font-semibold line-clamp-1 group-hover:text-primary transition-colors">
          {item.titulo}
        </h4>
        {item.autor && (
          <p className="text-sm text-muted-foreground mt-1 truncate">{item.autor}</p>
        )}
      </CardContent>
    </Card>
  );
});

// ═══════════════════════════════════════════════════════════════════════════════
// PUBLICACION PDF MODAL - Modal para ver PDF/detalles de publicación
// ═══════════════════════════════════════════════════════════════════════════════

const PublicacionPdfModal = React.memo(function PublicacionPdfModal({ item, isOpen, onClose }) {
  if (!item) return null;

  const imageUrl = item.image_url || storageUrl(item.imagen_portada);
  const pdfUrl = item.pdf_url || item.documento_pdf;
  const externalUrl = item.enlace_externo;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn(
        "w-[95vw] max-h-[90vh] flex flex-col p-0 gap-0",
        pdfUrl ? "max-w-5xl h-[85vh]" : "max-w-2xl"
      )}>
        <DialogHeader className="p-4 pb-3 border-b shrink-0">
          <div className="flex items-center gap-3 pr-8">
            <div className="p-2 rounded-lg bg-primary/10 shrink-0">
              <Newspaper className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                {item.tipo && (
                  <Badge className="capitalize text-xs">{item.tipo}</Badge>
                )}
                {item.anio_publicacion && (
                  <span className="text-xs text-muted-foreground">{item.anio_publicacion}</span>
                )}
              </div>
              <DialogTitle className="line-clamp-1">{item.titulo}</DialogTitle>
              <DialogDescription className="line-clamp-1">
                {[item.autor, item.editorial].filter(Boolean).join(' · ')}
              </DialogDescription>
            </div>
            <div className="flex gap-2 shrink-0">
              {pdfUrl && (
                <>
                  <Button variant="outline" size="sm" asChild>
                    <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 sm:mr-1" />
                      <span className="hidden sm:inline">{STRINGS.newTab}</span>
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <a href={pdfUrl} download>
                      <Download className="h-4 w-4 sm:mr-1" />
                      <span className="hidden sm:inline">{STRINGS.download}</span>
                    </a>
                  </Button>
                </>
              )}
              {externalUrl && (
                <Button variant="outline" size="sm" asChild>
                  <a href={externalUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 sm:mr-1" />
                    <span className="hidden sm:inline">{STRINGS.viewLink}</span>
                  </a>
                </Button>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 min-h-0">
          {pdfUrl ? (
            <PdfViewer
              url={pdfUrl}
              title={item.titulo}
              className="w-full h-full"
              toolbar
            />
          ) : (
            <div className="p-6 space-y-4">
              {imageUrl && (
                <div className="flex justify-center">
                  <img
                    src={imageUrl}
                    alt={item.titulo}
                    className="max-h-[40vh] rounded-lg object-contain"
                  />
                </div>
              )}
              {item.descripcion && (
                <p className="text-muted-foreground">{item.descripcion}</p>
              )}
              {item.isbn && (
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium">ISBN:</span> {item.isbn}
                </p>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
});

// ═══════════════════════════════════════════════════════════════════════════════
// PUBLICACIONES CAROUSEL - Carrusel con modal PDF
// ═══════════════════════════════════════════════════════════════════════════════

const PublicacionesCarousel = React.memo(function PublicacionesCarousel({ items }) {
  const [selectedItem, setSelectedItem] = React.useState(null);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [carouselApi, setCarouselApi] = React.useState(null);
  const [currentSlide, setCurrentSlide] = React.useState(0);

  React.useEffect(() => {
    if (!carouselApi) return;
    carouselApi.on('select', () => {
      setCurrentSlide(carouselApi.selectedScrollSnap());
    });
  }, [carouselApi]);

  const handleOpen = React.useCallback((item) => {
    setSelectedItem(item);
    setModalOpen(true);
  }, []);

  const handleClose = React.useCallback(() => {
    setModalOpen(false);
    setSelectedItem(null);
  }, []);

  if (!items || items.length === 0) return null;

  return (
    <>
      <Carousel
        opts={{ align: 'start', loop: items.length > 2 }}
        setApi={setCarouselApi}
        className="w-full"
      >
        <CarouselContent className="-ml-3">
          {items.map((item) => (
            <CarouselItem key={item.id} className="pl-3 basis-1/2">
              <PublicacionCard item={item} onClick={handleOpen} />
            </CarouselItem>
          ))}
        </CarouselContent>
        {items.length > 2 && (
          <>
            <CarouselPrevious className="left-0 bg-background/80 hover:bg-background" />
            <CarouselNext className="right-0 bg-background/80 hover:bg-background" />
          </>
        )}
      </Carousel>

      {/* Dots */}
      {items.length > 2 && (
        <div className="flex justify-center gap-1.5 mt-3">
          {items.map((_, idx) => (
            <button
              key={idx}
              className={cn(
                "w-2 h-2 rounded-full transition-all",
                idx === currentSlide
                  ? "bg-primary w-5"
                  : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
              )}
              onClick={() => carouselApi?.scrollTo(idx)}
              aria-label={`Ir a publicación ${idx + 1}`}
            />
          ))}
        </div>
      )}

      {/* Modal PDF */}
      <PublicacionPdfModal
        item={selectedItem}
        isOpen={modalOpen}
        onClose={handleClose}
      />
    </>
  );
});

// ═══════════════════════════════════════════════════════════════════════════════
// COMUNICADO CARD
// ═══════════════════════════════════════════════════════════════════════════════

const ComunicadoCard = React.memo(function ComunicadoCard({ item, onClick }) {
  return (
    <Card
      className="border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg cursor-pointer group"
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="capitalize">{item.tipo || STRINGS.announcement}</Badge>
          {item.fecha && (
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {(() => { const [y,m,d] = String(item.fecha).split('T')[0].split('-').map(Number); return new Date(y,m-1,d).toLocaleDateString(DATE_LOCALE); })()}
            </span>
          )}
        </div>
        <CardTitle className="text-lg mt-2 group-hover:text-primary transition-colors">{item.titulo}</CardTitle>
      </CardHeader>
      <CardContent>
        {item.extracto && (
          <p className="text-sm text-muted-foreground line-clamp-3">{item.extracto}</p>
        )}
        {item.firmante && (
          <p className="text-sm text-primary font-medium mt-3 flex items-center gap-1">
            <User className="h-4 w-4" />
            {item.firmante}
          </p>
        )}
      </CardContent>
    </Card>
  );
});

// ═══════════════════════════════════════════════════════════════════════════════
// COMUNICADO MODAL - Contenido completo del comunicado
// ═══════════════════════════════════════════════════════════════════════════════

const ComunicadoModal = React.memo(function ComunicadoModal({ item, isOpen, onClose }) {
  if (!item) return null;

  const imageUrl = item.image_url || (item.imagen ? storageUrl(item.imagen) : null);
  const hasImage = !!imageUrl;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn(
        "w-[95vw] max-h-[85vh] flex flex-col p-0 gap-0",
        hasImage ? "max-w-4xl" : "max-w-2xl"
      )}>
        {/* Header */}
        <DialogHeader className="p-5 pb-4 border-b shrink-0">
          <div className="flex items-center gap-3 pr-8">
            <div className="p-2 rounded-lg bg-primary/10 shrink-0">
              <Megaphone className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <Badge variant="outline" className="capitalize text-xs">{item.tipo || STRINGS.announcement}</Badge>
                {item.numero && (
                  <Badge variant="secondary" className="font-mono text-xs">{item.numero}</Badge>
                )}
                {item.fecha && (
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {(() => { const [y,m,d] = String(item.fecha).split('T')[0].split('-').map(Number); return new Date(y,m-1,d).toLocaleDateString(DATE_LOCALE, { year: 'numeric', month: 'long', day: 'numeric' }); })()}
                  </span>
                )}
              </div>
              <DialogTitle className="line-clamp-2">{item.titulo}</DialogTitle>
              <DialogDescription className="sr-only">Contenido del comunicado</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Body - responsive: imagen izq + contenido der en desktop, apilado en mobile */}
        <div className="flex-1 overflow-y-auto p-5">
          <div className={cn(hasImage && "md:flex md:gap-6")}>
            {hasImage && (
              <div className="md:w-2/5 shrink-0 mb-4 md:mb-0">
                <img
                  src={imageUrl}
                  alt={item.titulo}
                  className="w-full rounded-lg object-contain"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div
                className="prose prose-sm dark:prose-invert max-w-none break-words"
                dangerouslySetInnerHTML={{ __html: item.contenido || item.extracto }}
              />
            </div>
          </div>
        </div>

        {/* Footer con firmante */}
        {item.firmante && (
          <div className="p-4 border-t shrink-0 bg-muted/30">
            <p className="text-sm font-medium flex items-center gap-2">
              <User className="h-4 w-4 text-primary" />
              <span>{item.firmante}</span>
              {item.cargo_firmante && (
                <span className="text-muted-foreground font-normal">— {item.cargo_firmante}</span>
              )}
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
});

// ═══════════════════════════════════════════════════════════════════════════════
// COMUNICADOS LIST - Cards clickeables con modal de contenido
// ═══════════════════════════════════════════════════════════════════════════════

const ComunicadosList = React.memo(function ComunicadosList({ items }) {
  const [selectedItem, setSelectedItem] = React.useState(null);
  const [modalOpen, setModalOpen] = React.useState(false);

  const handleOpen = React.useCallback((item) => {
    setSelectedItem(item);
    setModalOpen(true);
  }, []);

  const handleClose = React.useCallback(() => {
    setModalOpen(false);
    setSelectedItem(null);
  }, []);

  if (!items || items.length === 0) return null;

  return (
    <>
      {items.map(item => (
        <ComunicadoCard key={item.id} item={item} onClick={() => handleOpen(item)} />
      ))}
      <ComunicadoModal item={selectedItem} isOpen={modalOpen} onClose={handleClose} />
    </>
  );
});

// ═══════════════════════════════════════════════════════════════════════════════
// ANNOUNCEMENT MODAL - Modal de anuncio al entrar a la página (1 comunicado destacado)
// ═══════════════════════════════════════════════════════════════════════════════

function AnnouncementModal({ item }) {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    if (!item) return;
    // Pequeño delay para que no aparezca instantáneamente
    const timer = setTimeout(() => setOpen(true), 800);
    return () => clearTimeout(timer);
  }, [item]);

  const handleClose = React.useCallback(() => {
    setOpen(false);
  }, []);

  if (!item) return null;

  return <ComunicadoModal item={item} isOpen={open} onClose={handleClose} />;
}

// ═══════════════════════════════════════════════════════════════════════════════
// PANEL CONFIG - Configuración de las 10 secciones individuales
// ═══════════════════════════════════════════════════════════════════════════════

const PANEL_CONFIG = {
  'ley24325': {
    title: 'Ley 24325',
    icon: Scale,
    dataKey: 'ley24325',
    renderType: 'reorderable-documents',
  },
  'videos': {
    title: 'Videos',
    icon: Video,
    dataKey: 'videos',
    renderType: 'reorderable-videos',
  },
  'base-legal': {
    title: 'Base Legal',
    icon: FileText,
    dataKey: 'baseLegal',
    renderType: 'documents',
  },
  'audios': {
    title: 'Audios',
    icon: Music,
    dataKey: 'audios',
    renderType: 'audios',
  },
  'indecopi': {
    title: 'INDECOPI',
    icon: Shield,
    dataKey: 'indecopi',
    renderType: 'documents-shield',
  },
  'distinciones': {
    title: 'Distinciones',
    icon: Award,
    dataKey: 'distinciones',
    renderType: 'distinciones',
  },
  'estandartes': {
    title: 'Estandartes',
    icon: Flag,
    dataKey: 'estandartes',
    renderType: 'estandartes-grid',
  },
  'publicaciones': {
    title: 'Publicaciones',
    icon: Newspaper,
    dataKey: 'publicaciones',
    renderType: 'publicaciones-grid',
  },
  'presidentes': {
    title: 'Presidentes',
    icon: Users,
    dataKey: 'presidentes',
    renderType: 'presidentes-grid',
  },
  'comunicados': {
    title: 'Comunicados',
    icon: Megaphone,
    dataKey: 'comunicados',
    renderType: 'comunicados',
  },
};

// Orden inicial: 10 paneles en pares (como estaban originalmente)
const INITIAL_PANEL_ORDER = [
  'ley24325', 'videos',
  'base-legal', 'audios',
  'indecopi', 'distinciones',
  'estandartes', 'publicaciones',
  'presidentes', 'comunicados',
];

// ═══════════════════════════════════════════════════════════════════════════════
// PANEL RENDERER - Renderiza contenido de cada panel individual
// ═══════════════════════════════════════════════════════════════════════════════

const PanelRenderer = React.memo(function PanelRenderer({ panelId, data }) {
  const config = PANEL_CONFIG[panelId];
  if (!config) return null;

  const items = data[config.dataKey] || [];
  if (items.length === 0) return null;

  const Icon = config.icon;
  const isDocumentPanel = DOCUMENT_RENDER_TYPES.includes(config.renderType);

  const renderContent = () => {
    switch (config.renderType) {
      case 'reorderable-documents':
        return <DocumentList documents={items} icon={Scale} />;
      case 'reorderable-videos':
        return <VideoList videos={items} />;
      case 'documents':
        return <DocumentList documents={items} icon={FileText} />;
      case 'documents-shield':
        return <DocumentList documents={items} icon={Shield} />;
      case 'audios':
        return items.map(item => (
          <AudioCard key={item.id} audio={item} />
        ));
      case 'distinciones':
        return <DistincionesList items={items} />;
      case 'estandartes-grid':
        return <EstandartesCarousel items={items} />;
      case 'publicaciones-grid':
        return <PublicacionesCarousel items={items} />;
      case 'presidentes-grid':
        return <PresidenteTimeline members={items} />;
      case 'comunicados':
        return <ComunicadosList items={items} />;
      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Icon className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">{config.title}</h3>
        <Badge variant="secondary" className="ml-auto">
          {items.length}
        </Badge>
      </div>
      {/* Content - Documents use overflow-hidden (fixed height, internal nav), others scroll */}
      <div
        className={cn(
          "relative flex-1",
          isDocumentPanel
            ? "overflow-hidden"
            : "overflow-y-auto scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent"
        )}
        style={isDocumentPanel ? undefined : { maxHeight: PANEL_MAX_HEIGHT }}
      >
        <div className="space-y-4">
          {renderContent()}
        </div>
      </div>
    </div>
  );
});

// ═══════════════════════════════════════════════════════════════════════════════
// SORTABLE PANEL - Panel individual con drag & drop via @dnd-kit
// ═══════════════════════════════════════════════════════════════════════════════

const SortablePanel = React.memo(function SortablePanel({ id, panelNumber, totalPanels, data }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? DRAG_Z_INDEX : 'auto',
    opacity: isDragging ? DRAG_OPACITY : 1,
  };

  // Separate aria attributes from role to avoid button behavior
  const { role, ...ariaAttrs } = attributes;

  // Computed style with scale on drag
  const computedStyle = React.useMemo(() => ({
    ...style,
    transform: isDragging
      ? `${style.transform || ''} scale(${DRAG_SCALE})`.trim()
      : style.transform,
  }), [style, isDragging]);

  return (
    <div
      ref={setNodeRef}
      style={computedStyle}
      {...ariaAttrs}
      {...listeners}
      role="listitem"
      data-panel-id={id}
      className={cn(
        "relative group w-full lg:w-[calc(50%-12px)] bg-card/40 backdrop-blur-sm border rounded-xl p-6 transition-all select-none",
        isDragging
          ? "border-primary shadow-2xl cursor-grabbing"
          : "border-border/50 hover:border-primary/30 cursor-grab"
      )}
    >
      {/* Drag Handle Indicator */}
      <div className="absolute -top-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20 pointer-events-none">
        <div className="bg-primary rounded-full px-3 py-1 flex items-center gap-2 shadow-lg border border-primary-foreground/20">
          <GripVertical className="h-4 w-4 text-primary-foreground" />
          <span className="text-xs font-bold text-primary-foreground">{panelNumber}/{totalPanels}</span>
        </div>
      </div>

      {/* Contenido del panel */}
      <PanelRenderer panelId={id} data={data} />
    </div>
  );
});

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT - 10 paneles reordenables con @dnd-kit (soporta grid 2D)
// ═══════════════════════════════════════════════════════════════════════════════

export function ContentColumns({
  ley24325 = [],
  baseLegal = [],
  indecopi = [],
  estandartes = [],
  presidentes = [],
  videos = [],
  audios = [],
  distinciones = [],
  publicaciones = [],
  comunicados = [],
  comunicadoDestacado = null,
  config,
  className,
}) {
  // Solo IDs en el estado (ligero)
  const [panelOrder, setPanelOrder] = React.useState(INITIAL_PANEL_ORDER);

  // Sensores para mouse/touch y keyboard
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: DRAG_ACTIVATION_DISTANCE,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Datos memoizados
  const data = React.useMemo(() => ({
    ley24325, baseLegal, indecopi, estandartes, presidentes,
    videos, audios, distinciones, publicaciones, comunicados
  }), [ley24325, baseLegal, indecopi, estandartes, presidentes, videos, audios, distinciones, publicaciones, comunicados]);

  // Filtrar paneles que tienen datos
  const activePanels = React.useMemo(() =>
    panelOrder.filter(id => {
      const cfg = PANEL_CONFIG[id];
      return cfg && (data[cfg.dataKey]?.length > 0);
    }),
    [panelOrder, data]
  );

  // Handler para cuando termina el drag
  const handleDragEnd = React.useCallback((event) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setPanelOrder((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }, []);

  return (
    <>
      <section id="contenido" className={cn("pt-20 md:pt-28 pb-8 md:pb-12", className)}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <MotionWrapper direction="up" className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white">
              {config?.columns?.title || STRINGS.sectionTitle}
            </h2>
          </MotionWrapper>

          {/* Grid de paneles con @dnd-kit */}
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={activePanels}
              strategy={rectSortingStrategy}
            >
              <div role="list" className="flex flex-wrap gap-6">
                {activePanels.map((panelId, index) => (
                  <SortablePanel
                    key={panelId}
                    id={panelId}
                    panelNumber={index + 1}
                    totalPanels={activePanels.length}
                    data={data}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      </section>

      {/* Modal de anuncio - comunicado destacado */}
      <AnnouncementModal item={comunicadoDestacado} />
    </>
  );
}

export default ContentColumns;
