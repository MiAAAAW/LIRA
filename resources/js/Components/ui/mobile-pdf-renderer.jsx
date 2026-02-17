/**
 * @fileoverview Mobile PDF Renderer
 * @description Renders PDFs using react-pdf (PDF.js) for mobile devices.
 * Loaded via React.lazy() from PdfViewer — only downloaded on mobile.
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { ChevronLeft, ChevronRight, Download, Loader2 } from 'lucide-react';
import { Button } from '@/Components/ui/button';

// PDF.js worker bundled as Vite asset (no external CDN dependency)
import workerSrc from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

export default function MobilePdfRenderer({ url, title }) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [containerWidth, setContainerWidth] = useState(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);

  // Track container width for responsive page sizing
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });

    observer.observe(el);
    setContainerWidth(el.clientWidth);

    return () => observer.disconnect();
  }, []);

  const onDocumentLoadSuccess = useCallback(({ numPages: total }) => {
    setNumPages(total);
    setPageNumber(1);
    setLoading(false);
    setError(false);
  }, []);

  const onDocumentLoadError = useCallback(() => {
    setError(true);
    setLoading(false);
  }, []);

  const goToPrev = useCallback(() => {
    setPageNumber((p) => Math.max(1, p - 1));
  }, []);

  const goToNext = useCallback(() => {
    setPageNumber((p) => Math.min(numPages || 1, p + 1));
  }, [numPages]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 p-6 text-center">
        <p className="text-muted-foreground text-sm">
          No se pudo cargar el PDF
        </p>
        <Button variant="outline" size="sm" asChild>
          <a href={url} download target="_blank" rel="noopener noreferrer">
            <Download className="h-4 w-4 mr-2" />
            Descargar PDF
          </a>
        </Button>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="flex flex-col h-full w-full">
      {/* PDF Canvas */}
      <div className="flex-1 min-h-0 overflow-auto flex justify-center bg-muted/10">
        <Document
          file={url}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          loading={
            <div className="flex items-center justify-center h-full w-full py-20">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
            </div>
          }
        >
          {containerWidth && (
            <Page
              pageNumber={pageNumber}
              width={containerWidth}
              renderTextLayer={false}
              renderAnnotationLayer={false}
              loading={
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="h-6 w-6 text-primary animate-spin" />
                </div>
              }
            />
          )}
        </Document>
      </div>

      {/* Navigation bar */}
      {numPages && numPages > 1 && (
        <div className="flex items-center justify-center gap-3 py-2 px-3 border-t bg-background/95 backdrop-blur-sm shrink-0">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={goToPrev}
            disabled={pageNumber <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground tabular-nums min-w-[60px] text-center">
            {pageNumber} / {numPages}
          </span>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={goToNext}
            disabled={pageNumber >= numPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
