/**
 * @fileoverview Hero Section Component
 * @description Main hero with gradient background and dynamic module stats
 */

import { motion } from 'framer-motion';
import {
  ArrowRight,
  ChevronDown,
  Scale,
  FileText,
  Shield,
  Flag,
  Users,
  Video,
  Music,
  Award,
  Newspaper,
  Megaphone,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { MotionWrapper } from '@/Components/motion/MotionWrapper';

// Map icon names to components
const iconMap = {
  Scale,
  FileText,
  Shield,
  Flag,
  Users,
  Video,
  Music,
  Award,
  Newspaper,
  Megaphone,
};

/**
 * Dynamic Icon Component
 */
function DynamicIcon({ name, className }) {
  const IconComponent = iconMap[name];
  if (!IconComponent) return null;
  return <IconComponent className={className} />;
}

/**
 * Hero Background - Lago Titicaca Nocturno
 * Estética: Organic/Natural + Mystical
 * Elementos: Cielo nocturno, montañas silueteadas, agua con ondas
 */
function HeroBackground() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      {/* Cielo nocturno - gradiente profundo */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(
            180deg,
            #0a1628 0%,
            #0f2a3d 25%,
            #1a4a6e 50%,
            #2d7eb5 75%,
            #4a9fd4 100%
          )`
        }}
      />

      {/* Estrellas - puntos luminosos */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white animate-pulse"
            style={{
              width: Math.random() * 3 + 1 + 'px',
              height: Math.random() * 3 + 1 + 'px',
              top: Math.random() * 40 + '%',
              left: Math.random() * 100 + '%',
              opacity: Math.random() * 0.7 + 0.3,
              animationDelay: Math.random() * 3 + 's',
              animationDuration: Math.random() * 2 + 2 + 's',
            }}
          />
        ))}
      </div>

      {/* Montañas silueteadas - SVG */}
      <svg
        className="absolute bottom-[35%] left-0 w-full h-auto"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        style={{ filter: 'drop-shadow(0 -10px 30px rgba(0,0,0,0.3))' }}
      >
        <path
          fill="#0f2a3d"
          fillOpacity="0.9"
          d="M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,138.7C672,128,768,160,864,181.3C960,203,1056,213,1152,197.3C1248,181,1344,139,1392,117.3L1440,96L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
        />
      </svg>

      {/* Segunda capa de montañas más cercanas */}
      <svg
        className="absolute bottom-[30%] left-0 w-full h-auto"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
      >
        <path
          fill="#0a1628"
          fillOpacity="0.7"
          d="M0,224L60,213.3C120,203,240,181,360,181.3C480,181,600,203,720,218.7C840,235,960,245,1080,234.7C1200,224,1320,192,1380,176L1440,160L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"
        />
      </svg>

      {/* Reflejo de luz en el agua */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] opacity-30"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(74, 159, 212, 0.6) 0%, transparent 70%)',
        }}
      />

      {/* Ondas del agua - animadas */}
      <div className="absolute bottom-0 left-0 right-0 h-[40%] overflow-hidden">
        {/* Onda 1 */}
        <svg
          className="absolute bottom-[60%] w-[200%] h-24 animate-wave-slow"
          viewBox="0 0 1440 54"
          preserveAspectRatio="none"
        >
          <path
            fill="rgba(45, 126, 181, 0.3)"
            d="M0,22L60,24.7C120,27,240,33,360,36.7C480,41,600,43,720,41C840,38,960,33,1080,30.3C1200,27,1320,27,1380,26.3L1440,25L1440,54L1380,54C1320,54,1200,54,1080,54C960,54,840,54,720,54C600,54,480,54,360,54C240,54,120,54,60,54L0,54Z"
          />
        </svg>

        {/* Onda 2 */}
        <svg
          className="absolute bottom-[40%] w-[200%] h-24 animate-wave-medium"
          viewBox="0 0 1440 54"
          preserveAspectRatio="none"
        >
          <path
            fill="rgba(26, 74, 110, 0.4)"
            d="M0,32L48,29.3C96,27,192,22,288,24.7C384,27,480,38,576,41C672,44,768,41,864,36.7C960,33,1056,27,1152,26.3C1248,25,1344,30,1392,32.7L1440,35L1440,54L1392,54C1344,54,1248,54,1152,54C1056,54,960,54,864,54C768,54,672,54,576,54C480,54,384,54,288,54C192,54,96,54,48,54L0,54Z"
          />
        </svg>

        {/* Onda 3 - más cercana */}
        <svg
          className="absolute bottom-[20%] w-[200%] h-24 animate-wave-fast"
          viewBox="0 0 1440 54"
          preserveAspectRatio="none"
        >
          <path
            fill="rgba(15, 42, 61, 0.5)"
            d="M0,44L40,41C80,38,160,33,240,30.3C320,27,400,27,480,29.3C560,33,640,38,720,38C800,38,880,33,960,30.3C1040,27,1120,27,1200,29.3C1280,33,1360,38,1400,41L1440,44L1440,54L1400,54C1360,54,1280,54,1200,54C1120,54,1040,54,960,54C880,54,800,54,720,54C640,54,560,54,480,54C400,54,320,54,240,54C160,54,80,54,40,54L0,54Z"
          />
        </svg>

        {/* Ripples circulares */}
        <div className="absolute bottom-[15%] left-[20%] w-32 h-8 animate-ripple opacity-20">
          <div className="absolute inset-0 border border-white/30 rounded-full" />
        </div>
        <div className="absolute bottom-[25%] right-[30%] w-24 h-6 animate-ripple-delayed opacity-15">
          <div className="absolute inset-0 border border-white/20 rounded-full" />
        </div>
      </div>

      {/* Gradiente de profundidad del agua en la base */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[20%]"
        style={{
          background: 'linear-gradient(180deg, transparent 0%, rgba(10, 22, 40, 0.8) 100%)'
        }}
      />
    </div>
  );
}

/**
 * Module Card - Shows a module with icon and optional count badge
 */
function ModuleCard({ module, count, delay = 0 }) {
  const hasCount = typeof count === 'number' && count > 0;

  return (
    <motion.a
      href={module.href}
      className={cn(
        "group flex items-center gap-3 p-3 rounded-lg",
        "bg-white/5 backdrop-blur-sm border border-white/10",
        "hover:bg-white/10 hover:border-white/20 transition-all duration-300",
        "text-white/90 hover:text-white"
      )}
      initial={{ opacity: 0, x: module.href.includes('left') ? -20 : 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5 + delay * 0.1, duration: 0.4 }}
    >
      <div className="p-2 rounded-md bg-white/10 group-hover:bg-white/20 transition-colors">
        <DynamicIcon name={module.icon} className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium truncate">{module.label}</div>
        <div className="text-xs text-white/60 truncate">{module.description}</div>
      </div>
      {hasCount && (
        <Badge
          variant="secondary"
          className="bg-white/20 text-white text-xs px-2 py-0.5 hover:bg-white/30"
        >
          {count}
        </Badge>
      )}
    </motion.a>
  );
}

/**
 * Modules Grid - Shows left and right module groups
 */
function ModulesGrid({ modules, dynamicStats }) {
  if (!modules?.left && !modules?.right) return null;

  return (
    <MotionWrapper direction="up" delay={0.5}>
      <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {/* Left Column - Marco Legal e Historia */}
        {modules.left && (
          <div className="space-y-2">
            <div className="text-xs text-white/50 uppercase tracking-wider mb-3 text-center lg:text-left">
              Marco Legal e Historia
            </div>
            <div className="space-y-2">
              {modules.left.map((module, index) => (
                <ModuleCard
                  key={module.id}
                  module={module}
                  count={dynamicStats?.[module.id] || 0}
                  delay={index}
                />
              ))}
            </div>
          </div>
        )}

        {/* Right Column - Multimedia y Comunicación */}
        {modules.right && (
          <div className="space-y-2">
            <div className="text-xs text-white/50 uppercase tracking-wider mb-3 text-center lg:text-left">
              Multimedia y Comunicación
            </div>
            <div className="space-y-2">
              {modules.right.map((module, index) => (
                <ModuleCard
                  key={module.id}
                  module={module}
                  count={dynamicStats?.[module.id] || 0}
                  delay={index}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </MotionWrapper>
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
      {/* Background */}
      <HeroBackground />

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

          {/* Stats Preview */}
          {config.stats && config.stats.length > 0 && (
            <MotionWrapper direction="up" delay={0.4}>
              <div className="mt-12 pt-8 border-t border-white/20">
                <div className={cn(
                  "grid gap-8 max-w-lg mx-auto",
                  config.stats.length === 2 && "grid-cols-2",
                  config.stats.length === 3 && "grid-cols-3",
                  config.stats.length >= 4 && "grid-cols-2 sm:grid-cols-4"
                )}>
                  {config.stats.map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className="text-2xl sm:text-3xl font-bold text-gradient-pandilla drop-shadow-lg">
                        {stat.value}
                      </div>
                      <div className="text-sm text-white/70 mt-1">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </MotionWrapper>
          )}

          {/* Los módulos se muestran como secciones separadas del landing, no aquí */}
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
