/**
 * @fileoverview Publicaciones Section
 * @description Displays Publicaciones, Comunicados, and Distinciones
 */

import { useState } from 'react';
import { Newspaper, Megaphone, Award, Calendar, User, ExternalLink, Download, FileText, BookOpen } from 'lucide-react';
import { cn, storageUrl } from '@/lib/utils';
import { Badge } from '@/Components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/Components/ui/dialog';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '@/Components/ui/carousel';
import { MotionWrapper, StaggerContainer, StaggerItem } from '@/Components/motion/MotionWrapper';

function formatDate(dateString) {
  if (!dateString) return null;
  try {
    return new Date(dateString).toLocaleDateString('es-PE', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return null;
  }
}

function PublicacionCard({ item, onClick }) {
  const imageUrl = item.image_url || storageUrl(item.imagen_portada);
  return (
    <Card
      className="h-full border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg group cursor-pointer"
      onClick={() => onClick?.(item)}
    >
      <div className="relative h-52 bg-muted overflow-hidden rounded-t-lg">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={item.titulo}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-500/20 to-orange-500/20">
            <BookOpen className="h-16 w-16 text-amber-500/50" />
          </div>
        )}
        {item.tipo && (
          <Badge className="absolute top-3 left-3 capitalize">
            {item.tipo}
          </Badge>
        )}
        {(item.pdf_url || item.documento_pdf || item.enlace_externo) && (
          <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm rounded-full p-2">
            <FileText className="h-4 w-4 text-white" />
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <h4 className="font-semibold line-clamp-2 mb-2 group-hover:text-primary transition-colors">
          {item.titulo}
        </h4>
        {item.autor && (
          <p className="text-sm text-primary font-medium mb-1">
            {item.autor}
          </p>
        )}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {item.anio_publicacion && <span>{item.anio_publicacion}</span>}
          {item.editorial && (
            <>
              <span>·</span>
              <span className="truncate">{item.editorial}</span>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function PublicacionModal({ item, open, onOpenChange }) {
  if (!item) return null;

  const imageUrl = item.image_url || storageUrl(item.imagen_portada);
  const pdfUrl = item.pdf_url || item.documento_pdf;
  const externalUrl = item.enlace_externo;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl">{item.titulo}</DialogTitle>
          <DialogDescription className="flex items-center gap-2 flex-wrap">
            {item.tipo && <Badge className="capitalize">{item.tipo}</Badge>}
            {item.autor && <span>{item.autor}</span>}
            {item.anio_publicacion && <span>· {item.anio_publicacion}</span>}
            {item.editorial && <span>· {item.editorial}</span>}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto min-h-0">
          {/* PDF Viewer */}
          {pdfUrl ? (
            <div className="w-full h-[60vh] rounded-lg overflow-hidden border bg-muted">
              <iframe
                src={pdfUrl}
                title={item.titulo}
                className="w-full h-full"
              />
            </div>
          ) : imageUrl ? (
            <div className="flex justify-center">
              <img
                src={imageUrl}
                alt={item.titulo}
                className="max-h-[50vh] rounded-lg object-contain"
              />
            </div>
          ) : null}

          {/* Descripcion */}
          {item.descripcion && (
            <p className="text-muted-foreground mt-4">
              {item.descripcion}
            </p>
          )}

          {/* ISBN */}
          {item.isbn && (
            <p className="text-sm text-muted-foreground mt-2">
              <span className="font-medium">ISBN:</span> {item.isbn}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-4 border-t flex-shrink-0">
          {pdfUrl && (
            <Button asChild>
              <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
                <Download className="mr-2 h-4 w-4" />
                Descargar PDF
              </a>
            </Button>
          )}
          {externalUrl && (
            <Button variant="outline" asChild>
              <a href={externalUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                Ver enlace
              </a>
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ComunicadoCard({ item }) {
  return (
    <Card className="h-full border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <Badge variant="outline" className="capitalize shrink-0">
            {item.tipo || 'Comunicado'}
          </Badge>
          {item.fecha && (
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatDate(item.fecha)}
            </span>
          )}
        </div>
        <CardTitle className="text-base font-semibold line-clamp-2 mt-2">
          {item.titulo}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {item.extracto && (
          <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
            {item.extracto}
          </p>
        )}
        {item.firmante && (
          <p className="text-xs text-primary font-medium flex items-center gap-1">
            <User className="h-3 w-3" />
            {item.firmante}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

function DistincionCard({ item }) {
  return (
    <Card className="h-full border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg border-l-4 border-l-amber-500">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-full bg-amber-500/10 shrink-0">
            <Award className="h-6 w-6 text-amber-500" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold line-clamp-2 mb-1">
              {item.titulo}
            </h4>
            {item.otorgante && (
              <p className="text-sm text-primary font-medium mb-1">
                {item.otorgante}
              </p>
            )}
            {item.descripcion && (
              <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                {item.descripcion}
              </p>
            )}
            {item.fecha_otorgamiento && (
              <p className="text-xs text-muted-foreground">
                {formatDate(item.fecha_otorgamiento)}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function PublicacionesSection({ publicaciones = [], comunicados = [], distinciones = [], className }) {
  const [selectedPublicacion, setSelectedPublicacion] = useState(null);
  const hasContent = publicaciones.length > 0 || comunicados.length > 0 || distinciones.length > 0;

  if (!hasContent) return null;

  return (
    <section id="publicaciones" className={cn('py-16 md:py-24', className)}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <MotionWrapper direction="up" className="text-center mb-12">
          <Badge variant="outline" className="mb-4">
            Comunicaciones
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Publicaciones y Noticias
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Comunicados oficiales, publicaciones y reconocimientos de Lira Puno
          </p>
        </MotionWrapper>

        {/* Comunicados */}
        {comunicados.length > 0 && (
          <div className="mb-12">
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Megaphone className="h-5 w-5 text-primary" />
              Comunicados Oficiales
            </h3>
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {comunicados.map((item) => (
                <StaggerItem key={item.id}>
                  <ComunicadoCard item={item} />
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        )}

        {/* Publicaciones - Carousel */}
        {publicaciones.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <Newspaper className="h-5 w-5 text-primary" />
                Publicaciones
              </h3>
              <span className="text-sm text-muted-foreground">
                {publicaciones.length} {publicaciones.length === 1 ? 'publicación' : 'publicaciones'}
              </span>
            </div>
            <MotionWrapper direction="up">
              <Carousel
                opts={{
                  align: 'start',
                  loop: publicaciones.length > 3,
                }}
                className="w-full"
              >
                <CarouselContent className="-ml-4">
                  {publicaciones.map((item) => (
                    <CarouselItem
                      key={item.id}
                      className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                    >
                      <PublicacionCard
                        item={item}
                        onClick={setSelectedPublicacion}
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                {publicaciones.length > 1 && (
                  <>
                    <CarouselPrevious className="-left-4 sm:-left-5" />
                    <CarouselNext className="-right-4 sm:-right-5" />
                  </>
                )}
              </Carousel>
            </MotionWrapper>
          </div>
        )}

        {/* Distinciones */}
        {distinciones.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Award className="h-5 w-5 text-amber-500" />
              Distinciones y Reconocimientos
            </h3>
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {distinciones.map((item) => (
                <StaggerItem key={item.id}>
                  <DistincionCard item={item} />
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        )}
      </div>

      {/* Modal PDF Viewer */}
      <PublicacionModal
        item={selectedPublicacion}
        open={!!selectedPublicacion}
        onOpenChange={(open) => !open && setSelectedPublicacion(null)}
      />
    </section>
  );
}

export default PublicacionesSection;
