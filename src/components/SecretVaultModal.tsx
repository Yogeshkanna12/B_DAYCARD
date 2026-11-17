import { useState } from 'react';
import { Lock, Unlock, Key, Sparkles, X, Heart } from 'lucide-react';
import { birthdayConfig } from '../config/birthdayConfig';
import { soundEffects } from '../utils/soundEffects';
import { fireBirthdayConfetti } from '../utils/confettiSystem';

interface SecretVaultModalProps {
  isUnlocked: boolean;
  onUnlockSuccess: () => void;
  onClose?: () => void;
}

export function SecretVaultModal({
  isUnlocked,
  onUnlockSuccess,
  onClose,
}: SecretVaultModalProps) {
  const [inputPass, setInputPass] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [showHint, setShowHint] = useState(false);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanInput = inputPass.trim().toUpperCase();
    const targetPass = birthdayConfig.secretBox.password.trim().toUpperCase();

    if (cleanInput === targetPass) {
      setErrorMsg('');
      soundEffects.playTreasureUnlock();
      fireBirthdayConfetti();
      onUnlockSuccess();
    } else {
      soundEffects.playClick();
      setErrorMsg('Oops! That magic code did not match. Try typing 1811! 💫');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-purple-950/75 backdrop-blur-md animate-fadeIn select-none">
      <div className="relative bg-gradient-to-b from-[#240a3d] via-[#2d0f48] to-[#1a052e] text-white rounded-3xl p-5 sm:p-8 md:p-10 max-w-xl w-full shadow-2xl border-2 border-pink-400/40 backdrop-blur-2xl flex flex-col items-center max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        {onClose && (
          <button
            onClick={() => {
              soundEffects.playClick();
              onClose();
            }}
            className="absolute top-4 right-4 p-2 text-pink-300 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
            title="Close Vault"
          >
            <X size={22} />
          </button>
        )}

        {!isUnlocked ? (
          /* Password Input Form */
          <div className="w-full flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500 flex items-center justify-center shadow-lg shadow-pink-500/40 mb-4 animate-bounce">
              <Lock size={30} className="text-white" />
            </div>

            <span className="text-xs font-bold tracking-widest text-pink-300 uppercase flex items-center gap-1.5 mb-1">
              <Sparkles size={14} className="text-yellow-400" />
              TOP SECRET
              <Sparkles size={14} className="text-yellow-400" />
            </span>

            <h3 className="text-2xl sm:text-3xl font-bold font-serif text-pink-100">
              {birthdayConfig.secretBox.title}
            </h3>
            <p className="mt-2 text-pink-200/80 text-sm max-w-sm">
              {birthdayConfig.secretBox.prompt}
            </p>

            <form onSubmit={handleUnlock} className="w-full mt-6 flex flex-col gap-3">
              <div className="relative">
                <input
                  type="text"
                  value={inputPass}
                  onChange={(e) => setInputPass(e.target.value)}
                  placeholder="Enter password (e.g. 1811)..."
                  className="w-full px-5 py-3.5 rounded-2xl bg-white/10 border-2 border-pink-300/40 text-white placeholder-pink-200/50 focus:outline-none focus:border-pink-400 focus:bg-white/20 text-center text-lg font-semibold tracking-wider transition-all"
                  autoFocus
                />
                <Key size={18} className="absolute right-4 top-4 text-pink-300/60" />
              </div>

              {errorMsg && (
                <p className="text-rose-300 text-xs font-medium animate-shake">
                  {errorMsg}
                </p>
              )}

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 active:scale-98 text-white font-bold tracking-wide shadow-lg shadow-pink-500/40 flex items-center justify-center gap-2 transition-all mt-2 cursor-pointer"
              >
                <Unlock size={18} />
                <span>UNLOCK SURPRISE</span>
              </button>
            </form>

            {/* Hint Button */}
            <div className="mt-4 text-xs text-pink-300/80">
              <button
                onClick={() => {
                  soundEffects.playClick();
                  setShowHint(!showHint);
                }}
                className="underline hover:text-white transition-colors cursor-pointer"
              >
                {showHint ? "Hide Hint" : "Need a hint?"}
              </button>
              {showHint && (
                <p className="mt-2 text-yellow-300 font-semibold bg-white/10 px-4 py-1.5 rounded-full border border-yellow-300/30">
                  💡 Hint: Enter your special code: <span className="underline font-bold text-white tracking-widest">{birthdayConfig.secretBox.password}</span>
                </p>
              )}
            </div>
          </div>
        ) : (
          /* Unlocked Secret Message Card */
          <div className="w-full flex flex-col items-center text-center animate-scaleUp">
            {/* Header Badge */}
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-pink-400 to-rose-500 flex items-center justify-center shadow-lg shadow-pink-500/40 mb-3">
              <Heart size={32} className="text-white fill-white animate-pulse" />
            </div>

            <span className="text-xs font-bold tracking-widest text-pink-300 uppercase flex items-center gap-1.5 mb-1">
              <Sparkles size={14} className="text-yellow-400" />
              SECRET TREASURE UNLOCKED
              <Sparkles size={14} className="text-yellow-400" />
            </span>

            <h3 className="text-2xl sm:text-3xl font-bold font-serif text-transparent bg-clip-text bg-gradient-to-r from-pink-200 via-rose-100 to-yellow-200 mt-1">
              {birthdayConfig.secretBox.secretMessage.headline}
            </h3>
            <p className="text-pink-300/90 text-xs sm:text-sm font-medium mt-1">
              {birthdayConfig.secretBox.secretMessage.subheadline}
            </p>

            {/* Letter Content Container */}
            <div className="mt-5 w-full space-y-4 text-pink-50 text-left text-sm sm:text-base leading-relaxed bg-black/30 p-5 sm:p-7 rounded-3xl border border-pink-300/30 backdrop-blur-md shadow-inner">
              {birthdayConfig.secretBox.secretMessage.content.map((para, idx) => (
                <p key={idx} className="font-sans leading-relaxed tracking-wide text-pink-100/95">
                  {para}
                </p>
              ))}
            </div>

            {/* Final Special Birthday Greeting with High Visual Emphasis */}
            <div className="mt-6 w-full py-4 px-4 sm:px-6 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 border-2 border-pink-200/60 shadow-[0_0_35px_rgba(244,114,182,0.6)] text-white font-serif font-black text-lg sm:text-2xl tracking-wider text-center animate-pulse flex items-center justify-center gap-2">
              <Sparkles size={20} className="text-yellow-300 animate-spin flex-shrink-0" />
              <span>{birthdayConfig.secretBox.secretMessage.highlight}</span>
              <Sparkles size={20} className="text-yellow-300 animate-spin flex-shrink-0" />
            </div>

            <button
              onClick={() => {
                soundEffects.playClick();
                if (onClose) onClose();
              }}
              className="mt-6 px-8 py-2.5 rounded-full bg-white/20 hover:bg-white/30 text-white font-semibold text-sm transition-colors border border-white/40 cursor-pointer hover:scale-105 active:scale-95"
            >
              Continue Exploring 🌸
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
