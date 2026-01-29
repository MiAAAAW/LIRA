/**
 * @fileoverview Content Sections Layout
 * @description Secciones separadas con layout 2 columnas
 * Cada sección tiene: Institucional (izq) | Contenido (der)
 */

import React from 'react';
import {
  Scale, FileText, Shield, Flag, Users,
  Video, Music, Award, Newspaper, Megaphone,
  Play, Download, Calendar, User, FileIcon, GripVertical,
  ChevronLeft, ChevronRight, ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { AspectRatio } from '@/Components/ui/aspect-ratio';
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

// i18n strings (extraer a archivo de traducciones si necesario)
const STRINGS = {
  newTab: 'Nueva pestaña',
  download: 'Descargar',
  noDocument: 'Sin documento',
  previous: 'Anterior',
  next: 'Siguiente',
  fullscreen: 'Pantalla completa',
  listen: 'Escuchar',
  composer: 'Compositor:',
  announcement: 'Comunicado',
  sectionTitle: 'Contenido Institucional',
  sectionSubtitle: 'Arrastra los paneles para reorganizar el contenido',
  docNavLabel: 'Navegación de documentos',
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
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    if (isOpen) setIsLoading(true);
  }, [isOpen, doc?.id]);

  if (!doc) return null;

  const pdfUrl = doc.documento_pdf || doc.certificado_pdf;
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
                  <ExternalLink className="h-4 w-4 mr-1" />
                  {STRINGS.newTab}
                </a>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a href={pdfUrl} download aria-label={STRINGS.download}>
                  <Download className="h-4 w-4 mr-1" />
                  {STRINGS.download}
                </a>
              </Button>
            </div>
          </div>
        </DialogHeader>
        <div className="flex-1 min-h-0 relative bg-muted/20">
          {isLoading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/90">
              <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          <iframe
            src={`${pdfUrl}#toolbar=1&navpanes=0&scrollbar=1&view=FitH`}
            className="w-full h-full border-0"
            title={`PDF: ${doc.titulo}`}
            style={{ colorScheme: 'light' }}
            onLoad={() => setIsLoading(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
});

// Visor de documentos con PREVIEW VISIBLE
const DocumentViewer = React.memo(function DocumentViewer({ documents, icon: Icon }) {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isFullscreen, setIsFullscreen] = React.useState(false);

  const totalDocs = documents?.length || 0;

  const goToPrev = React.useCallback(() => {
    setIsLoading(true);
    setActiveIndex(prev => (prev === 0 ? totalDocs - 1 : prev - 1));
  }, [totalDocs]);

  const goToNext = React.useCallback(() => {
    setIsLoading(true);
    setActiveIndex(prev => (prev === totalDocs - 1 ? 0 : prev + 1));
  }, [totalDocs]);

  const goToIndex = React.useCallback((index) => {
    setIsLoading(true);
    setActiveIndex(index);
  }, []);

  const openFullscreen = React.useCallback(() => setIsFullscreen(true), []);
  const closeFullscreen = React.useCallback(() => setIsFullscreen(false), []);

  if (!documents || documents.length === 0) return null;

  const activeDoc = documents[activeIndex];
  const pdfUrl = activeDoc?.documento_pdf || activeDoc?.certificado_pdf;
  const hasPdf = !!pdfUrl;
  const numero = activeDoc?.numero_ley || activeDoc?.numero_documento || activeDoc?.numero_registro;

  return (
    <>
      <Card className="border-border/50 overflow-hidden">
        {/* Header con info del documento */}
        <div className="flex items-center justify-between gap-3 p-3 border-b border-border/50 bg-muted/30">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <div className="p-1.5 rounded-md bg-primary/10 shrink-0">
              <Icon className="h-4 w-4 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="font-semibold text-sm line-clamp-1">{activeDoc.titulo}</h4>
              <p className="text-xs text-muted-foreground line-clamp-1">{activeDoc.descripcion}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {numero && (
              <Badge variant="secondary" className="font-mono text-xs hidden sm:inline-flex">
                {numero}
              </Badge>
            )}
            {hasPdf && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2"
                  onClick={openFullscreen}
                  aria-label={STRINGS.fullscreen}
                  title={STRINGS.fullscreen}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-7 px-2" asChild>
                  <a href={pdfUrl} download aria-label={STRINGS.download} title={STRINGS.download}>
                    <Download className="h-4 w-4" />
                  </a>
                </Button>
              </>
            )}
            {totalDocs > 1 && (
              <Badge variant="outline">{activeIndex + 1}/{totalDocs}</Badge>
            )}
          </div>
        </div>

        {/* PREVIEW DEL PDF - Visible como "hoja" */}
        <div className="relative bg-muted/10" style={{ height: PDF_PREVIEW_HEIGHT }}>
          {hasPdf ? (
            <>
              {isLoading && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/90">
                  <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              )}
              <iframe
                key={activeDoc.id}
                src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=1&view=FitH`}
                className="w-full h-full border-0"
                title={`PDF: ${activeDoc.titulo}`}
                style={{ colorScheme: 'light' }}
                loading="lazy"
                onLoad={() => setIsLoading(false)}
              />
            </>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <FileIcon className="h-12 w-12 mx-auto mb-2 opacity-30" />
                <p className="text-sm">{STRINGS.noDocument}</p>
              </div>
            </div>
          )}
        </div>

        {/* Navegación */}
        {totalDocs > 1 && (
          <div className="flex items-center justify-center gap-4 p-3 border-t border-border/50 bg-muted/20">
            <Button variant="outline" size="sm" onClick={goToPrev} className="h-8">
              <ChevronLeft className="h-4 w-4 mr-1" /> {STRINGS.previous}
            </Button>
            <div className="flex gap-1.5" role="tablist" aria-label={STRINGS.docNavLabel}>
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
            <Button variant="outline" size="sm" onClick={goToNext} className="h-8">
              {STRINGS.next} <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        )}
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

// Alias para compatibilidad (DocumentGrid usado en DocumentList)
const DocumentGrid = DocumentViewer;

// ═══════════════════════════════════════════════════════════════════════════════
// VIDEO CARD
// ═══════════════════════════════════════════════════════════════════════════════

const VideoCard = React.memo(function VideoCard({ video }) {
  return (
    <Card className="overflow-hidden border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg group">
      <AspectRatio ratio={16 / 9}>
        <div className="relative w-full h-full bg-muted">
          {video.thumbnail ? (
            <img
              src={video.thumbnail}
              alt={video.titulo}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
              <Video className="h-12 w-12 text-primary/50" />
            </div>
          )}
          <a
            href={video.url_video}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-300"
          >
            <div className="p-4 rounded-full bg-white/30 transform scale-75 group-hover:scale-100 transition-transform">
              <Play className="h-8 w-8 text-white fill-white" />
            </div>
          </a>
          {video.duracion && (
            <Badge className="absolute bottom-2 right-2 bg-black/80 text-white">
              {video.duracion}
            </Badge>
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
  );
});

// ═══════════════════════════════════════════════════════════════════════════════
// VIDEO CAROUSEL - Muestra 1 video a la vez con navegación
// ═══════════════════════════════════════════════════════════════════════════════

const VideoCarousel = React.memo(function VideoCarousel({ videos }) {
  const [api, setApi] = React.useState(null);
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
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
          {videos.map((video) => (
            <CarouselItem key={video.id} className="pl-4 basis-full">
              <VideoCard video={video} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="flex items-center justify-center gap-4 mt-4">
          <CarouselPrevious className="static translate-x-0 translate-y-0" />
          <span className="text-sm text-muted-foreground font-medium">
            {current} / {count}
          </span>
          <CarouselNext className="static translate-x-0 translate-y-0" />
        </div>
      </Carousel>
    </div>
  );
});

// ═══════════════════════════════════════════════════════════════════════════════
// DOCUMENT LIST - Usa DocumentViewer (preview visible + fullscreen modal)
// ═══════════════════════════════════════════════════════════════════════════════

const DocumentList = React.memo(function DocumentList({ documents, icon: Icon }) {
  if (!documents || documents.length === 0) return null;

  // Siempre usar el grid con modal - máxima performance
  return <DocumentGrid documents={documents} icon={Icon} />;
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
  return (
    <Card className="border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20">
            <Music className="h-6 w-6 text-violet-500" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold line-clamp-1">{audio.titulo}</h4>
            {audio.interprete && (
              <p className="text-sm text-primary font-medium">{audio.interprete}</p>
            )}
            {audio.compositor && (
              <p className="text-xs text-muted-foreground">{STRINGS.composer} {audio.compositor}</p>
            )}
            <div className="flex items-center gap-2 mt-3">
              {audio.duracion && (
                <Badge variant="outline">{audio.duracion}</Badge>
              )}
              {audio.tipo && (
                <Badge variant="secondary" className="capitalize">{audio.tipo}</Badge>
              )}
            </div>
            {audio.url_audio && (
              <Button variant="default" size="sm" className="mt-3" asChild>
                <a href={audio.url_audio} target="_blank" rel="noopener noreferrer">
                  <Play className="mr-2 h-4 w-4" /> {STRINGS.listen}
                </a>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

// ═══════════════════════════════════════════════════════════════════════════════
// DISTINCION CARD
// ═══════════════════════════════════════════════════════════════════════════════

const DistincionCard = React.memo(function DistincionCard({ item }) {
  return (
    <Card className="border-border/50 hover:border-amber-500/30 transition-all duration-300 hover:shadow-lg border-l-4 border-l-amber-500">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-full bg-gradient-to-br from-amber-500/20 to-yellow-500/20">
            <Award className="h-6 w-6 text-amber-500" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold line-clamp-2">{item.titulo}</h4>
            {item.otorgante && (
              <p className="text-sm text-amber-600 dark:text-amber-400 font-medium mt-1">
                {item.otorgante}
              </p>
            )}
            {item.descripcion && (
              <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
                {item.descripcion}
              </p>
            )}
            {item.fecha_otorgamiento && (
              <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {new Date(item.fecha_otorgamiento).toLocaleDateString(DATE_LOCALE, {
                  day: 'numeric', month: 'long', year: 'numeric'
                })}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

// ═══════════════════════════════════════════════════════════════════════════════
// ESTANDARTE CARD
// ═══════════════════════════════════════════════════════════════════════════════

const EstandarteCard = React.memo(function EstandarteCard({ item }) {
  return (
    <Card className="overflow-hidden border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg group">
      <AspectRatio ratio={3 / 4}>
        <div className="relative w-full h-full bg-muted">
          {item.imagen_principal ? (
            <img
              src={item.imagen_principal}
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
// PRESIDENTE CARD
// ═══════════════════════════════════════════════════════════════════════════════

const PresidenteCard = React.memo(function PresidenteCard({ member }) {
  return (
    <Card className="border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg">
      <CardContent className="p-6 text-center">
        <div className="relative w-20 h-20 mx-auto mb-4">
          {member.avatar ? (
            <img
              src={member.avatar}
              alt={member.name}
              className="w-full h-full rounded-full object-cover ring-4 ring-primary/20"
            />
          ) : (
            <div className="w-full h-full rounded-full flex items-center justify-center bg-gradient-to-br from-primary to-primary/70 text-white text-xl font-bold ring-4 ring-primary/20">
              {getInitials(member.name)}
            </div>
          )}
        </div>
        <h4 className="font-semibold">{member.name}</h4>
        <p className="text-sm text-primary font-medium">{member.role}</p>
        {member.period && (
          <p className="text-xs text-muted-foreground mt-1">{member.period}</p>
        )}
      </CardContent>
    </Card>
  );
});

// ═══════════════════════════════════════════════════════════════════════════════
// PUBLICACION CARD
// ═══════════════════════════════════════════════════════════════════════════════

const PublicacionCard = React.memo(function PublicacionCard({ item }) {
  return (
    <Card className="overflow-hidden border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg group">
      <AspectRatio ratio={3 / 4}>
        <div className="relative w-full h-full bg-muted">
          {item.imagen_portada ? (
            <img
              src={item.imagen_portada}
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
        </div>
      </AspectRatio>
      <CardContent className="p-4">
        <h4 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
          {item.titulo}
        </h4>
        {item.autor && (
          <p className="text-sm text-primary mt-1">{item.autor}</p>
        )}
        {item.documento_pdf && (
          <Button variant="outline" size="sm" className="w-full mt-3" asChild>
            <a href={item.documento_pdf} target="_blank" rel="noopener noreferrer">
              <Download className="mr-2 h-4 w-4" /> {STRINGS.download}
            </a>
          </Button>
        )}
      </CardContent>
    </Card>
  );
});

// ═══════════════════════════════════════════════════════════════════════════════
// COMUNICADO CARD
// ═══════════════════════════════════════════════════════════════════════════════

const ComunicadoCard = React.memo(function ComunicadoCard({ item }) {
  return (
    <Card className="border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="capitalize">{item.tipo || STRINGS.announcement}</Badge>
          {item.fecha && (
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {new Date(item.fecha).toLocaleDateString(DATE_LOCALE)}
            </span>
          )}
        </div>
        <CardTitle className="text-lg mt-2">{item.titulo}</CardTitle>
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
        return items.map(item => (
          <DistincionCard key={item.id} item={item} />
        ));
      case 'estandartes-grid':
        return (
          <div className="grid grid-cols-2 gap-4">
            {items.map(item => (
              <EstandarteCard key={item.id} item={item} />
            ))}
          </div>
        );
      case 'publicaciones-grid':
        return (
          <div className="grid grid-cols-2 gap-4">
            {items.map(item => (
              <PublicacionCard key={item.id} item={item} />
            ))}
          </div>
        );
      case 'presidentes-grid':
        return (
          <div className="grid grid-cols-2 gap-4">
            {items.map(item => (
              <PresidenteCard key={item.id} member={item} />
            ))}
          </div>
        );
      case 'comunicados':
        return items.map(item => (
          <ComunicadoCard key={item.id} item={item} />
        ));
      default:
        return null;
    }
  };

  return (
    <div className="h-full">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Icon className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">{config.title}</h3>
        <Badge variant="secondary" className="ml-auto">
          {items.length}
        </Badge>
      </div>
      {/* Content */}
      <div className="space-y-4">
        {renderContent()}
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
        "relative group w-full lg:w-[calc(50%-12px)] bg-card border rounded-xl p-6 transition-all select-none",
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
    <section className={cn("py-8 md:py-12", className)}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <MotionWrapper direction="up" className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">{STRINGS.sectionTitle}</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {STRINGS.sectionSubtitle}
          </p>
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
  );
}

export default ContentColumns;
