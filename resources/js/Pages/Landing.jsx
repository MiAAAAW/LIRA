/**
 * @fileoverview Landing Page
 * @description Main landing page that assembles all sections
 */

import { Head } from '@inertiajs/react';

// Config
import { landingConfig } from '@/config/landing.config';

// Layout Components
import { Navbar } from '@/Components/layout/Navbar';
import { Footer } from '@/Components/layout/Footer';

// Section Components
import { Hero } from '@/Components/sections/Hero';
import { FeaturedNews } from '@/Components/sections/FeaturedNews';
import { Categories } from '@/Components/sections/Categories';
import { Team } from '@/Components/sections/Team';
import { Newsletter } from '@/Components/sections/Newsletter';

/**
 * Canvas Orbs - Manchas de color flotantes para el lienzo continuo
 */
function CanvasOrbs() {
  return (
    <div className="canvas-orbs" aria-hidden="true">
      {/* Violeta - Top izquierda */}
      <div
        className="canvas-orb"
        style={{
          background: 'hsl(280 70% 60%)',
          width: '500px',
          height: '500px',
          top: '5%',
          left: '-10%',
        }}
      />
      {/* Celeste - Derecha */}
      <div
        className="canvas-orb"
        style={{
          background: 'hsl(195 85% 55%)',
          width: '400px',
          height: '400px',
          top: '25%',
          right: '-5%',
          animationDelay: '-5s',
        }}
      />
      {/* Azul - Centro izquierda */}
      <div
        className="canvas-orb"
        style={{
          background: 'hsl(220 80% 58%)',
          width: '350px',
          height: '350px',
          top: '45%',
          left: '5%',
          animationDelay: '-10s',
        }}
      />
      {/* Morado - Derecha abajo */}
      <div
        className="canvas-orb"
        style={{
          background: 'hsl(260 65% 55%)',
          width: '450px',
          height: '450px',
          top: '65%',
          right: '-8%',
          animationDelay: '-15s',
        }}
      />
      {/* Índigo - Abajo izquierda */}
      <div
        className="canvas-orb"
        style={{
          background: 'hsl(240 60% 55%)',
          width: '300px',
          height: '300px',
          bottom: '5%',
          left: '15%',
          animationDelay: '-7s',
        }}
      />
    </div>
  );
}

/**
 * Landing Page Component
 *
 * @param {Object} props - Props passed from Laravel controller
 */
export default function Landing(props) {
  const config = landingConfig;

  return (
    <>
      {/* SEO Head */}
      <Head title={`${config.site.name} - Portal de Noticias`} />

      {/* Lienzo Continuo - Orbs flotantes */}
      <CanvasOrbs />

      {/* Main Layout */}
      <div className="min-h-screen text-foreground scroll-smooth relative z-10">
        {/* Navigation */}
        <Navbar config={config.navigation} />

        {/* Main Content */}
        <main>
          {/* Hero Section */}
          <Hero config={config.hero} />

          {/* Featured News Section */}
          {config.featuredNews && (
            <FeaturedNews config={config.featuredNews} />
          )}

          {/* Categories Section */}
          <Categories config={config.categories} />

          {/* Team Section */}
          <Team config={config.team} />

          {/* Newsletter Section */}
          <Newsletter config={config.newsletter} />
        </main>

        {/* Footer */}
        <Footer config={config.footer} />
      </div>
    </>
  );
}
