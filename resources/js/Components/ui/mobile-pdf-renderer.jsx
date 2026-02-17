/**
 * @fileoverview Mobile PDF Renderer
 * @description Renders PDFs using react-pdf (PDF.js) for mobile devices.
 * Loaded via React.lazy() from PdfViewer — only downloaded on mobile.
 *
 * Each page is scaled to FIT within the container (no scroll).
 * Navigate between pages with Anterior/Siguiente buttons.
 */

import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { ChevronLeft, ChevronRight, Download, Loader2 } from 'lucide-react';
import { Button } from '@/Components/ui/button';

// jsdelivr mirrors npm directly — any published version is available
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function MobilePdfRenderer({ url, title }) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [pageRatio, setPageRatio] = useState(null); // width / height of PDF page
  const [error, setError] = useState(false);
  const canvasRef = useRef(null);

  // Measure the available space for the PDF (excludes nav bar)
  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const onDocumentLoadSuccess = useCallback(({ numPages: total }) => {
    setNumPages(total);
    setPageNumber(1);
    setError(false);
    setPageRatio(null); // reset for new document
  }, []);

  const onDocumentLoadError = useCallback(() => {
    setError(true);
  }, []);

  // Capture page aspect ratio once it loads
  const onPageLoadSuccess = useCallback((page) => {
    if (page.originalWidth && page.originalHeight) {
      setPageRatio(page.originalWidth / page.originalHeight);
    }
  }, []);

  const goToPrev = useCallback(() => {
    setPageNumber((p) => Math.max(1, p - 1));
  }, []);

  const goToNext = useCallback(() => {
    setPageNumber((p) => Math.min(numPages || 1, p + 1));
  }, [numPages]);

  // Calculate width so the page fits within BOTH container width and height.
  // Portrait PDFs are constrained by height, landscape by width.
  const fitWidth = useMemo(() => {
    if (!dimensions.width || !dimensions.height) return null;
    if (!pageRatio) return dimensions.width; // first render: use full width
    const widthFromHeight = dimensions.height * pageRatio;
    return Math.floor(Math.min(dimensions.width, widthFromHeight));
  }, [dimensions, pageRatio]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 p-6 text-center">
        <p className="text-muted-foreground text-sm">No se pudo cargar el PDF</p>
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
    <div className="flex flex-col h-full w-full">
      {/* PDF page — fits exactly, no inner scroll */}
      <div
        ref={canvasRef}
        className="flex-1 min-h-0 overflow-hidden flex items-center justify-center bg-muted/10"
      >
        <Document
          file={url}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          loading={
            <div className="flex items-center justify-center h-full w-full">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
            </div>
          }
        >
          {fitWidth && (
            <Page
              pageNumber={pageNumber}
              width={fitWidth}
              devicePixelRatio={Math.min(2, window.devicePixelRatio)}
              renderTextLayer={false}
              renderAnnotationLayer={false}
              onLoadSuccess={onPageLoadSuccess}
              loading={
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="h-6 w-6 text-primary animate-spin" />
                </div>
              }
            />
          )}
        </Document>
      </div>

      {/* Page navigation — always show after document loads */}
      {numPages && (
        <div className="flex items-center justify-center gap-3 py-2 px-3 border-t bg-background/95 backdrop-blur-sm shrink-0">
          {numPages > 1 ? (
            <>
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
            </>
          ) : (
            <span className="text-xs text-muted-foreground">1 página</span>
          )}
        </div>
      )}
    </div>
  );
}
