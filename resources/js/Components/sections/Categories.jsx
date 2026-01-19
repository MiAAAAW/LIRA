/**
 * @fileoverview Categories Section Component
 * @description Grid of news categories with icons
 */

import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/Components/ui/badge';
import { Card, CardContent } from '@/Components/ui/card';
import { DynamicIcon } from '@/Components/icons/DynamicIcon';
import { MotionWrapper, StaggerContainer, StaggerItem, HoverScale } from '@/Components/motion/MotionWrapper';

/**
 * Color variants for category cards - Paleta Andino Festiva
 */
const colorVariants = {
  // Rojo Carmesí - Principal
  indigo: {
    bg: 'bg-red-500/10 dark:bg-red-500/20',
    text: 'text-red-600 dark:text-red-400',
    hover: 'group-hover:bg-red-500/20 dark:group-hover:bg-red-500/30',
    gradient: 'from-red-500 to-orange-500',
  },
  // Violeta/Magenta
  violet: {
    bg: 'bg-fuchsia-500/10 dark:bg-fuchsia-500/20',
    text: 'text-fuchsia-600 dark:text-fuchsia-400',
    hover: 'group-hover:bg-fuchsia-500/20 dark:group-hover:bg-fuchsia-500/30',
    gradient: 'from-fuchsia-500 to-pink-500',
  },
  // Verde festivo
  emerald: {
    bg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
    text: 'text-emerald-600 dark:text-emerald-400',
    hover: 'group-hover:bg-emerald-500/20 dark:group-hover:bg-emerald-500/30',
    gradient: 'from-emerald-500 to-teal-500',
  },
  // Naranja festivo
  orange: {
    bg: 'bg-orange-500/10 dark:bg-orange-500/20',
    text: 'text-orange-600 dark:text-orange-400',
    hover: 'group-hover:bg-orange-500/20 dark:group-hover:bg-orange-500/30',
    gradient: 'from-orange-500 to-amber-500',
  },
  // Rosa/Magenta
  pink: {
    bg: 'bg-pink-500/10 dark:bg-pink-500/20',
    text: 'text-pink-600 dark:text-pink-400',
    hover: 'group-hover:bg-pink-500/20 dark:group-hover:bg-pink-500/30',
    gradient: 'from-pink-500 to-rose-500',
  },
  // Dorado/Ámbar
  amber: {
    bg: 'bg-amber-500/10 dark:bg-amber-500/20',
    text: 'text-amber-600 dark:text-amber-400',
    hover: 'group-hover:bg-amber-500/20 dark:group-hover:bg-amber-500/30',
    gradient: 'from-amber-500 to-yellow-500',
  },
  default: {
    bg: 'bg-primary/10',
    text: 'text-primary',
    hover: 'group-hover:bg-primary/20',
    gradient: 'from-red-500 to-orange-500',
  },
};

/**
 * Category Card Component
 */
function CategoryCard({ item }) {
  const colors = colorVariants[item.color] || colorVariants.default;

  return (
    <HoverScale scale={1.02}>
      <Link href={item.href}>
        <Card
          className={cn(
            'group h-full border-border/50 hover:border-primary/50',
            'transition-all duration-300 hover:shadow-lg cursor-pointer'
          )}
        >
          <CardContent className="p-6">
            {/* Icon */}
            <div
              className={cn(
                'w-12 h-12 rounded-xl flex items-center justify-center mb-4',
                'transition-colors duration-300',
                colors.bg,
                colors.hover
              )}
            >
              <DynamicIcon
                name={item.icon}
                className={cn('h-6 w-6', colors.text)}
              />
            </div>

            {/* Title */}
            <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
              {item.name}
            </h3>

            {/* Description */}
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
              {item.description}
            </p>

            {/* Article Count & Arrow */}
            <div className="flex items-center justify-between">
              {item.articleCount && (
                <span className="text-sm text-muted-foreground">
                  {item.articleCount} artículos
                </span>
              )}
              <ArrowRight
                className={cn(
                  'h-4 w-4 text-muted-foreground',
                  'transition-all duration-300',
                  'group-hover:text-primary group-hover:translate-x-1'
                )}
              />
            </div>
          </CardContent>
        </Card>
      </Link>
    </HoverScale>
  );
}

/**
 * Categories Section Component
 *
 * @param {Object} props
 * @param {import('@/types/landing.types').CategoriesConfig} props.config
 * @param {string} [props.className]
 */
export function Categories({ config, className }) {
  const columns = config.columns || 3;

  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-2 lg:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <section
      id="danza"
      className={cn('py-16 md:py-24 relative overflow-hidden', className)}
    >
      {/* Decorative background orbs */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-accent/5 rounded-full blur-3xl translate-y-1/2" />
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

        {/* Categories Grid */}
        <StaggerContainer
          className={cn('grid grid-cols-1 gap-6', gridCols[columns])}
          staggerDelay={0.08}
        >
          {config.items.map((item) => (
            <StaggerItem key={item.id}>
              <CategoryCard item={item} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

export default Categories;
