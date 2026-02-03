/**
 * @fileoverview Estandartes Section
 * @description Displays Estandartes from the database
 */

import { Flag, Calendar } from 'lucide-react';
import { cn, storageUrl } from '@/lib/utils';
import { Badge } from '@/Components/ui/badge';
import { Card, CardContent } from '@/Components/ui/card';
import { MotionWrapper, StaggerContainer, StaggerItem } from '@/Components/motion/MotionWrapper';

function EstandarteCard({ item }) {
  const imageUrl = storageUrl(item.imagen_principal);
  return (
    <Card className="overflow-hidden border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg group">
      <div className="relative h-64 bg-muted">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={item.titulo}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-500/20 to-yellow-500/20">
            <Flag className="h-16 w-16 text-amber-500/50" />
          </div>
        )}
        {item.tipo && (
          <Badge className="absolute top-3 left-3 capitalize bg-amber-500">
            {item.tipo}
          </Badge>
        )}
        {item.anio && (
          <Badge variant="secondary" className="absolute top-3 right-3">
            {item.anio}
          </Badge>
        )}
      </div>
      <CardContent className="p-4">
        <h4 className="font-semibold line-clamp-2 mb-2 group-hover:text-primary transition-colors">
          {item.titulo}
        </h4>
        {item.descripcion && (
          <p className="text-sm text-muted-foreground line-clamp-3 mb-2">
            {item.descripcion}
          </p>
        )}
        {item.materiales && (
          <p className="text-xs text-muted-foreground">
            <span className="font-medium">Materiales:</span> {item.materiales}
          </p>
        )}
        {item.ubicacion_actual && (
          <p className="text-xs text-primary mt-1">
            {item.ubicacion_actual}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export function EstandartesSection({ estandartes = [], className }) {
  if (estandartes.length === 0) return null;

  return (
    <section id="estandartes" className={cn('py-16 md:py-24 bg-muted/30', className)}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <MotionWrapper direction="up" className="text-center mb-12">
          <Badge variant="outline" className="mb-4">
            Símbolos Institucionales
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Estandartes Históricos
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Los estandartes que representan la historia y tradición de Lira Puno
          </p>
        </MotionWrapper>

        {/* Estandartes Grid */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {estandartes.map((item) => (
            <StaggerItem key={item.id}>
              <EstandarteCard item={item} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

export default EstandartesSection;
