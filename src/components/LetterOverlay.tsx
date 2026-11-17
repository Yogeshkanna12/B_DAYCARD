import { X, Heart, Sparkles } from 'lucide-react';
import { birthdayConfig } from '../config/birthdayConfig';
import { soundEffects } from '../utils/soundEffects';

interface LetterOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LetterOverlay({ isOpen, onClose }: LetterOverlayProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/65 backdrop-blur-md animate-fadeIn">
      {/* Parchment Paper Card */}
      <div className="relative bg-gradient-to-b from-[#fffdf7] to-[#fff7ed] text-[#451a03] rounded-3xl p-6 sm:p-10 max-w-xl w-full shadow-2xl border-4 border-[#fed7aa]/50 flex flex-col items-center max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={() => {
            soundEffects.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 text-pink-500 hover:text-pink-700 hover:bg-pink-100 rounded-full transition-colors"
        >
          <X size={22} />
        </button>

        {/* Decorative Top Heart Wax Seal */}
        <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-rose-600 to-pink-500 text-white flex items-center justify-center shadow-lg mb-4 border-2 border-rose-300">
          <Heart size={26} className="fill-white" />
        </div>

        {/* Letter Heading */}
        <span className="text-xs font-bold tracking-widest text-pink-600 uppercase mb-2 flex items-center gap-1.5">
          <Sparkles size={14} />
          {birthdayConfig.letter.title}
          <Sparkles size={14} />
        </span>

        <h2 className="text-3xl font-serif font-bold text-purple-950 mb-6 text-center">
          {birthdayConfig.letter.salutation}
        </h2>

        {/* Letter Body Paragraphs */}
        <div className="space-y-4 text-gray-800 leading-relaxed font-sans text-base sm:text-lg text-left w-full px-2">
          {birthdayConfig.letter.body.map((para, idx) => (
            <p key={idx} className={idx === 0 ? "font-medium text-pink-700 text-xl" : ""}>
              {para}
            </p>
          ))}
        </div>

        {/* Signature */}
        <div className="mt-8 pt-6 border-t border-rose-200/80 w-full text-right">
          <p className="italic text-gray-600 font-serif text-sm">
            {birthdayConfig.letter.closing}
          </p>
          <p className="font-bold text-xl text-purple-950 font-serif mt-1">
            {birthdayConfig.letter.signature}
          </p>
        </div>
      </div>
    </div>
  );
}
