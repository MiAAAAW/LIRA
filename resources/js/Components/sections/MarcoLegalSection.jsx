/**
 * @fileoverview Marco Legal Section
 * @description Displays Ley 24325, Base Legal, and INDECOPI records
 */

import { Scale, FileText, Shield, FileDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/Components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { MotionWrapper, StaggerContainer, StaggerItem } from '@/Components/motion/MotionWrapper';

const iconMap = {
  ley24325: Scale,
  baseLegal: FileText,
  indecopi: Shield,
};

/**
 * Card con PDF embebido visible directamente
 * Layout: Info arriba, PDF abajo (siempre visible)
 */
function ContentCard({ item, type, icon: Icon }) {
  // INDECOPI usa certificado_pdf, los demás usan documento_pdf
  const pdfUrl = item.documento_pdf || item.certificado_pdf;
  const hasPdf = !!pdfUrl;

  return (
    <Card className={cn(
      "border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg",
      hasPdf ? "col-span-full lg:col-span-2" : "" // PDF cards span more columns
    )}>
      <div className={cn(
        hasPdf ? "grid grid-cols-1 lg:grid-cols-2 gap-6" : ""
      )}>
        {/* Info Section */}
        <div>
          <CardHeader className="pb-3">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-base font-semibold line-clamp-2">
                  {item.titulo}
                </CardTitle>
                {item.numero_ley && (
                  <Badge variant="outline" className="mt-1 text-xs">
                    Ley {item.numero_ley}
                  </Badge>
                )}
                {item.numero_documento && (
                  <Badge variant="outline" className="mt-1 text-xs">
                    {item.numero_documento}
                  </Badge>
                )}
                {item.numero_registro && (
                  <Badge variant="outline" className="mt-1 text-xs">
                    {item.numero_registro}
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm text-muted-foreground mb-3">
              {item.descripcion}
            </p>
            {item.fecha_promulgacion && (
              <p className="text-xs text-muted-foreground">
                Promulgada: {new Date(item.fecha_promulgacion).toLocaleDateString('es-PE')}
              </p>
            )}
            {item.fecha_emision && (
              <p className="text-xs text-muted-foreground">
                Emitido: {new Date(item.fecha_emision).toLocaleDateString('es-PE')}
              </p>
            )}
            {item.entidad_emisora && (
              <p className="text-xs text-primary font-medium mt-1">
                {item.entidad_emisora}
              </p>
            )}

            {/* Download button */}
            {hasPdf && (
              <Button variant="outline" size="sm" className="mt-4" asChild>
                <a href={pdfUrl} download target="_blank" rel="noopener noreferrer">
                  <FileDown className="mr-2 h-4 w-4" /> Descargar PDF
                </a>
              </Button>
            )}
          </CardContent>
        </div>

        {/* PDF Viewer - Always visible */}
        {hasPdf && (
          <div className="p-4 lg:p-6 lg:pl-0">
            <div className="rounded-xl overflow-hidden border bg-muted/20 shadow-inner">
              <iframe
                src={`${pdfUrl}#toolbar=1&navpanes=0&scrollbar=1&view=FitH`}
                className="w-full h-[500px] lg:h-[600px]"
                title={`PDF: ${item.titulo}`}
              />
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

export function MarcoLegalSection({ ley24325 = [], baseLegal = [], indecopi = [], className }) {
  const hasContent = ley24325.length > 0 || baseLegal.length > 0 || indecopi.length > 0;

  if (!hasContent) return null;

  return (
    <section id="marco-legal" className={cn('py-16 md:py-24', className)}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <MotionWrapper direction="up" className="text-center mb-12">
          <Badge variant="outline" className="mb-4">
            Marco Legal
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Reconocimiento Oficial
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            La Pandilla Puneña cuenta con reconocimiento legal como Patrimonio Cultural de la Nación
          </p>
        </MotionWrapper>

        {/* Ley 24325 */}
        {ley24325.length > 0 && (
          <div className="mb-12">
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Scale className="h-5 w-5 text-primary" />
              Ley 24325 - Patrimonio Cultural
            </h3>
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ley24325.map((item) => (
                <StaggerItem key={item.id}>
                  <ContentCard item={item} type="ley24325" icon={Scale} />
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        )}

        {/* Base Legal */}
        {baseLegal.length > 0 && (
          <div className="mb-12">
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Base Legal y Normativas
            </h3>
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {baseLegal.map((item) => (
                <StaggerItem key={item.id}>
                  <ContentCard item={item} type="baseLegal" icon={FileText} />
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        )}

        {/* INDECOPI */}
        {indecopi.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Registros INDECOPI
            </h3>
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {indecopi.map((item) => (
                <StaggerItem key={item.id}>
                  <ContentCard item={item} type="indecopi" icon={Shield} />
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        )}
      </div>
    </section>
  );
}

export default MarcoLegalSection;
