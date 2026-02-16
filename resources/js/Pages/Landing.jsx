/**
 * @fileoverview Landing Page
 * @description Main landing page with 2-column layout
 * All content comes from database via LandingController
 */

import { Head } from '@inertiajs/react';

// Config
import { landingConfig } from '@/config/landing.config';

// Layout Components
import { Navbar } from '@/Components/layout/Navbar';
import { Footer } from '@/Components/layout/Footer';

// Section Components
import { Hero } from '@/Components/sections/Hero';
import { ContentColumns } from '@/Components/sections/ContentColumns';
import { BackgroundMusicPlayer } from '@/Components/sections/BackgroundMusicPlayer';

// Context
import { MediaProvider } from '@/contexts/MediaContext';

// CanvasOrbs removido - ahora el Hero usa video de fondo desde CDN

/**
 * Landing Page Component
 *
 * Receives dynamic data from LandingController and merges with static config.
 * Falls back to static config if database is empty.
 *
 * @param {Object} props - Props passed from Laravel controller
 */
export default function Landing({
  // CDN URL para assets
  cdnUrl = '',
  // Hero dinámico desde BD
  heroData = null,
  // Marco Legal
  ley24325 = [],
  baseLegal = [],
  indecopi = [],
  // Historia
  estandartes = [],
  presidentes = [],
  // Multimedia
  videos = [],
  audios = [],
  // Comunicaciones
  publicaciones = [],
  comunicados = [],
  distinciones = [],
  // Anuncio
  comunicadoDestacado = null,
  // Música de fondo
  musicConfig = null,
}) {
  // Config para UI strings y secciones fijas
  const config = landingConfig;

  // Hero: usar heroData de BD si existe, fallback a config estático + CDN
  const heroConfig = heroData ?? {
    ...config.hero,
    video: cdnUrl ? {
      src: `${cdnUrl}/landing/landing.mp4`,
    } : null,
  };

  return (
    <MediaProvider>
      {/* SEO Head */}
      <Head title={`${config.site.name} - Patrimonio Cultural`} />

      {/* Main Layout */}
      <div className="min-h-screen text-foreground scroll-smooth relative z-10">
        {/* Navigation */}
        <Navbar config={config.navigation} />

        {/* Main Content */}
        <main>
          {/* Hero Section - con video de fondo desde CDN */}
          <Hero config={heroConfig} />

          {/* Fog transition — dark blur matching both sections */}
          <div className="relative -mt-12 z-20 h-12 pointer-events-none">
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-10 bg-black/40 blur-[40px]" />
          </div>

          {/* 2-Column Layout: All 10 modules — con background image del CDN */}
          <div
            className="relative bg-cover bg-center bg-fixed"
            style={cdnUrl ? { backgroundImage: `url(${cdnUrl}/landing/background.jpeg)` } : undefined}
          >
            <div className="absolute inset-0 bg-background/40" />
            <div className="relative z-30">
              <ContentColumns
                // Institutional Column
                ley24325={ley24325}
                baseLegal={baseLegal}
                indecopi={indecopi}
                estandartes={estandartes}
                presidentes={presidentes}
                // Content Column
                videos={videos}
                audios={audios}
                distinciones={distinciones}
                publicaciones={publicaciones}
                comunicados={comunicados}
                // Anuncio
                comunicadoDestacado={comunicadoDestacado}
                // Config
                config={config}
              />
            </div>
          </div>
        </main>

        {/* Footer */}
        <Footer config={config.footer} />
      </div>

      {/* Background Music Player - floating button */}
      <BackgroundMusicPlayer musicConfig={musicConfig} />
    </MediaProvider>
  );
}
