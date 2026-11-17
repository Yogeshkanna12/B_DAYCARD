import { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import type { MemoryItem } from '../config/birthdayConfig';
import { soundEffects } from '../utils/soundEffects';

interface MemoryModalProps {
  memory: MemoryItem | null;
  memories?: MemoryItem[];
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  onSelectIndex?: (index: number) => void;
}

export function MemoryModal({
  memory,
  memories = [],
  onClose,
  onPrev,
  onNext,
  onSelectIndex,
}: MemoryModalProps) {
  // Prevent background page scrolling while lightbox is open & listen for keyboard keys
  useEffect(() => {
    if (!memory) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        onPrev();
      } else if (e.key === 'ArrowRight') {
        onNext();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [memory, onPrev, onNext, onClose]);

  if (!memory) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-between p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn select-none"
      onClick={onClose}
    >
      {/* Top Header Bar with Clearly Visible Close Button */}
      <div
        className="w-full max-w-6xl flex items-center justify-end px-2 py-1 text-white z-20 pointer-events-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => {
            soundEffects.playClick();
            onClose();
          }}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/20 hover:bg-pink-500 text-white font-semibold text-xs sm:text-sm transition-all border border-white/30 cursor-pointer shadow-lg active:scale-95"
          title="Close Lightbox (Esc)"
        >
          <span>Close</span>
          <X size={18} />
        </button>
      </div>

      {/* Main Image Stage: Centered Fullscreen Lightbox Viewport */}
      <div
        className="relative flex-1 w-full flex items-center justify-center my-auto z-10 pointer-events-auto overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left Navigation Arrow */}
        <button
          onClick={() => {
            soundEffects.playClick();
            onPrev();
          }}
          className="absolute left-2 sm:left-6 z-20 p-2.5 sm:p-3.5 rounded-full bg-white/20 hover:bg-pink-500/90 text-white shadow-xl backdrop-blur-md border border-white/30 transition-all hover:scale-110 active:scale-90 cursor-pointer"
          title="Previous Photo (←)"
        >
          <ChevronLeft size={24} className="sm:w-7 sm:h-7" />
        </button>

        {/* Centered Image Container with Soft Pastel Matte Backdrop */}
        <div className="relative flex items-center justify-center max-w-[90vw] max-h-[85vh] rounded-2xl overflow-hidden bg-pink-950/20 border border-pink-300/30 shadow-[0_0_50px_rgba(244,114,182,0.25)]">
          <img
            src={memory.image}
            alt={memory.title}
            className="lightbox-image"
            style={{
              display: 'block',
              width: '100%',
              height: '100%',
              maxWidth: '90vw',
              maxHeight: '85vh',
              objectFit: 'contain',
              objectPosition: 'center',
              margin: 'auto',
            }}
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23fbcfe8"/><stop offset="50%" stop-color="%23e9d5ff"/><stop offset="100%" stop-color="%23fed7aa"/></linearGradient></defs><rect width="600" height="600" fill="url(%23g)"/><circle cx="300" cy="260" r="120" fill="%23ffffff" opacity="0.6"/><text x="300" y="270" text-anchor="middle" font-size="72">💖</text><text x="300" y="420" text-anchor="middle" font-size="28" font-weight="bold" fill="%23831843" font-family="sans-serif">Sweet Memory</text><text x="300" y="460" text-anchor="middle" font-size="20" fill="%239d174d" font-family="sans-serif">Mentalleyy &amp; Bestie ✨</text></svg>';
            }}
          />
        </div>

        {/* Right Navigation Arrow */}
        <button
          onClick={() => {
            soundEffects.playClick();
            onNext();
          }}
          className="absolute right-2 sm:right-6 z-20 p-2.5 sm:p-3.5 rounded-full bg-white/20 hover:bg-pink-500/90 text-white shadow-xl backdrop-blur-md border border-white/30 transition-all hover:scale-110 active:scale-90 cursor-pointer"
          title="Next Photo (→)"
        >
          <ChevronRight size={24} className="sm:w-7 sm:h-7" />
        </button>
      </div>

      {/* Bottom Navigation Dots (No tagline, caption, or subtitle) */}
      <div
        className="w-full max-w-md flex items-center justify-center py-2 z-20 pointer-events-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {memories.length > 0 && onSelectIndex && (
          <div className="flex items-center gap-2">
            {memories.map((m, idx) => (
              <button
                key={m.id}
                onClick={() => {
                  soundEffects.playClick();
                  onSelectIndex(idx);
                }}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  m.id === memory.id
                    ? 'w-7 h-2 bg-gradient-to-r from-pink-400 to-rose-400 shadow-md scale-105'
                    : 'w-2 h-2 bg-white/40 hover:bg-pink-300'
                }`}
                title={`Photo ${m.id}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
