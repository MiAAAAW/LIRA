/**
 * @fileoverview Newsletter Section Component
 * @description Email subscription form with optional contact form
 */

import { useState } from 'react';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Card, CardContent } from '@/Components/ui/card';
import { MotionWrapper } from '@/Components/motion/MotionWrapper';

/**
 * Newsletter Section Component
 *
 * @param {Object} props
 * @param {import('@/types/landing.types').NewsletterConfig} props.config
 * @param {string} [props.className]
 */
export function Newsletter({ config, className }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !email.includes('@')) {
      setStatus('error');
      setMessage('Por favor, ingresa un email válido');
      return;
    }

    setStatus('loading');

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // In real implementation, you would call your API here
      // await fetch('/api/newsletter', { method: 'POST', body: JSON.stringify({ email }) });

      setStatus('success');
      setMessage(config.successMessage);
      setEmail('');

      // Reset after 5 seconds
      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 5000);
    } catch (error) {
      setStatus('error');
      setMessage('Ocurrió un error. Por favor, intenta de nuevo.');
    }
  };

  return (
    <section
      id="contacto"
      className={cn('py-16 md:py-24 relative overflow-hidden', className)}
    >
      {/* Decorative orbs */}
      <div className="absolute top-1/2 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-x-1/2" />
      <div className="absolute top-1/2 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl translate-x-1/2" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <Card className="border-border/50 overflow-hidden">
            {/* Gradient top border */}
            <div className="h-1 gradient-pandilla" />

            <CardContent className="p-8 md:p-12">
              {/* Section Header */}
              <MotionWrapper direction="up" className="text-center mb-8">
                {config.badge && (
                  <Badge variant="outline" className="mb-4">
                    {config.badge}
                  </Badge>
                )}
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  {config.title}
                </h2>
                {config.subtitle && (
                  <p className="text-muted-foreground text-lg">
                    {config.subtitle}
                  </p>
                )}
              </MotionWrapper>

              {/* Newsletter Form */}
              <MotionWrapper direction="up" delay={0.1}>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={config.placeholder}
                        disabled={status === 'loading' || status === 'success'}
                        className={cn(
                          'w-full h-12 px-4 rounded-lg border border-input',
                          'bg-background text-foreground placeholder:text-muted-foreground',
                          'focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary',
                          'disabled:opacity-50 disabled:cursor-not-allowed',
                          'transition-colors'
                        )}
                      />
                    </div>
                    <Button
                      type="submit"
                      size="lg"
                      disabled={status === 'loading' || status === 'success'}
                      className="gradient-pandilla text-white border-0 hover:opacity-90 h-12 px-8"
                    >
                      {status === 'loading' ? (
                        <span className="flex items-center gap-2">
                          <svg
                            className="animate-spin h-4 w-4"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                          Enviando...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Send className="h-4 w-4" />
                          {config.buttonText}
                        </span>
                      )}
                    </Button>
                  </div>

                  {/* Status Message */}
                  {message && (
                    <div
                      className={cn(
                        'flex items-center gap-2 text-sm p-3 rounded-lg',
                        status === 'success'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : 'bg-destructive/10 text-destructive'
                      )}
                    >
                      {status === 'success' ? (
                        <CheckCircle className="h-4 w-4 flex-shrink-0" />
                      ) : (
                        <AlertCircle className="h-4 w-4 flex-shrink-0" />
                      )}
                      {message}
                    </div>
                  )}
                </form>
              </MotionWrapper>

              {/* Privacy Note */}
              <MotionWrapper direction="up" delay={0.2}>
                <p className="text-center text-xs text-muted-foreground mt-4">
                  Al suscribirte, aceptas nuestra{' '}
                  <a href="/privacidad" className="underline hover:text-foreground">
                    Política de Privacidad
                  </a>
                  . No enviamos spam.
                </p>
              </MotionWrapper>

              {/* Contact Info (if showContactForm) */}
              {config.showContactForm && (
                <MotionWrapper direction="up" delay={0.3}>
                  <div className="mt-8 pt-8 border-t border-border">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                      <div>
                        <p className="font-semibold text-foreground">Email</p>
                        <a
                          href="mailto:contacto@lirapuno.pe"
                          className="text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                          contacto@lirapuno.pe
                        </a>
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">Teléfono</p>
                        <a
                          href="tel:+51951000000"
                          className="text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                          +51 951 000 000
                        </a>
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">Ubicación</p>
                        <p className="text-sm text-muted-foreground">
                          Puno, Perú 🇵🇪
                        </p>
                      </div>
                    </div>
                  </div>
                </MotionWrapper>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

export default Newsletter;
