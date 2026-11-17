import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart, Wind, Unlock, RotateCcw } from 'lucide-react';
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
}

export function SceneOverlays({
  currentScene,
  candlesLit,
  onBlowCandles,
  onOpenLetter,
  onOpenVault,
  onRestart,
  memories,
  onSelectMemory,
}: SceneOverlaysProps) {
  return (
    <div className="pointer-events-none fixed inset-0 z-40 flex flex-col justify-between p-4 sm:p-8 select-none">
      {/* Top Center Scene Header */}
      <div className="flex flex-col items-center text-center mt-2 w-full">
        <AnimatePresence mode="wait">
          {currentScene === 1 && (
            <motion.div
              key="scene-1"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-xl"
            >
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-pink-500/20 text-pink-300 border border-pink-400/30 text-xs font-semibold tracking-widest uppercase mb-3">
                <Sparkles size={14} />
                A SPECIAL SURPRISE
              </span>
              <h1 className="text-4xl sm:text-6xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-200 to-rose-300 drop-shadow-[0_4px_24px_rgba(244,114,182,0.6)]">
                HEY {birthdayConfig.friend.nickname.toUpperCase()} ! 💗
              </h1>
              <p className="mt-3 text-pink-100/90 text-sm sm:text-lg font-light drop-shadow-md">
                Someone has created a little magical world just for you...
              </p>
              <div className="mt-5 pointer-events-auto">
                <span className="inline-block text-xs font-medium text-pink-300/90 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-pink-300/30 animate-pulse">
                  ✨ Click the floating gift box to enter! ✨
                </span>
              </div>
            </motion.div>
          )}

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

              {/* Responsive Polaroid Gallery Tray with Fixed Aspect Ratio & Consistent Sizing */}
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
                        {/* Fixed Aspect Ratio Responsive Container with Soft Pastel Matte */}
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

          {/* Scene 6: Birthday Countdown (Previously Scene 7, Celestial Music Realm removed) */}
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

          {/* Scene 7: Secret Treasure Vault (Previously Scene 8) */}
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

          {/* Scene 8: The Grand Finale (Previously Scene 9) */}
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
