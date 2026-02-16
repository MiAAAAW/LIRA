/**
 * @fileoverview Hero Section Component
 * @description Main hero with gradient background and dynamic module stats
 */

import { useState, useRef, useEffect } from 'react';
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
 * Video Background Component
 * Falls back to gradient if video fails to load
 */
function VideoBackground({ video, onError }) {
  const [isReady, setIsReady] = useState(false);
  const videoRef = useRef(null);
  const videoSrc = video?.src;

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement || !videoSrc) return;

    setIsReady(false);

    const handleReady = () => setIsReady(true);
    const handleError = () => onError?.();

    videoElement.addEventListener('canplaythrough', handleReady);
    videoElement.addEventListener('loadeddata', handleReady);
    videoElement.addEventListener('error', handleError);

    return () => {
      videoElement.removeEventListener('canplaythrough', handleReady);
      videoElement.removeEventListener('loadeddata', handleReady);
      videoElement.removeEventListener('error', handleError);
    };
  }, [videoSrc, onError]);

  if (!videoSrc) return null;

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden bg-background">
      <video
        ref={videoRef}
        src={videoSrc}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className={cn(
          "absolute inset-0 w-full h-full object-cover object-center",
          "transition-opacity duration-700",
          isReady ? "opacity-100" : "opacity-0"
        )}
      />
    </div>
  );
}

/**
 * Hero Background Fallback - Gradiente simple
 * Solo se usa si no hay video o si el video falla
 */
function HeroBackgroundFallback() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      {/* Gradiente oscuro elegante */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(
            135deg,
            #0a0a0a 0%,
            #1a1a2e 50%,
            #16213e 100%
          )`
        }}
      />
    </div>
  );
}

/**
 * Image Background Component
 * Falls back to gradient if image fails to load
 */
function ImageBackground({ image, onError }) {
  const [isLoaded, setIsLoaded] = useState(false);

  if (!image?.src) return null;

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden bg-background">
      <img
        src={image.src}
        alt={image.alt || ''}
        onLoad={() => setIsLoaded(true)}
        onError={() => onError?.()}
        className={cn(
          "absolute inset-0 w-full h-full object-cover object-center",
          "transition-opacity duration-700",
          isLoaded ? "opacity-100" : "opacity-0"
        )}
      />
    </div>
  );
}

/**
 * Hero Background - Wrapper que elige entre video, imagen o fallback
 * Si el media falla al cargar, cae automáticamente al gradiente
 */
function HeroBackground({ video, image }) {
  const [mediaFailed, setMediaFailed] = useState(false);

  // Reset error state si cambia el source
  useEffect(() => {
    setMediaFailed(false);
  }, [video?.src, image?.src]);

  if (mediaFailed) {
    return <HeroBackgroundFallback />;
  }

  if (video?.src) {
    return <VideoBackground video={video} onError={() => setMediaFailed(true)} />;
  }
  if (image?.src) {
    return <ImageBackground image={image} onError={() => setMediaFailed(true)} />;
  }
  return <HeroBackgroundFallback />;
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
    const nextSection = document.querySelector('#contenido');
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
      id="hero"
      className={cn(
        'relative min-h-screen flex items-center justify-center overflow-hidden',
        'pt-20 pb-16',
        className
      )}
    >
      {/* Background - Video, Imagen o Fallback animado */}
      <HeroBackground video={config.video} image={config.image} />

      {/* Overlay para legibilidad del texto */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/15 to-transparent pointer-events-none" />

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
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-4">
              <span className="text-white text-stroke-blue drop-shadow-lg">
                {config.title.main}
              </span>
              {config.title.break ? <br /> : ' '}
              {config.title.highlight && (
                <span className="text-gradient-pandilla">
                  "{config.title.highlight}"
                </span>
              )}
              {config.title.suffix && ` ${config.title.suffix}`}
            </h1>
          </MotionWrapper>

          {/* Subtitle - ALMA MATER */}
          {config.subtitle && (
            <MotionWrapper direction="up" delay={0.15}>
              <p className="text-lg sm:text-2xl tracking-[0.2em] text-white font-semibold mb-4 drop-shadow-lg">
                {config.subtitle}
              </p>
            </MotionWrapper>
          )}

          {/* Years */}
          {config.years && (
            <MotionWrapper direction="up" delay={0.2}>
              <p className="text-xl sm:text-3xl text-white font-bold tracking-widest drop-shadow-lg">
                {config.years}
              </p>
            </MotionWrapper>
          )}

          {/* Description */}
          {config.description && (
            <MotionWrapper direction="up" delay={0.25}>
              <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto mt-6 leading-relaxed drop-shadow-md">
                {config.description}
              </p>
            </MotionWrapper>
          )}

          {/* CTAs */}
          {config.cta?.primary && (
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
          )}

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
