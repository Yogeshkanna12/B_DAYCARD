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
      setErrorMsg('Oops! That magic spell did not match. Try again or check the hint! 💫');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/70 backdrop-blur-md animate-fadeIn">
      <div className="relative bg-gradient-to-b from-purple-900/90 to-pink-950/90 text-white rounded-3xl p-6 sm:p-10 max-w-lg w-full shadow-2xl border border-pink-400/40 backdrop-blur-xl flex flex-col items-center max-h-[90vh] overflow-y-auto">
        {/* Optional Close Button */}
        {onClose && (
          <button
            onClick={() => {
              soundEffects.playClick();
              onClose();
            }}
            className="absolute top-4 right-4 p-2 text-pink-300 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <X size={22} />
          </button>
        )}

        {!isUnlocked ? (
          /* Password Input Form */
          <div className="w-full flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-yellow-400 to-pink-500 flex items-center justify-center shadow-lg shadow-pink-500/30 mb-4 animate-bounce">
              <Lock size={30} className="text-purple-950" />
            </div>

            <h3 className="text-2xl sm:text-3xl font-bold font-serif text-pink-200">
              {birthdayConfig.secretBox.title}
            </h3>
            <p className="mt-2 text-pink-100/80 text-sm max-w-sm">
              {birthdayConfig.secretBox.prompt}
            </p>

            <form onSubmit={handleUnlock} className="w-full mt-6 flex flex-col gap-3">
              <div className="relative">
                <input
                  type="text"
                  value={inputPass}
                  onChange={(e) => setInputPass(e.target.value)}
                  placeholder="Enter password (e.g. MENTALLEY)..."
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
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 hover:from-pink-400 hover:to-purple-400 active:scale-98 text-white font-bold tracking-wide shadow-lg shadow-pink-500/40 flex items-center justify-center gap-2 transition-all mt-2 cursor-pointer"
              >
                <Unlock size={18} />
                <span>UNLOCK SURPRISE</span>
              </button>
            </form>

            {/* Playful Demo Hint Button */}
            <div className="mt-4 text-xs text-pink-300/80">
              <button
                onClick={() => {
                  soundEffects.playClick();
                  setShowHint(!showHint);
                }}
                className="underline hover:text-white transition-colors"
              >
                {showHint ? "Hide Hint" : "Need a hint?"}
              </button>
              {showHint && (
                <p className="mt-1 text-yellow-300 font-semibold bg-white/10 px-3 py-1 rounded-full">
                  💡 Hint: Try typing: <span className="underline">{birthdayConfig.secretBox.password}</span>
                </p>
              )}
            </div>
          </div>
        ) : (
          /* Unlocked Secret Message Card */
          <div className="w-full flex flex-col items-center text-center animate-scaleUp">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-green-400 to-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/30 mb-4">
              <Heart size={32} className="text-white fill-white animate-pulse" />
            </div>

            <span className="text-xs font-bold tracking-widest text-pink-300 uppercase flex items-center gap-1.5">
              <Sparkles size={14} className="text-yellow-400" />
              SECRET VAULT UNLOCKED
              <Sparkles size={14} className="text-yellow-400" />
            </span>

            <h3 className="text-2xl sm:text-3xl font-bold font-serif text-white mt-1">
              {birthdayConfig.secretBox.secretMessage.headline}
            </h3>
            <p className="text-pink-200/90 text-sm font-medium mt-1">
              {birthdayConfig.secretBox.secretMessage.subheadline}
            </p>

            <div className="mt-6 space-y-3.5 text-pink-50 text-left text-sm sm:text-base leading-relaxed bg-white/10 p-5 rounded-2xl border border-white/20">
              {birthdayConfig.secretBox.secretMessage.content.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>

            <div className="mt-5 p-4 rounded-2xl bg-gradient-to-r from-pink-500/30 to-purple-500/30 border border-pink-300/40 text-pink-100 font-serif italic text-sm">
              "{birthdayConfig.secretBox.secretMessage.highlight}"
            </div>

            <button
              onClick={() => {
                soundEffects.playClick();
                if (onClose) onClose();
              }}
              className="mt-6 px-8 py-2.5 rounded-full bg-white/20 hover:bg-white/30 text-white font-semibold text-sm transition-colors border border-white/40 cursor-pointer"
            >
              Continue Exploring 🌸
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
