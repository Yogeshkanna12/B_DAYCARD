import { useState, useEffect } from 'react';
import { Volume2, VolumeX, Play, Pause, Music, Sparkles } from 'lucide-react';
import { celestialMusic } from '../utils/audioPlayer';
import { soundEffects } from '../utils/soundEffects';
import { birthdayConfig } from '../config/birthdayConfig';

export function AudioControls() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.7);

  useEffect(() => {
    const unsub = celestialMusic.subscribe((playing) => {
      setIsPlaying(playing);
    });
    return () => {
      unsub();
    };
  }, []);

  const handlePlay = () => {
    soundEffects.playClick();
    celestialMusic.play();
  };

  const handlePause = () => {
    soundEffects.playClick();
    celestialMusic.pause();
  };

  const handleTogglePlay = () => {
    soundEffects.playClick();
    celestialMusic.toggle();
  };

  const handleToggleMute = () => {
    soundEffects.playClick();
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    soundEffects.setMuted(newMuted);
    if (newMuted) {
      celestialMusic.setVolume(0);
    } else {
      celestialMusic.setVolume(volume);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (!isMuted) {
      celestialMusic.setVolume(val);
      soundEffects.setVolume(val);
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col items-end gap-2 max-w-[95vw] sm:max-w-md select-none">
      {/* Cute Floating Glassmorphism Player Card */}
      <div className="relative bg-gradient-to-r from-pink-100/85 via-purple-100/85 to-pink-50/85 backdrop-blur-xl border-2 border-pink-200/80 shadow-[0_8px_32px_rgba(244,114,182,0.25)] rounded-3xl p-3 sm:px-4 sm:py-2.5 transition-all duration-300">
        
        {/* Animated Floating Music Notes when playing */}
        {isPlaying && (
          <div className="absolute -top-3 left-4 flex gap-2 pointer-events-none">
            <span className="text-pink-500 font-bold text-sm animate-bounce" style={{ animationDuration: '1.2s' }}>♪</span>
            <span className="text-purple-500 font-bold text-xs animate-bounce" style={{ animationDuration: '1.6s', animationDelay: '0.2s' }}>♫</span>
            <span className="text-rose-400 font-bold text-sm animate-bounce" style={{ animationDuration: '1.4s', animationDelay: '0.4s' }}>♬</span>
          </div>
        )}

        <div className="flex items-center gap-3">
          {/* Circular Vinyl / CD icon or Play/Pause Button */}
          <button
            onClick={handleTogglePlay}
            className={`flex items-center justify-center w-10 h-10 rounded-full shadow-md text-white transition-all transform active:scale-95 cursor-pointer ${
              isPlaying
                ? 'bg-gradient-to-tr from-pink-500 to-rose-400 shadow-pink-500/40 hover:scale-105'
                : 'bg-gradient-to-tr from-purple-500 to-pink-400 shadow-purple-500/40 hover:scale-105'
            }`}
            title={isPlaying ? "Pause Song" : "Play Birthday Special 🎵"}
          >
            {isPlaying ? (
              <Pause size={18} className="fill-white" />
            ) : (
              <Play size={18} className="ml-0.5 fill-white" />
            )}
          </button>

          {/* Song Info & Equalizer */}
          <div className="flex flex-col text-left pr-1 min-w-[130px] sm:min-w-[160px]">
            <div className="flex items-center gap-1.5">
              <Music size={13} className={`text-pink-600 ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '4s' }} />
              <span className="font-bold text-xs sm:text-sm text-purple-950 truncate max-w-[150px] sm:max-w-[200px]">
                {birthdayConfig.music.title}
              </span>
            </div>

            <div className="flex items-center justify-between mt-0.5">
              {/* Status Badge */}
              <span className="text-[10px] font-semibold flex items-center gap-1 text-purple-800/80">
                <span className={`w-1.5 h-1.5 rounded-full ${isPlaying ? 'bg-emerald-500 animate-ping' : 'bg-gray-400'}`} />
                {isPlaying ? 'Playing 💗' : 'Paused ⏸️'}
              </span>

              {/* Small Animated Music Visualizer */}
              <div className="flex items-end gap-0.5 h-3">
                {[0.4, 0.9, 0.6, 1.0, 0.5].map((h, i) => (
                  <span
                    key={i}
                    className={`w-1 rounded-full bg-gradient-to-t from-pink-500 to-purple-500 transition-all ${
                      isPlaying ? 'animate-pulse' : 'h-1'
                    }`}
                    style={{
                      height: isPlaying ? `${h * 12}px` : '3px',
                      animationDuration: `${0.4 + i * 0.15}s`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Controls Group */}
          <div className="flex items-center gap-1.5 border-l border-pink-200/60 pl-2">
            {/* Dedicated Play / Pause Buttons */}
            {isPlaying ? (
              <button
                onClick={handlePause}
                className="p-1.5 rounded-xl bg-pink-200/70 hover:bg-pink-300 text-purple-900 active:scale-95 transition-all text-xs font-semibold flex items-center gap-1"
                title="Pause"
              >
                <Pause size={14} />
              </button>
            ) : (
              <button
                onClick={handlePlay}
                className="p-1.5 rounded-xl bg-purple-200/70 hover:bg-purple-300 text-purple-900 active:scale-95 transition-all text-xs font-semibold flex items-center gap-1"
                title="Play"
              >
                <Play size={14} />
              </button>
            )}

            {/* Mute Button */}
            <button
              onClick={handleToggleMute}
              className="p-1.5 text-purple-800 hover:text-pink-600 transition-colors rounded-xl hover:bg-white/50"
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>

            {/* Sparkle Chime Sound FX */}
            <button
              onClick={() => soundEffects.playSparkle()}
              className="p-1.5 text-pink-500 hover:text-pink-600 hover:rotate-12 transition-transform rounded-xl hover:bg-white/50"
              title="Magic Sparkle Chime"
            >
              <Sparkles size={16} />
            </button>
          </div>
        </div>

        {/* Volume Slider Drawer (Always responsive & smooth) */}
        <div className="mt-2 pt-1.5 border-t border-pink-200/50 flex items-center gap-2 px-1">
          <span className="text-[10px] text-purple-700 font-semibold w-8">Vol</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            aria-label="Music volume"
            className="w-full accent-pink-500 cursor-pointer h-1.5 bg-pink-200/80 rounded-lg"
          />
          <span className="text-[10px] text-purple-700 font-bold w-7 text-right">
            {isMuted ? '0%' : `${Math.round(volume * 100)}%`}
          </span>
        </div>
      </div>
    </div>
  );
}
