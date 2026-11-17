import { useState, useEffect } from 'react';
import { BirthdayWorldExperience } from './scenes/BirthdayWorldExperience';
import { SceneOverlays } from './components/SceneOverlays';
import { SceneNavigation } from './components/SceneNavigation';
import { AudioControls } from './components/AudioControls';
import { MemoryModal } from './components/MemoryModal';
import { LetterOverlay } from './components/LetterOverlay';
import { SecretVaultModal } from './components/SecretVaultModal';
import { birthdayConfig } from './config/birthdayConfig';
import type { MemoryItem } from './config/birthdayConfig';
import { soundEffects } from './utils/soundEffects';
import { celestialMusic } from './utils/audioPlayer';
import { fireBirthdayConfetti, fireGrandFinaleShower } from './utils/confettiSystem';

const SCENE_TITLES = [
  'Magical Entrance',
  'The Birthday World',
  'Our Memories',
  'The Magical Letter',
  'Make A Wish Cake',
  'Birthday Countdown',
  'Secret Treasure Vault',
  'The Grand Finale',
];

export function App() {
  const [currentScene, setCurrentScene] = useState(1);
  const [isGiftBoxOpened, setIsGiftBoxOpened] = useState(false);
  const [candlesLit, setCandlesLit] = useState(true);
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(false);
  const [isLetterModalOpen, setIsLetterModalOpen] = useState(false);
  const [isVaultUnlocked, setIsVaultUnlocked] = useState(false);
  const [isVaultModalOpen, setIsVaultModalOpen] = useState(false);
  const [selectedMemory, setSelectedMemory] = useState<MemoryItem | null>(null);

  // Keyboard navigation & accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isVaultModalOpen || isLetterModalOpen || selectedMemory) {
        if (e.key === 'Escape') {
          setIsVaultModalOpen(false);
          setIsLetterModalOpen(false);
          setSelectedMemory(null);
        }
        return;
      }

      if (e.key === 'ArrowRight' && currentScene < SCENE_TITLES.length) {
        handleSceneChange(currentScene + 1);
      } else if (e.key === 'ArrowLeft' && currentScene > 1) {
        handleSceneChange(currentScene - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentScene, isVaultModalOpen, isLetterModalOpen, selectedMemory]);

  const handleSceneChange = (sceneNum: number) => {
    setCurrentScene(sceneNum);

    // Trigger scene-specific celebratory effects
    if (sceneNum === 2) {
      setTimeout(() => fireBirthdayConfetti(), 300);
    } else if (sceneNum === 8) {
      setTimeout(() => fireGrandFinaleShower(), 300);
    }
  };

  // Gift box open sequence in Scene 1
  const handleOpenGiftBox = () => {
    setIsGiftBoxOpened(true);
    // Start dreamy background music upon user's first interaction
    if (!celestialMusic.isPlaying()) {
      celestialMusic.play();
    }
    // After cinematic zoom, transition into Scene 2
    setTimeout(() => {
      setCurrentScene(2);
      fireBirthdayConfetti();
    }, 1800);
  };

  // Candle blowing sequence in Scene 5
  const handleBlowCandles = () => {
    setCandlesLit(false);
    soundEffects.playCandleBlow();
    setTimeout(() => {
      fireBirthdayConfetti();
    }, 450);
  };

  // Envelope open in Scene 4
  const handleOpenEnvelope = () => {
    setIsEnvelopeOpen(true);
    setTimeout(() => {
      setIsLetterModalOpen(true);
    }, 800);
  };

  // Vault unlock in Scene 8
  const handleOpenVault = () => {
    setIsVaultModalOpen(true);
  };

  const handleUnlockVaultSuccess = () => {
    setIsVaultUnlocked(true);
    soundEffects.playTreasureUnlock();
    fireBirthdayConfetti();
  };

  // Memory gallery browsing
  const handleSelectMemory = (mem: MemoryItem) => {
    setSelectedMemory(mem);
  };

  const handlePrevMemory = () => {
    if (!selectedMemory) return;
    const currentIdx = birthdayConfig.memories.findIndex((m) => m.id === selectedMemory.id);
    const prevIdx = (currentIdx - 1 + birthdayConfig.memories.length) % birthdayConfig.memories.length;
    setSelectedMemory(birthdayConfig.memories[prevIdx]);
  };

  const handleNextMemory = () => {
    if (!selectedMemory) return;
    const currentIdx = birthdayConfig.memories.findIndex((m) => m.id === selectedMemory.id);
    const nextIdx = (currentIdx + 1) % birthdayConfig.memories.length;
    setSelectedMemory(birthdayConfig.memories[nextIdx]);
  };

  const handleRestart = () => {
    soundEffects.playClick();
    setIsGiftBoxOpened(false);
    setCandlesLit(true);
    setIsEnvelopeOpen(false);
    setIsLetterModalOpen(false);
    setIsVaultUnlocked(false);
    setIsVaultModalOpen(false);
    setSelectedMemory(null);
    setCurrentScene(1);
  };

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#180928]">
      {/* 3D WebGL World */}
      <BirthdayWorldExperience
        currentScene={currentScene}
        isGiftBoxOpened={isGiftBoxOpened}
        onOpenGiftBox={handleOpenGiftBox}
        candlesLit={candlesLit}
        onBlowCandles={handleBlowCandles}
        isEnvelopeOpen={isEnvelopeOpen}
        onOpenEnvelope={handleOpenEnvelope}
        isVaultUnlocked={isVaultUnlocked}
        onOpenVault={handleOpenVault}
        memories={birthdayConfig.memories}
        onSelectMemory={handleSelectMemory}
        selectedMemoryId={selectedMemory ? selectedMemory.id : null}
        friendName={birthdayConfig.friend.name}
      />

      {/* Audio Controls (Top Right) */}
      <AudioControls />

      {/* Dynamic 2D/3D Scene Overlays */}
      <SceneOverlays
        currentScene={currentScene}
        candlesLit={candlesLit}
        onBlowCandles={handleBlowCandles}
        onOpenLetter={() => setIsLetterModalOpen(true)}
        onOpenVault={handleOpenVault}
        onRestart={handleRestart}
        memories={birthdayConfig.memories}
        onSelectMemory={handleSelectMemory}
      />

      {/* Bottom Scene Navigation Bar */}
      <SceneNavigation
        currentScene={currentScene}
        totalScenes={SCENE_TITLES.length}
        onSceneChange={handleSceneChange}
        sceneTitles={SCENE_TITLES}
      />

      {/* Memory Gallery Lightbox Modal */}
      <MemoryModal
        memory={selectedMemory}
        memories={birthdayConfig.memories}
        onClose={() => setSelectedMemory(null)}
        onPrev={handlePrevMemory}
        onNext={handleNextMemory}
        onSelectIndex={(idx) => setSelectedMemory(birthdayConfig.memories[idx])}
      />

      {/* Personal Letter Parchment Overlay */}
      <LetterOverlay
        isOpen={isLetterModalOpen}
        onClose={() => setIsLetterModalOpen(false)}
      />

      {/* Secret Vault Unlock Modal */}
      {isVaultModalOpen && (
        <SecretVaultModal
          isUnlocked={isVaultUnlocked}
          onUnlockSuccess={handleUnlockVaultSuccess}
          onClose={() => setIsVaultModalOpen(false)}
        />
      )}
    </main>
  );
}

export default App;
