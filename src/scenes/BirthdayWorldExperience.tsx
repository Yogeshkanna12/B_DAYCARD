import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { CameraRig } from '../three/CameraRig';
import { FloatingIsland } from '../three/FloatingIsland';
import { EnchantedGarden3D } from '../three/EnchantedGarden3D';
import { FallingPetals } from '../three/FallingPetals';
import { Fireflies3D } from '../three/Fireflies3D';
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
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-gradient-to-b from-[#150724] via-[#2a0e44] to-[#120224]">
      <Canvas
        camera={{ position: [0, 1.8, 5], fov: 50 }}
        shadows
        dpr={[1, 2]} // Optimised for high DPI and mobile
        gl={{ antialias: true, alpha: false }}
      >
        <color attach="background" args={['#170729']} />
        <fog attach="fog" args={['#200b38', 7, 26]} />

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

        {/* Ambient & Directional Fairy Lighting */}
        <ambientLight color="#fdf2f8" intensity={1.1} />
        <directionalLight
          position={[5, 12, 5]}
          color="#fce7f3"
          intensity={1.7}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <pointLight position={[-6, 4, -4]} color="#c084fc" intensity={1.2} />
        <pointLight position={[6, 2, 4]} color="#f472b6" intensity={1.4} />
        <pointLight position={[0, -1.8, 1.8]} color="#fde047" intensity={0.7} />

        <Suspense fallback={null}>
          {/* Universal Enchanted Fairy World Environment */}
          <FloatingIsland position={[0, -2.0, 0]} scale={1.1} />
          <EnchantedGarden3D />
          <FloatingClouds />
          <Butterflies3D />
          <Fireflies3D count={180} />
          <FallingPetals count={75} />
          <ParticleEffects count={80} areaSize={24} theme="sparkles" />
          <ParticleEffects count={40} areaSize={18} theme="stars" />

          {/* SCENE SPECIFIC 3D HERO OBJECTS */}
          {currentScene === 1 && (
            <group position={[0, 0, 0]}>
              {/* Fairy pedestal glow beneath gift */}
              <mesh position={[0, -0.9, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.8, 1.6, 32]} />
                <meshStandardMaterial
                  color="#f472b6"
                  emissive="#f472b6"
                  emissiveIntensity={0.6}
                  side={2}
                  transparent
                  opacity={0.5}
                />
              </mesh>
              <GiftBox3D onOpen={onOpenGiftBox} isOpen={isGiftBoxOpened} />
            </group>
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
