import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart, Wind, Unlock, RotateCcw, FastForward } from 'lucide-react';
import { birthdayConfig } from '../config/birthdayConfig';
import type { MemoryItem } from '../config/birthdayConfig';
import { soundEffects } from '../utils/soundEffects';

interface SceneOverlaysProps {
  currentScene: number;
  candlesLit: boolean;
  onBlowCandles: () => void;
  onOpenLetter: () => void;
  onOpenVault: () => void;
  onRestart: () => void;
  memories?: MemoryItem[];
  onSelectMemory?: (m: MemoryItem) => void;
  onEnterGarden?: () => void;
}

// ----------------------------------------------------------------------------
// ENCHANTED INTRO OVERLAY (4-PHASE CINEMATIC SEQUENCE)
// ----------------------------------------------------------------------------
function EnchantedIntroOverlay({ onEnter }: { onEnter?: () => void }) {
  const [phase, setPhase] = useState(1);

  useEffect(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setPhase(4);
      return;
    }

    // Phase 1: 0 - 2.5s (The Magical Arrival)
    // Phase 2: 2.5s - 5.0s (The Garden Awakens)
    // Phase 3: 5.0s - 7.0s (Birthday Reveal)
    // Phase 4: 7.0s+ (Enter the Experience)
    const timer2 = setTimeout(() => setPhase(2), 2500);
    const timer3 = setTimeout(() => setPhase(3), 5000);
    const timer4 = setTimeout(() => setPhase(4), 7000);

    return () => {
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, []);

  const handleSkip = () => {
    soundEffects.playClick();
    setPhase(4);
  };

  const handleEnterClick = () => {
    soundEffects.playClick();
    if (onEnter) onEnter();
  };

  return (
    <div className="relative w-full max-w-2xl flex flex-col items-center text-center">
      {/* Quick Skip Button for Accessibility */}
      {phase < 4 && (
        <div className="absolute -top-3 right-0 sm:right-4 pointer-events-auto z-50">
          <button
            onClick={handleSkip}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 hover:bg-pink-500/30 text-pink-200 text-xs font-medium border border-pink-300/30 backdrop-blur-md transition-all cursor-pointer shadow-md"
            title="Skip to Enter"
          >
            <span>Skip intro</span>
            <FastForward size={13} />
          </button>
        </div>
      )}

      <AnimatePresence mode="wait">
        {/* PHASE 1: THE MAGICAL ARRIVAL */}
        {phase === 1 && (
          <motion.div
            key="intro-phase-1"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center"
          >
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-purple-900/40 text-purple-200 border border-purple-400/30 text-xs font-semibold tracking-widest uppercase mb-4 shadow-lg backdrop-blur-md">
              <Sparkles size={14} className="text-yellow-300 animate-spin" />
              THE MAGICAL ARRIVAL
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif font-light text-pink-100 tracking-wide drop-shadow-[0_0_20px_rgba(244,114,182,0.4)]">
              Entering the Enchanted Garden...
            </h2>
            <p className="mt-3 text-pink-200/80 text-sm sm:text-base font-light max-w-md">
              Tiny golden fireflies awaken in the twilight air ✨
            </p>
          </motion.div>
        )}

        {/* PHASE 2: THE GARDEN AWAKENS */}
        {phase === 2 && (
          <motion.div
            key="intro-phase-2"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center"
          >
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-pink-900/40 text-pink-200 border border-pink-400/40 text-xs font-semibold tracking-widest uppercase mb-4 shadow-lg backdrop-blur-md">
              🌸 THE GARDEN AWAKENS 🌸
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif font-light text-transparent bg-clip-text bg-gradient-to-r from-pink-200 via-purple-100 to-rose-200 drop-shadow-[0_0_25px_rgba(244,114,182,0.6)]">
              Blossoms Glow &amp; Butterflies Dance
            </h2>
            <p className="mt-3 text-pink-200/90 text-sm sm:text-base font-light max-w-md">
              Delicate petals float on a gentle fairy breeze... 🦋
            </p>
          </motion.div>
        )}

        {/* PHASE 3: BIRTHDAY REVEAL */}
        {phase === 3 && (
          <motion.div
            key="intro-phase-3"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center"
          >
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-pink-500/25 text-pink-200 border border-pink-400/40 text-xs font-semibold tracking-widest uppercase mb-3 shadow-md backdrop-blur-md">
              <Sparkles size={14} className="text-yellow-300" />
              A SPECIAL BIRTHDAY SURPRISE
            </span>
            <h1 className="text-4xl sm:text-6xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-200 to-rose-300 drop-shadow-[0_4px_30px_rgba(244,114,182,0.7)]">
              HEY {birthdayConfig.friend.nickname.toUpperCase()} ! 💗
            </h1>
            <p className="mt-3 text-pink-100 text-sm sm:text-lg font-light drop-shadow-md max-w-lg">
              Someone has created a little magical world just for you...
            </p>
          </motion.div>
        )}

        {/* PHASE 4: ENTER THE EXPERIENCE */}
        {phase === 4 && (
          <motion.div
            key="intro-phase-4"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center"
          >
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-pink-500/25 text-pink-200 border border-pink-400/40 text-xs font-bold tracking-widest uppercase mb-3 shadow-md backdrop-blur-md">
              🌸 ENCHANTED FAIRY GARDEN 🌸
            </span>
            <h1 className="text-4xl sm:text-6xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-200 to-rose-300 drop-shadow-[0_4px_30px_rgba(244,114,182,0.8)]">
              HEY {birthdayConfig.friend.nickname.toUpperCase()} ! 💗
            </h1>
            <p className="mt-3 text-pink-100 text-sm sm:text-lg font-light drop-shadow-md max-w-lg">
              Someone has created a little magical world just for you...
            </p>

            {/* Prominent Glowing Button: "Enter the Enchanted Garden ✨" */}
            <div className="mt-6 pointer-events-auto flex flex-col items-center gap-3">
              <button
                onClick={handleEnterClick}
                className="px-8 sm:px-10 py-3.5 sm:py-4 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 active:scale-95 text-white font-serif font-bold text-base sm:text-lg tracking-wide shadow-[0_0_35px_rgba(244,114,182,0.7)] border-2 border-pink-200/50 transition-all hover:scale-105 cursor-pointer flex items-center gap-2.5 animate-pulse"
              >
                <Sparkles size={20} className="text-yellow-200" />
                <span>Enter the Enchanted Garden ✨</span>
              </button>

              <span className="text-xs text-pink-200/70">
                (or click the floating glowing gift in the center)
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ----------------------------------------------------------------------------
// MAIN SCENE OVERLAYS EXPORT
// ----------------------------------------------------------------------------
export function SceneOverlays({
  currentScene,
  candlesLit,
  onBlowCandles,
  onOpenLetter,
  onOpenVault,
  onRestart,
  memories,
  onSelectMemory,
  onEnterGarden,
}: SceneOverlaysProps) {
  return (
    <div className="pointer-events-none fixed inset-0 z-40 flex flex-col justify-between p-4 sm:p-8 select-none">
      {/* Top Center Scene Header */}
      <div className="flex flex-col items-center text-center mt-2 w-full">
        <AnimatePresence mode="wait">
          {/* SCENE 1: CINEMATIC ENCHANTED GARDEN INTRO */}
          {currentScene === 1 && (
            <EnchantedIntroOverlay onEnter={onEnterGarden} />
          )}

          {/* SCENE 2: THE BIRTHDAY WORLD */}
          {currentScene === 2 && (
            <motion.div
              key="scene-2"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="max-w-2xl"
            >
              <span className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-pink-500/25 text-pink-200 border border-pink-300/40 text-xs font-bold tracking-widest uppercase mb-3 shadow-md">
                🎉 CELEBRATING YOU TODAY 🎉
              </span>
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-rose-300 to-yellow-200 drop-shadow-[0_4px_30px_rgba(244,114,182,0.8)] leading-tight">
                HAPPY BIRTHDAY {birthdayConfig.friend.nickname.toUpperCase()} !
              </h1>
              <p className="mt-3 text-purple-100 text-sm sm:text-lg font-light drop-shadow">
                Welcome to your dreamy 3D birthday kingdom in the clouds ☁️✨
              </p>
            </motion.div>
          )}

          {/* SCENE 3: OUR MEMORIES */}
          {currentScene === 3 && (
            <motion.div
              key="scene-3"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-5xl w-full flex flex-col items-center"
            >
              <h2 className="text-3xl sm:text-5xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-200 to-blue-200 drop-shadow-lg">
                OUR BEAUTIFUL MEMORIES 📸
              </h2>
              <p className="mt-2 text-pink-100/90 text-sm sm:text-base font-light">
                Hover to tilt, click any Polaroid to expand into fullscreen view
              </p>

              {/* Responsive Polaroid Gallery Tray */}
              {memories && onSelectMemory && (
                <div className="mt-4 sm:mt-6 w-full pointer-events-auto flex items-center justify-center gap-3 sm:gap-4 overflow-x-auto py-3 px-2 max-w-5xl scrollbar-none">
                  {memories.map((m, idx) => {
                    const rotations = [
                      '-rotate-3 hover:rotate-0',
                      'rotate-2 hover:rotate-0',
                      '-rotate-2 hover:rotate-0',
                      'rotate-3 hover:rotate-0',
                      '-rotate-1 hover:rotate-0',
                      'rotate-2 hover:rotate-0',
                    ];
                    const rotClass = rotations[idx % rotations.length];

                    return (
                      <div
                        key={m.id}
                        onClick={() => {
                          soundEffects.playClick();
                          soundEffects.playSparkle();
                          onSelectMemory(m);
                        }}
                        className={`flex-shrink-0 w-28 sm:w-36 md:w-40 bg-white p-2 sm:p-2.5 rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer border-2 border-pink-100 ${rotClass}`}
                      >
                        <div className="w-full aspect-[4/5] rounded-xl overflow-hidden bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100/70 relative flex items-center justify-center p-1">
                          <img
                            src={m.image}
                            alt={m.title}
                            className="gallery-image"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="%23fbcfe8"/><text x="100" y="105" text-anchor="middle" font-size="28">💖</text></svg>';
                            }}
                          />
                        </div>

                        {/* Title and Date */}
                        <div className="mt-1.5 text-center px-0.5">
                          <p className="text-[11px] sm:text-xs font-bold text-purple-950 truncate">
                            {m.title}
                          </p>
                          <p className="text-[9px] sm:text-[10px] text-pink-500 font-semibold truncate">
                            {m.date}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}

          {/* SCENE 4: THE MAGICAL LETTER */}
          {currentScene === 4 && (
            <motion.div
              key="scene-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-xl"
            >
              <h2 className="text-3xl sm:text-5xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-300 via-pink-200 to-purple-200 drop-shadow-lg">
                A LITTLE LETTER FOR YOU 💌
              </h2>
              <p className="mt-2 text-pink-100/90 text-sm sm:text-base font-light">
                A personal message sealed with love and best-friend sparkles
              </p>
              <div className="mt-4 pointer-events-auto">
                <button
                  onClick={() => {
                    soundEffects.playClick();
                    onOpenLetter();
                  }}
                  className="px-6 py-2.5 rounded-full bg-pink-500/80 hover:bg-pink-500 text-white font-semibold text-sm shadow-lg shadow-pink-500/30 border border-pink-300/40 active:scale-95 transition-all cursor-pointer flex items-center gap-2 mx-auto"
                >
                  <Heart size={16} className="fill-white" />
                  <span>READ LETTER</span>
                </button>
              </div>
            </motion.div>
          )}

          {/* SCENE 5: MAKE A WISH CAKE */}
          {currentScene === 5 && (
            <motion.div
              key="scene-5"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-xl"
            >
              <h2 className="text-3xl sm:text-5xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-yellow-200 to-rose-300 drop-shadow-lg">
                {candlesLit ? birthdayConfig.cake.heading : birthdayConfig.cake.successMessage}
              </h2>
              <p className="mt-2 text-pink-100/90 text-sm sm:text-base font-light">
                {candlesLit ? birthdayConfig.cake.subheading : "All your sweetest wishes are taking flight across the stars!"}
              </p>

              {candlesLit && (
                <div className="mt-4 pointer-events-auto">
                  <button
                    onClick={onBlowCandles}
                    className="px-8 py-3 rounded-full bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 hover:from-yellow-300 hover:to-purple-400 text-white font-bold text-base shadow-xl shadow-pink-500/40 border border-yellow-200 active:scale-95 transition-all cursor-pointer flex items-center gap-2 mx-auto"
                  >
                    <Wind size={20} className="animate-spin" />
                    <span>{birthdayConfig.cake.buttonText}</span>
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {/* SCENE 6: BIRTHDAY COUNTDOWN */}
          {currentScene === 6 && (
            <motion.div
              key="scene-6"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-xl"
            >
              <h2 className="text-3xl sm:text-5xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-200 to-yellow-200 drop-shadow-lg">
                COUNTING DOWN TO YOUR SPECIAL DAY ⏳
              </h2>
              <p className="mt-2 text-pink-100/90 text-sm sm:text-base font-light">
                Every second brings us closer to celebrating the most wonderful human!
              </p>
            </motion.div>
          )}

          {/* SCENE 7: SECRET TREASURE VAULT */}
          {currentScene === 7 && (
            <motion.div
              key="scene-7"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-xl"
            >
              <h2 className="text-3xl sm:text-5xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-rose-300 to-yellow-300 drop-shadow-lg">
                {birthdayConfig.friend.nickname.toUpperCase()}, THERE'S ONE MORE SURPRISE... 🔐
              </h2>
              <p className="mt-2 text-pink-100/90 text-sm sm:text-base font-light">
                A secret locked away just between us best friends
              </p>
              <div className="mt-4 pointer-events-auto">
                <button
                  onClick={() => {
                    soundEffects.playClick();
                    onOpenVault();
                  }}
                  className="px-7 py-2.5 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-sm shadow-lg shadow-purple-900/50 border border-pink-300/40 active:scale-95 transition-all cursor-pointer flex items-center gap-2 mx-auto"
                >
                  <Unlock size={16} />
                  <span>OPEN TREASURE VAULT</span>
                </button>
              </div>
            </motion.div>
          )}

          {/* SCENE 8: THE GRAND FINALE */}
          {currentScene === 8 && (
            <motion.div
              key="scene-8"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="max-w-3xl"
            >
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-rose-300 to-yellow-200 drop-shadow-[0_4px_30px_rgba(244,114,182,0.8)]">
                {birthdayConfig.finale.heading}
              </h1>
              <p className="mt-3 text-lg sm:text-2xl font-serif italic text-pink-200 drop-shadow">
                "{birthdayConfig.finale.subheading}"
              </p>
              <h2 className="mt-4 text-2xl sm:text-4xl font-bold text-yellow-300 drop-shadow-lg">
                {birthdayConfig.finale.finalWish}
              </h2>

              <div className="mt-6 pointer-events-auto flex items-center justify-center gap-3">
                <button
                  onClick={onRestart}
                  className="px-8 py-3 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 hover:scale-105 active:scale-95 text-white font-bold text-base shadow-xl shadow-pink-500/40 border border-pink-200 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <RotateCcw size={18} />
                  <span>EXPERIENCE AGAIN 💖</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
