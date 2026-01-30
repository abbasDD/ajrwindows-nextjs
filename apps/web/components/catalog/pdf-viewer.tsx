"use client";

import { useState, useEffect, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Download,
  ZoomIn,
  ZoomOut,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const pdfPath = "/Coverdoors.pdf";

function NavButton({
  onClick,
  disabled,
  icon,
  label,
}: {
  onClick: () => void;
  disabled?: boolean;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClick}
          disabled={disabled}
          className="h-9 w-9 text-zinc-400 hover:text-white hover:bg-white/10 rounded-xl"
        >
          {icon}
        </Button>
      </TooltipTrigger>
      <TooltipContent
        side="bottom"
        className="bg-zinc-800 text-white border-zinc-700"
      >
        <p className="text-[10px] uppercase tracking-widest">{label}</p>
      </TooltipContent>
    </Tooltip>
  );
}

export default function PDFViewer() {
  const [numPages, setNumPages] = useState<number>();
  const [leftPage, setLeftPage] = useState<number>(1);
  const [scale, setScale] = useState<number>(0.6); // Start with a reasonable base
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const viewerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);

      if (!isLoaded) {
        if (width < 640) setScale(0.4);
        else if (width < 1024) setScale(0.6);
        else setScale(0.8);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    const fsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", fsChange);

    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("fullscreenchange", fsChange);
    };
  }, [isLoaded]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setIsLoaded(true);
  };

  const goToNext = () => {
    if (leftPage < (numPages || 0)) {
      setDirection("next");
      setLeftPage((prev) => (isMobile ? prev + 1 : prev + 2));
    }
  };

  const goToPrev = () => {
    if (leftPage > 1) {
      setDirection("prev");
      setLeftPage((prev) => (isMobile ? prev - 1 : prev - 2));
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) viewerRef.current?.requestFullscreen();
    else document.exitFullscreen();
  };

  const rightPage =
    !isMobile && leftPage + 1 <= (numPages || 0) ? leftPage + 1 : null;

  return (
    <TooltipProvider>
      <div
        ref={viewerRef}
        className={`flex flex-col items-center justify-center transition-colors duration-500 overflow-hidden ${
          isFullscreen
            ? "bg-zinc-950 h-screen"
            : "min-h-screen bg-transparent py-12"
        }`}
      >
        {/* Toolbar */}
        <div className="z-50 mb-6 flex items-center max-sm:flex-col gap-2 bg-white/10 backdrop-blur-xl border border-white/20 p-2 rounded-2xl shadow-2xl">
          <div className="flex items-center gap-1 pr-2 sm:border-r border-white/10">
            <NavButton
              onClick={goToPrev}
              disabled={leftPage <= 1}
              icon={<ChevronLeft size={20} />}
              label="Previous"
            />

            <span className="px-3 text-xs font-medium tracking-tighter text-zinc-400 min-w-[100px] text-center">
              {leftPage}
              {rightPage ? `-${rightPage}` : ""} / {numPages}
            </span>

            <NavButton
              onClick={goToNext}
              disabled={leftPage >= (numPages || 0)}
              icon={<ChevronRight size={20} />}
              label="Next"
            />
          </div>

          <div className="flex items-center gap-1 px-1">
            <NavButton
              onClick={() => setScale((s) => Math.max(s - 0.1, 0.2))}
              icon={<ZoomOut size={18} />}
              label="Zoom Out"
            />
            <NavButton
              onClick={() => setScale((s) => Math.min(s + 0.1, 3.0))}
              icon={<ZoomIn size={18} />}
              label="Zoom In"
            />
            <NavButton
              onClick={toggleFullscreen}
              icon={
                isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />
              }
              label="Toggle Fullscreen"
            />
            <NavButton
              onClick={() => window.open(pdfPath)}
              icon={<Download size={18} />}
              label="Download"
            />
          </div>
        </div>

        {/* PDF Area */}
        <div className="relative flex flex-1 items-center justify-center w-full overflow-auto custom-scrollbar">
          {!isLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-zinc-900/5 animate-pulse z-10">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
          )}

          <Document
            file={pdfPath}
            onLoadSuccess={onDocumentLoadSuccess}
            className="flex flex-col items-center"
            loading={null}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={leftPage}
                initial={{ opacity: 0, x: direction === "next" ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction === "next" ? -20 : 20 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="flex gap-2 md:gap-4 shadow-2xl rounded-lg"
              >
                <Page
                  pageNumber={leftPage}
                  scale={scale} // <--- THIS FIXED THE ZOOM
                  renderAnnotationLayer={false}
                  renderTextLayer={false}
                  className="bg-white shadow-lg"
                  loading={null}
                />
                {rightPage && (
                  <Page
                    pageNumber={rightPage}
                    scale={scale} // <--- THIS FIXED THE ZOOM
                    renderAnnotationLayer={false}
                    renderTextLayer={false}
                    className="bg-white border-l border-zinc-200 shadow-lg"
                    loading={null}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </Document>
        </div>
      </div>
    </TooltipProvider>
  );
}
