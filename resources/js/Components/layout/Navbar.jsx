/**
 * @fileoverview Navbar Component
 * @description Responsive navigation with mobile menu and theme toggle
 */

import { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/Components/ui/button';
import { DynamicIcon } from '@/Components/icons/DynamicIcon';
import { ModeToggle } from '@/Components/ui/mode-toggle';

/**
 * Navbar Component
 *
 * @param {Object} props
 * @param {import('@/types/landing.types').NavigationConfig} props.config
 * @param {string} [props.className]
 */
export function Navbar({ config, className }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Smooth scroll to anchor
  const handleNavClick = (e, href) => {
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
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'glass shadow-lg'
          : 'bg-transparent',
        className
      )}
    >
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link
            href={config.logo.href}
            className="flex items-center gap-2 text-xl font-bold text-foreground hover:text-primary transition-colors"
          >
            {config.logo.image ? (
              <img
                src={config.logo.image}
                alt={config.logo.text}
                className="h-16 w-auto md:h-24 drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]"
              />
            ) : config.logo.icon && (
              <DynamicIcon
                name={config.logo.icon}
                className="h-6 w-6 text-primary"
              />
            )}
            <span className="text-gradient-pandilla">{config.logo.text}</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {config.items.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className={cn(
                  'px-4 py-2 text-sm font-medium transition-colors rounded-md',
                  isScrolled
                    ? 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    : 'text-white/85 hover:text-white hover:bg-white/10'
                )}
                target={item.external ? '_blank' : undefined}
                rel={item.external ? 'noopener noreferrer' : undefined}
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            {/* Theme Toggle */}
            <ModeToggle />

            {/* CTA Button */}
            {config.cta && (
              <Button
                asChild
                variant={config.cta.variant}
                size={config.cta.size}
                className={config.cta.className}
              >
                <a
                  href={config.cta.href}
                  onClick={(e) => handleNavClick(e, config.cta.href)}
                >
                  {config.cta.text}
                </a>
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <ModeToggle />

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={cn("h-9 w-9", !isScrolled && "text-white")}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
              <span className="sr-only">Toggle menu</span>
            </Button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden glass border-t border-border"
          >
            <div className="container mx-auto px-4 py-4 space-y-2">
              {config.items.map((item, index) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={cn(
                    'block px-4 py-3 text-base font-medium text-foreground',
                    'hover:bg-muted/50 rounded-lg transition-colors'
                  )}
                >
                  {item.label}
                </motion.a>
              ))}

              {config.cta && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: config.items.length * 0.05 }}
                  className="pt-2"
                >
                  <Button
                    asChild
                    variant={config.cta.variant}
                    size={config.cta.size}
                    className={cn("w-full", config.cta.className)}
                  >
                    <a
                      href={config.cta.href}
                      onClick={(e) => handleNavClick(e, config.cta.href)}
                    >
                      {config.cta.text}
                    </a>
                  </Button>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Navbar;
