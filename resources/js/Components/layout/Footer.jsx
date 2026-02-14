/**
 * @fileoverview Animated Footer - "Lago Titicaca de Noche"
 * @description Ultra-thin centered footer with floating particles,
 * shimmer background and gold hover effects.
 */

import { useMemo } from 'react';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Facebook, Instagram, Youtube } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MotionWrapper } from '@/Components/motion/MotionWrapper';

const socialIcons = {
  facebook: Facebook,
  instagram: Instagram,
  youtube: Youtube,
};

function FloatingParticles() {
  const particles = useMemo(() => {
    return Array.from({ length: 25 }, (_, i) => {
      const isGold = i % 3 !== 0;
      return {
        key: i,
        left: `${(i * 4.17) % 100}%`,
        width: `${2 + (i % 3)}px`,
        height: `${2 + (i % 3)}px`,
        color: isGold ? 'hsl(45 90% 55%)' : 'hsl(201 60% 55%)',
        animationDuration: `${6 + (i % 9)}s`,
        animationDelay: `${(i * 0.5) % 7}s`,
        bottom: `${(i * 7) % 30}px`,
      };
    });
  }, []);

  return (
    <div className="footer-particles" aria-hidden="true">
      {particles.map((p) => (
        <div
          key={p.key}
          className="footer-particle"
          style={{
            left: p.left,
            width: p.width,
            height: p.height,
            color: p.color,
            backgroundColor: p.color,
            animationDuration: p.animationDuration,
            animationDelay: p.animationDelay,
            bottom: p.bottom,
          }}
        />
      ))}
    </div>
  );
}

/**
 * @param {Object} props
 * @param {import('@/types/landing.types').FooterConfig} props.config
 * @param {string} [props.className]
 */
export function Footer({ config, className }) {
  const handleNavClick = (e, href) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <footer
      className={cn(
        'bg-section-footer footer-shimmer-bg relative',
        className
      )}
    >
      <FloatingParticles />

      <MotionWrapper direction="up" className="relative z-10">
        <div className="container mx-auto px-4 py-6 flex flex-col gap-4">
          {/* Top: Logo left | Nav + Socials centered */}
          <div className="relative flex flex-col items-center gap-4">
            {/* Logo - left on desktop */}
            <motion.span
              className="text-2xl font-bold text-gradient-pandilla footer-logo-pulse sm:absolute sm:left-8 sm:top-1/2 sm:-translate-y-1/2"
              whileHover={{
                scale: 1.05,
                textShadow: '0 0 16px hsl(45 90% 55% / 0.6)',
              }}
              transition={{ duration: 0.3 }}
            >
              {config.logo?.text}
            </motion.span>

            {/* Center stack */}
            <div className="flex flex-col items-center gap-2">
              {/* Nav */}
              {config.nav && config.nav.length > 0 && (
                <nav className="flex items-center gap-5">
                  {config.nav.map((item) =>
                    item.href.startsWith('#') ? (
                      <a
                        key={item.text}
                        href={item.href}
                        onClick={(e) => handleNavClick(e, item.href)}
                        className="footer-link text-xs text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {item.text}
                      </a>
                    ) : (
                      <Link
                        key={item.text}
                        href={item.href}
                        className="footer-link text-xs text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {item.text}
                      </Link>
                    )
                  )}
                </nav>
              )}

              {/* Socials */}
              {config.social && Object.keys(config.social).length > 0 && (
                <div className="flex items-center gap-3">
                  {Object.entries(config.social).map(([platform, url]) => {
                    if (!url) return null;
                    const Icon = socialIcons[platform];
                    if (!Icon) return null;

                    return (
                      <motion.a
                        key={platform}
                        href={url}
                        onClick={(e) => {
                          if (url === '#') e.preventDefault();
                        }}
                        target={url !== '#' ? '_blank' : undefined}
                        rel={url !== '#' ? 'noopener noreferrer' : undefined}
                        className="p-1.5 rounded-full text-muted-foreground transition-colors duration-200"
                        whileHover={{
                          scale: 1.2,
                          boxShadow: '0 0 12px hsl(45 90% 55% / 0.5)',
                          color: 'hsl(45 90% 55%)',
                        }}
                        transition={{ duration: 0.25 }}
                        aria-label={`Siguenos en ${platform}`}
                      >
                        <Icon className="h-3.5 w-3.5" />
                      </motion.a>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Bottom: Copyright + description centered */}
          <div className="text-center text-[11px] text-muted-foreground/50 leading-relaxed">
            <p>{config.copyright} {config.description}</p>
          </div>
        </div>
      </MotionWrapper>
    </footer>
  );
}

export default Footer;
