/**
 * @fileoverview Hero Section Component
 * @description Main hero with Lake Titicaca 3D background
 */

import { lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { MotionWrapper } from '@/Components/motion/MotionWrapper';

// Lazy load del componente 3D para mejor performance
const LakeTiticaca = lazy(() =>
  import('@/Components/3d/LakeTiticaca').then((m) => ({
    default: m.LakeTiticaca,
  }))
);

/**
 * Fallback gradient mientras carga el lago 3D
 */
function LakeFallback() {
  return (
    <div className="absolute inset-0 -z-10">
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, #0a0a1a 0%, #1a1a3e 30%, #0a4f6d 60%, #0077be 100%)',
        }}
      />
      {/* Montañas silueta CSS */}
      <svg
        className="absolute bottom-1/3 left-0 w-full h-1/3 opacity-50"
        viewBox="0 0 100 30"
        preserveAspectRatio="none"
      >
        <path
          d="M0,30 L10,20 L20,25 L35,10 L45,18 L55,8 L65,15 L80,12 L90,22 L100,18 L100,30 Z"
          fill="#0f0f2a"
        />
      </svg>
    </div>
  );
}

/**
 * Hero Section Component
 *
 * @param {Object} props
 * @param {import('@/types/landing.types').HeroConfig} props.config
 * @param {string} [props.className]
 */
export function Hero({ config, className }) {
  // Smooth scroll to next section
  const handleScrollDown = () => {
    const nextSection = document.querySelector('#historia');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Smooth scroll for CTA links
  const handleCTAClick = (e, href) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const element = document.querySelector(href);
      if (element) {
        const navbarHeight = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
      }
    }
  };

  return (
    <section
      className={cn(
        'relative min-h-screen flex items-center justify-center overflow-hidden',
        'pt-20 pb-16',
        className
      )}
    >
      {/* Lago Titicaca 3D Background */}
      <Suspense fallback={<LakeFallback />}>
        <LakeTiticaca />
      </Suspense>

      {/* Overlay para legibilidad del texto */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          {config.badge && (
            <MotionWrapper direction="down" delay={0}>
              <Badge
                variant={config.badge.variant || 'outline'}
                className="mb-6 px-4 py-1.5 text-sm font-medium bg-white/10 backdrop-blur-sm border-white/30 text-white"
              >
                {config.badge.text}
              </Badge>
            </MotionWrapper>
          )}

          {/* Title */}
          <MotionWrapper direction="up" delay={0.1}>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 text-white drop-shadow-lg">
              {config.title.main}{' '}
              {config.title.highlight && (
                <span className="text-gradient-pandilla drop-shadow-lg">
                  {config.title.highlight}
                </span>
              )}
              {config.title.suffix && ` ${config.title.suffix}`}
            </h1>
          </MotionWrapper>

          {/* Description */}
          <MotionWrapper direction="up" delay={0.2}>
            <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto mb-8 leading-relaxed drop-shadow-md">
              {config.description}
            </p>
          </MotionWrapper>

          {/* CTAs */}
          <MotionWrapper direction="up" delay={0.3}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {/* Primary CTA */}
              <Button
                asChild
                size="lg"
                className="gradient-pandilla text-white border-0 hover:opacity-90 px-8 group"
              >
                <a
                  href={config.cta.primary.href}
                  onClick={(e) => handleCTAClick(e, config.cta.primary.href)}
                >
                  {config.cta.primary.text}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
              </Button>

              {/* Secondary CTA */}
              {config.cta.secondary && (
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="px-8"
                >
                  <a
                    href={config.cta.secondary.href}
                    onClick={(e) => handleCTAClick(e, config.cta.secondary.href)}
                  >
                    {config.cta.secondary.text}
                  </a>
                </Button>
              )}
            </div>
          </MotionWrapper>

          {/* Stats Preview - Pandilla Puneña */}
          <MotionWrapper direction="up" delay={0.4}>
            <div className="mt-12 pt-8 border-t border-white/20">
              <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto">
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-gradient-pandilla drop-shadow-lg">
                    1926
                  </div>
                  <div className="text-sm text-white/70 mt-1">
                    Año Fundación
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-gradient-pandilla drop-shadow-lg">
                    98+
                  </div>
                  <div className="text-sm text-white/70 mt-1">
                    Años de Tradición
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-gradient-pandilla drop-shadow-lg">
                    2012
                  </div>
                  <div className="text-sm text-white/70 mt-1">
                    Patrimonio Nacional
                  </div>
                </div>
              </div>
            </div>
          </MotionWrapper>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.button
        onClick={handleScrollDown}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 hover:text-white transition-colors z-10"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        aria-label="Scroll down"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ChevronDown className="h-8 w-8" />
        </motion.div>
      </motion.button>
    </section>
  );
}

export default Hero;
