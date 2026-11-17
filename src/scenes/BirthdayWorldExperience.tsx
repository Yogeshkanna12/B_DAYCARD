import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { CameraRig } from '../three/CameraRig';
import { FloatingIsland } from '../three/FloatingIsland';
import { FloatingClouds } from '../three/FloatingClouds';
import { Butterflies3D } from '../three/Butterflies3D';
import { ParticleEffects } from '../three/ParticleEffects';
import { GiftBox3D } from '../three/GiftBox3D';
import { BirthdayHero3D } from '../three/BirthdayHero3D';
import { MemoryGallery3D } from '../three/MemoryGallery3D';
import { Envelope3D } from '../three/Envelope3D';
import { BirthdayCake3D } from '../three/BirthdayCake3D';
import { Countdown3D } from '../three/Countdown3D';
import { TreasureBox3D } from '../three/TreasureBox3D';
import { FinalHeart3D } from '../three/FinalHeart3D';
import type { MemoryItem } from '../config/birthdayConfig';

interface BirthdayWorldExperienceProps {
  currentScene: number;
  isGiftBoxOpened: boolean;
  onOpenGiftBox: () => void;
  candlesLit: boolean;
  onBlowCandles: () => void;
  isEnvelopeOpen: boolean;
  onOpenEnvelope: () => void;
  isVaultUnlocked: boolean;
  onOpenVault: () => void;
  memories: MemoryItem[];
  onSelectMemory: (m: MemoryItem) => void;
  selectedMemoryId: number | null;
  friendName: string;
}

export function BirthdayWorldExperience({
  currentScene,
  isGiftBoxOpened,
  onOpenGiftBox,
  candlesLit,
  isEnvelopeOpen,
  onOpenEnvelope,
  isVaultUnlocked,
  onOpenVault,
  memories,
  onSelectMemory,
  selectedMemoryId,
  friendName,
}: BirthdayWorldExperienceProps) {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-gradient-to-b from-[#180928] via-[#2d0f48] to-[#130324]">
      <Canvas
        camera={{ position: [0, 1.8, 5], fov: 50 }}
        shadows
        dpr={[1, 2]} // Optimised for high DPI and mobile
        gl={{ antialias: true, alpha: false }}
      >
        <color attach="background" args={['#1c0a32']} />
        <fog attach="fog" args={['#240b3b', 8, 26]} />

        {/* Cinematic Camera Rig with Parallax */}
        <CameraRig
          currentScene={currentScene}
          zoomed={
            (currentScene === 1 && isGiftBoxOpened) ||
            (currentScene === 4 && isEnvelopeOpen) ||
            (currentScene === 5 && !candlesLit) ||
            (currentScene === 7 && isVaultUnlocked)
          }
        />

        {/* Ambient & Directional Lighting */}
        <ambientLight color="#fdf2f8" intensity={1.2} />
        <directionalLight
          position={[6, 12, 6]}
          color="#fce7f3"
          intensity={1.8}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <pointLight position={[-6, 4, -4]} color="#c084fc" intensity={1.2} />
        <pointLight position={[6, 2, 4]} color="#f472b6" intensity={1.4} />
        <pointLight position={[0, -2, 2]} color="#fde047" intensity={0.6} />

        <Suspense fallback={null}>
          {/* Universal Dreamworld Scenery */}
          <FloatingIsland position={[0, -2.0, 0]} scale={1.1} />
          <FloatingClouds />
          <Butterflies3D />
          <ParticleEffects count={140} areaSize={24} theme="sparkles" />
          <ParticleEffects count={60} areaSize={18} theme="stars" />

          {/* SCENE SPECIFIC 3D HERO OBJECTS */}
          {currentScene === 1 && (
            <GiftBox3D onOpen={onOpenGiftBox} isOpen={isGiftBoxOpened} />
          )}

          {currentScene === 2 && (
            <BirthdayHero3D friendName={friendName} />
          )}

          {currentScene === 3 && (
            <MemoryGallery3D
              memories={memories}
              onSelectPhoto={onSelectMemory}
              selectedId={selectedMemoryId}
            />
          )}

          {currentScene === 4 && (
            <Envelope3D isOpen={isEnvelopeOpen} onOpen={onOpenEnvelope} />
          )}

          {currentScene === 5 && (
            <group scale={1.2}>
              <BirthdayCake3D candlesLit={candlesLit} />
            </group>
          )}

          {currentScene === 6 && <Countdown3D />}

          {currentScene === 7 && (
            <TreasureBox3D
              isUnlocked={isVaultUnlocked}
              onBoxClick={onOpenVault}
            />
          )}

          {currentScene === 8 && <FinalHeart3D />}
        </Suspense>
      </Canvas>
    </div>
  );
}
