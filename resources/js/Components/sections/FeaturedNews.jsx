/**
 * @fileoverview Featured News Section Component
 * @description Grid of featured news articles
 */

import { Link } from '@inertiajs/react';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/Components/ui/badge';
import { Card, CardContent } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { MotionWrapper, StaggerContainer, StaggerItem } from '@/Components/motion/MotionWrapper';

/**
 * Format date to locale string
 * @param {string|null} dateString
 */
function formatDate(dateString) {
  if (!dateString) return 'Sin fecha';
  try {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return 'Sin fecha';
  }
}

/**
 * Gradient classes for card placeholders
 */
const gradientClasses = [
  'gradient-card-1', // Rojo a Magenta
  'gradient-card-2', // Naranja a Dorado
  'gradient-card-3', // Azul a Violeta
  'gradient-card-4', // Magenta a Rojo
];

/**
 * News Card Component
 */
function NewsCard({ item, featured = false, index = 0 }) {
  const gradientClass = gradientClasses[index % gradientClasses.length];

  return (
    <Card
      className={cn(
        'group overflow-hidden border-border/50 hover:border-primary/50',
        'transition-all duration-300 hover:shadow-lg hover:shadow-primary/10',
        featured && 'md:col-span-2 md:row-span-2'
      )}
    >
      {/* Image */}
      <div
        className={cn(
          'relative overflow-hidden',
          featured ? 'h-64 md:h-80' : 'h-48'
        )}
      >
        {/* Colorful gradient placeholder */}
        <div className={cn('absolute inset-0', featured ? 'gradient-pandilla' : gradientClass)}>
          {/* Decorative pattern overlay */}
          <div className="absolute inset-0 pattern-andean opacity-30" />
          {/* Decorative icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <span className="text-3xl">🎭</span>
            </div>
          </div>
        </div>

        {/* Category Badge */}
        <Badge
          className="absolute top-4 left-4 z-10 gradient-pandilla text-white border-0"
        >
          {item.category}
        </Badge>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
      </div>

      <CardContent className="p-5">
        {/* Meta */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {formatDate(item.date)}
          </span>
          {item.author && (
            <span className="flex items-center gap-1">
              <User className="h-3.5 w-3.5" />
              {item.author}
            </span>
          )}
        </div>

        {/* Title */}
        <h3
          className={cn(
            'font-semibold text-foreground mb-2 line-clamp-2',
            'group-hover:text-primary transition-colors',
            featured ? 'text-xl md:text-2xl' : 'text-lg'
          )}
        >
          <Link href={item.href}>{item.title}</Link>
        </h3>

        {/* Excerpt */}
        <p
          className={cn(
            'text-muted-foreground line-clamp-2',
            featured ? 'text-base' : 'text-sm'
          )}
        >
          {item.excerpt}
        </p>

        {/* Read More Link */}
        <Link
          href={item.href}
          className={cn(
            'inline-flex items-center gap-1 mt-4 text-sm font-medium',
            'text-primary hover:text-primary/80 transition-colors group/link'
          )}
        >
          Leer más
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/link:translate-x-1" />
        </Link>
      </CardContent>
    </Card>
  );
}

/**
 * Featured News Section Component
 *
 * @param {Object} props
 * @param {import('@/types/landing.types').FeaturedNewsConfig} props.config
 * @param {string} [props.className]
 */
export function FeaturedNews({ config, className }) {
  // Separate featured item from others
  const featuredItem = config.items.find((item) => item.featured);
  const otherItems = config.items.filter((item) => !item.featured);

  return (
    <section
      id="historia"
      className={cn('py-16 md:py-24', className)}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <MotionWrapper direction="up" className="text-center mb-12">
          {config.badge && (
            <Badge variant="outline" className="mb-4">
              {config.badge}
            </Badge>
          )}
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {config.title}
          </h2>
          {config.subtitle && (
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {config.subtitle}
            </p>
          )}
        </MotionWrapper>

        {/* News Grid */}
        <StaggerContainer
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          staggerDelay={0.1}
        >
          {/* Featured Article */}
          {featuredItem && (
            <StaggerItem className="md:col-span-2 lg:col-span-2 lg:row-span-2">
              <NewsCard item={featuredItem} featured />
            </StaggerItem>
          )}

          {/* Other Articles */}
          {otherItems.slice(0, featuredItem ? 3 : 4).map((item, index) => (
            <StaggerItem key={item.id}>
              <NewsCard item={item} index={index + 1} />
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* View All Button */}
        <MotionWrapper direction="up" delay={0.4} className="text-center mt-10">
          <Button
            asChild
            variant="outline"
            size="lg"
            className="group"
          >
            <Link href="/noticias">
              Ver todas las noticias
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </MotionWrapper>
      </div>
    </section>
  );
}

export default FeaturedNews;
