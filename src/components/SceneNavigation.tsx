import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { soundEffects } from '../utils/soundEffects';

interface SceneNavigationProps {
  currentScene: number;
  totalScenes: number;
  onSceneChange: (scene: number) => void;
  sceneTitles: string[];
}

export function SceneNavigation({
  currentScene,
  totalScenes,
  onSceneChange,
  sceneTitles,
}: SceneNavigationProps) {
  const handlePrev = () => {
    if (currentScene > 1) {
      soundEffects.playClick();
      onSceneChange(currentScene - 1);
    }
  };

  const handleNext = () => {
    if (currentScene < totalScenes) {
      soundEffects.playClick();
      onSceneChange(currentScene + 1);
    }
  };

  const handleSelect = (idx: number) => {
    soundEffects.playClick();
    onSceneChange(idx);
  };

  return (
    <div className="fixed bottom-6 inset-x-0 z-50 flex flex-col items-center gap-2 pointer-events-none px-4">
      {/* Current Scene Badge */}
      <div className="pointer-events-auto bg-white/35 backdrop-blur-md border border-white/40 shadow-lg px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide text-purple-950 flex items-center gap-2 select-none">
        <span className="w-2 h-2 rounded-full bg-pink-500 animate-ping inline-block" />
        <span>
          Part {currentScene} of {totalScenes}: {sceneTitles[currentScene - 1]}
        </span>
      </div>

      {/* Floating Control Dock */}
      <div className="pointer-events-auto flex items-center gap-3 bg-white/30 backdrop-blur-lg border border-white/50 shadow-xl px-4 py-2 rounded-2xl transition-all">
        {/* Previous Button */}
        <button
          onClick={handlePrev}
          disabled={currentScene === 1}
          className="p-2 rounded-xl text-purple-900 bg-white/40 hover:bg-white/80 active:scale-90 disabled:opacity-30 disabled:pointer-events-none transition-all"
          title="Previous Scene"
        >
          <ChevronLeft size={18} />
        </button>

        {/* Scene Dots */}
        <div className="flex items-center gap-1.5 px-2">
          {Array.from({ length: totalScenes }).map((_, i) => {
            const sceneNum = i + 1;
            const isActive = currentScene === sceneNum;
            return (
              <button
                key={sceneNum}
                onClick={() => handleSelect(sceneNum)}
                className={`transition-all duration-300 rounded-full ${
                  isActive
                    ? 'w-6 h-2.5 bg-gradient-to-r from-pink-500 to-purple-500 shadow-md scale-110'
                    : 'w-2.5 h-2.5 bg-white/60 hover:bg-white'
                }`}
                title={sceneTitles[i]}
              />
            );
          })}
        </div>

        {/* Next Button */}
        {currentScene < totalScenes ? (
          <button
            onClick={handleNext}
            className="p-2 rounded-xl text-purple-900 bg-white/40 hover:bg-white/80 active:scale-90 transition-all flex items-center gap-1 font-semibold text-xs"
            title="Next Scene"
          >
            <span>Next</span>
            <ChevronRight size={18} />
          </button>
        ) : (
          <button
            onClick={() => handleSelect(1)}
            className="p-2 rounded-xl text-purple-900 bg-pink-200/80 hover:bg-pink-300 active:scale-90 transition-all flex items-center gap-1 font-semibold text-xs"
            title="Replay Experience"
          >
            <RotateCcw size={16} />
            <span>Replay</span>
          </button>
        )}
      </div>
    </div>
  );
}
