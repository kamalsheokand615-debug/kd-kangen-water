import { useCallback, useEffect, useRef, useState } from 'react';
import type { TouchEvent as ReactTouchEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { cn } from '../../utils/helpers';

interface LightboxProps {
  isOpen: boolean;
  onClose: () => void;
  items: Array<{
    src: string;
    alt: string;
    type: 'image' | 'pdf';
    title?: string;
    description?: string;
  }>;
  initialIndex?: number;
}

export function Lightbox({ isOpen, onClose, items, initialIndex = 0 }: LightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex, isOpen]);

  const goToPrev = useCallback(() => {
    setCurrentIndex(prev => (prev === 0 ? items.length - 1 : prev - 1));
  }, [items.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex(prev => (prev === items.length - 1 ? 0 : prev + 1));
  }, [items.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') goToPrev();
      if (e.key === 'ArrowRight') goToNext();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, goToNext, goToPrev, onClose]);

  const currentItem = items[currentIndex];

  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = useCallback((e: ReactTouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY, time: Date.now() };
  }, []);

  const handleTouchMove = useCallback((e: ReactTouchEvent<HTMLDivElement>) => {
    if (!touchStartRef.current) return;
    const touch = e.touches[0];
    const dx = touch.clientX - touchStartRef.current.x;
    const dy = touch.clientY - touchStartRef.current.y;
    if (Math.abs(dx) > Math.abs(dy)) {
      e.preventDefault();
    }
  }, []);

  const handleTouchEnd = useCallback((e: ReactTouchEvent<HTMLDivElement>) => {
    if (!touchStartRef.current) return;
    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStartRef.current.x;
    const dy = touch.clientY - touchStartRef.current.y;
    const dt = Date.now() - touchStartRef.current.time;
    const threshold = 50;

    if (dt < 300) {
      if (Math.abs(dx) > threshold && Math.abs(dx) > Math.abs(dy)) {
        if (dx > 0) goToPrev();
        else goToNext();
      } else if (dy > threshold && Math.abs(dy) > Math.abs(dx)) {
        onClose();
      }
    }
    touchStartRef.current = null;
  }, [goToNext, goToPrev, onClose]);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = currentItem.src;
    link.download = currentItem.alt || 'download';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isOpen || items.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center p-4"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-label="Image viewer"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-6xl h-[90vh] flex flex-col"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-center justify-between px-4 py-3 text-white">
            <h3 className="text-lg font-medium truncate max-w-[60%]">
              {currentItem.title || currentItem.alt}
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={handleDownload}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                aria-label="Download"
              >
                <Download className="w-5 h-5" />
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div
            ref={imageRef}
            className="flex-1 flex items-center justify-center overflow-hidden relative"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{ touchAction: 'none' }}
          >
            {items.length > 1 && (
              <>
                <button
                  onClick={goToPrev}
                  className="absolute left-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
                  aria-label="Previous"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={goToNext}
                  className="absolute right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
                  aria-label="Next"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            <AnimatePresence mode="wait">
              {currentItem.type === 'image' ? (
                <motion.img
                  key={currentIndex}
                  src={currentItem.src}
                  alt={currentItem.alt}
                  className="max-w-full max-h-[75vh] object-contain"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                />
              ) : (
                <motion.div
                  key={currentIndex}
                  className="w-full h-[75vh] flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <iframe
                    src={currentItem.src}
                    className="w-full h-full border-0"
                    title={currentItem.alt}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {items.length > 1 && (
            <div className="flex items-center justify-center gap-2 px-4 py-4">
              {items.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={cn(
                    'w-2 h-2 rounded-full transition-all',
                    i === currentIndex ? 'bg-white w-6' : 'bg-white/40 hover:bg-white/60'
                  )}
                  aria-label={`Go to slide ${i + 1}`}
                  aria-current={i === currentIndex ? 'true' : 'false'}
                />
              ))}
            </div>
          )}

          {currentItem.description && (
            <div className="px-4 pb-4 text-white/80 text-center max-w-2xl mx-auto">
              <p className="text-sm">{currentItem.description}</p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}