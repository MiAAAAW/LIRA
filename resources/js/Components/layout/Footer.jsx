/**
 * @fileoverview Footer Component
 * @description Site footer with columns, social links, and legal info
 */

import { Link } from '@inertiajs/react';
import { Twitter, Facebook, Instagram, Youtube, Linkedin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DynamicIcon } from '@/Components/icons/DynamicIcon';
import { Separator } from '@/Components/ui/separator';

/**
 * Social icon map
 */
const socialIcons = {
  twitter: Twitter,
  facebook: Facebook,
  instagram: Instagram,
  youtube: Youtube,
  linkedin: Linkedin,
};

/**
 * Footer Component
 *
 * @param {Object} props
 * @param {import('@/types/landing.types').FooterConfig} props.config
 * @param {string} [props.className]
 */
export function Footer({ config, className }) {
  return (
    <footer className={cn('bg-section-footer border-t border-border text-white', className)}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Brand Column */}
            <div className="lg:col-span-4">
              {/* Logo */}
              <div className="flex items-center gap-2 mb-4">
                {config.logo?.icon && (
                  <DynamicIcon
                    name={config.logo.icon}
                    className="h-6 w-6 text-primary"
                  />
                )}
                <span className="text-xl font-bold text-gradient-pandilla">
                  {config.logo?.text}
                </span>
              </div>

              {/* Description */}
              {config.description && (
                <p className="text-muted-foreground text-sm leading-relaxed mb-6 max-w-xs">
                  {config.description}
                </p>
              )}

              {/* Social Links */}
              {config.social && (
                <div className="flex items-center gap-3">
                  {Object.entries(config.social).map(([platform, url]) => {
                    if (!url) return null;
                    const Icon = socialIcons[platform];
                    if (!Icon) return null;

                    return (
                      <a
                        key={platform}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                          'p-2 rounded-full bg-muted hover:bg-primary/10',
                          'text-muted-foreground hover:text-primary',
                          'transition-colors duration-200'
                        )}
                        aria-label={`Síguenos en ${platform}`}
                      >
                        <Icon className="h-4 w-4" />
                      </a>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Link Columns */}
            <div className="lg:col-span-8">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
                {config.columns.map((column) => (
                  <div key={column.title}>
                    <h3 className="font-semibold text-foreground mb-4">
                      {column.title}
                    </h3>
                    <ul className="space-y-3">
                      {column.links.map((link) => (
                        <li key={link.text}>
                          {link.href.startsWith('#') ? (
                            <a
                              href={link.href}
                              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                              onClick={(e) => {
                                e.preventDefault();
                                const element = document.querySelector(link.href);
                                if (element) {
                                  element.scrollIntoView({ behavior: 'smooth' });
                                }
                              }}
                            >
                              {link.text}
                            </a>
                          ) : link.external ? (
                            <a
                              href={link.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                            >
                              {link.text}
                            </a>
                          ) : (
                            <Link
                              href={link.href}
                              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                            >
                              {link.text}
                            </Link>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Bottom Bar */}
        <div className="py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <p className="text-sm text-muted-foreground text-center sm:text-left">
              {config.copyright}
            </p>

            {/* Bottom Links */}
            {config.bottomLinks && config.bottomLinks.length > 0 && (
              <div className="flex items-center gap-4">
                {config.bottomLinks.map((link, index) => (
                  <span key={link.text} className="flex items-center gap-4">
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {link.text}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {link.text}
                      </Link>
                    )}
                    {index < config.bottomLinks.length - 1 && (
                      <span className="text-muted-foreground/30">|</span>
                    )}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
