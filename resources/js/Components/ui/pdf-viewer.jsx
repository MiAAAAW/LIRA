/**
 * @fileoverview PDF Viewer Component
 * @description Desktop: iframe (native, fast). Mobile: react-pdf via canvas (compatible).
 * MobilePdfRenderer is lazy-loaded so react-pdf only downloads on mobile.
 */

import React, { lazy, Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const MobilePdfRenderer = lazy(() => import('@/Components/ui/mobile-pdf-renderer'));

function LoadingSpinner() {
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/90">
      <Loader2 className="h-8 w-8 text-primary animate-spin" />
    </div>
  );
}

/**
 * @param {Object} props
 * @param {string} props.url - PDF URL (without hash params)
 * @param {string} [props.title] - Accessible title for iframe
 * @param {string} [props.className] - Container class (should include height)
 * @param {boolean} [props.toolbar=true] - Show PDF toolbar (desktop only)
 * @param {function} [props.onLoad] - Callback when PDF loads (desktop only)
 * @param {string|number} [props.iframeKey] - Key for iframe remounting
 */
export function PdfViewer({
  url,
  title = 'PDF',
  className = 'w-full h-full',
  toolbar = true,
  onLoad,
  iframeKey,
}) {
  const isMobile = useIsMobile();
  const [isLoading, setIsLoading] = React.useState(true);

  const handleLoad = React.useCallback(() => {
    setIsLoading(false);
    onLoad?.();
  }, [onLoad]);

  // Reset loading when url changes
  React.useEffect(() => {
    setIsLoading(true);
  }, [url, iframeKey]);

  if (!url) return null;

  const toolbarParam = toolbar ? 1 : 0;
  const iframeSrc = `${url}#toolbar=${toolbarParam}&navpanes=0&scrollbar=1&view=FitH`;

  // Mobile: react-pdf canvas renderer
  if (isMobile) {
    return (
      <div className={className}>
        <Suspense fallback={<LoadingSpinner />}>
          <MobilePdfRenderer url={url} title={title} />
        </Suspense>
      </div>
    );
  }

  // Desktop: native iframe
  return (
    <div className={`relative ${className}`}>
      {isLoading && <LoadingSpinner />}
      <iframe
        key={iframeKey}
        src={iframeSrc}
        className="w-full h-full border-0"
        title={`PDF: ${title}`}
        style={{ colorScheme: 'light' }}
        loading="lazy"
        onLoad={handleLoad}
      />
    </div>
  );
}

export default PdfViewer;
