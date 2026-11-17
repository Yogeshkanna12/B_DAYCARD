import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { soundEffects } from '../utils/soundEffects';
import { fireBirthdayConfetti } from '../utils/confettiSystem';

interface GiftBox3DProps {
  onOpen: () => void;
  isOpen?: boolean;
}

export function GiftBox3D({ onOpen, isOpen = false }: GiftBox3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const lidRef = useRef<THREE.Group>(null);
  const ribbonHRef = useRef<THREE.Mesh>(null);
  const ribbonVRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [opened, setOpened] = useState(isOpen);

  // Floating & hover animation
  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;

    // Gentle float & slow rotation
    if (!opened) {
      groupRef.current.position.y = Math.sin(t * 1.5) * 0.15 + 0.1;
      groupRef.current.rotation.y += delta * 0.4;
      const targetScale = hovered ? 1.08 : 1.0;
      groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 8);
    } else {
      // Opened state: lid ascends and rotates away
      if (lidRef.current) {
        lidRef.current.position.y = THREE.MathUtils.lerp(lidRef.current.position.y, 2.5, delta * 3.5);
        lidRef.current.position.z = THREE.MathUtils.lerp(lidRef.current.position.z, -1.2, delta * 3.0);
        lidRef.current.rotation.x = THREE.MathUtils.lerp(lidRef.current.rotation.x, -0.9, delta * 4);
        lidRef.current.rotation.y += delta * 1.5;
      }
      // Untie / scale down ribbons
      if (ribbonHRef.current) {
        ribbonHRef.current.scale.lerp(new THREE.Vector3(0.01, 0.01, 0.01), delta * 4);
      }
      if (ribbonVRef.current) {
        ribbonVRef.current.scale.lerp(new THREE.Vector3(0.01, 0.01, 0.01), delta * 4);
      }
    }
  });

  const handleClick = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    if (opened) return;
    setOpened(true);
    soundEffects.playBoxOpen();
    fireBirthdayConfetti({ x: 0.5, y: 0.5 });
    onOpen();
  };

  return (
    <group
      ref={groupRef}
      position={[0, 0, 0]}
      onClick={handleClick}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
        soundEffects.playSparkle();
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = 'auto';
      }}
    >
      {/* Box Base (Pink/Lavender Pastel) */}
      <mesh position={[0, -0.4, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.6, 1.2, 1.6]} />
        <meshStandardMaterial
          color="#f472b6"
          roughness={0.25}
          metalness={0.3}
          emissive="#db2777"
          emissiveIntensity={hovered ? 0.25 : 0.08}
        />
      </mesh>

      {/* Inside magical glow (visible when open) */}
      <mesh position={[0, -0.1, 0]}>
        <sphereGeometry args={[0.7, 16, 16]} />
        <meshBasicMaterial
          color="#fde047"
          transparent
          opacity={opened ? 0.95 : 0.2}
        />
      </mesh>

      {/* Vertical Ribbon on Base */}
      <mesh ref={ribbonVRef} position={[0, -0.4, 0]}>
        <boxGeometry args={[1.62, 1.21, 0.26]} />
        <meshStandardMaterial
          color="#fde047"
          metalness={0.8}
          roughness={0.2}
          emissive="#eab308"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Horizontal Ribbon on Base */}
      <mesh ref={ribbonHRef} position={[0, -0.4, 0]}>
        <boxGeometry args={[0.26, 1.21, 1.62]} />
        <meshStandardMaterial
          color="#fde047"
          metalness={0.8}
          roughness={0.2}
          emissive="#eab308"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Box Lid & Top Bow Group */}
      <group ref={lidRef} position={[0, 0.25, 0]}>
        {/* Lid Top */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.72, 0.3, 1.72]} />
          <meshStandardMaterial
            color="#ec4899"
            roughness={0.2}
            metalness={0.35}
            emissive="#be185d"
            emissiveIntensity={0.15}
          />
        </mesh>

        {/* Lid Cross Ribbons */}
        <mesh position={[0, 0.01, 0]}>
          <boxGeometry args={[1.74, 0.32, 0.26]} />
          <meshStandardMaterial
            color="#fde047"
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
        <mesh position={[0, 0.01, 0]}>
          <boxGeometry args={[0.26, 0.32, 1.74]} />
          <meshStandardMaterial
            color="#fde047"
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>

        {/* Ribbon Bow on Lid Top */}
        <group position={[0, 0.22, 0]}>
          {/* Bow Knot */}
          <mesh>
            <sphereGeometry args={[0.18, 16, 16]} />
            <meshStandardMaterial
              color="#fef08a"
              metalness={0.85}
              roughness={0.15}
            />
          </mesh>

          {/* Left Ribbon Loop */}
          <mesh position={[-0.28, 0.12, 0]} rotation={[0, 0, Math.PI / 4]}>
            <torusGeometry args={[0.22, 0.07, 12, 24]} />
            <meshStandardMaterial
              color="#fde047"
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>

          {/* Right Ribbon Loop */}
          <mesh position={[0.28, 0.12, 0]} rotation={[0, 0, -Math.PI / 4]}>
            <torusGeometry args={[0.22, 0.07, 12, 24]} />
            <meshStandardMaterial
              color="#fde047"
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>
        </group>
      </group>

      {/* Soft Ground Aura / Shadow ring */}
      <mesh position={[0, -1.3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.4, 1.8, 32]} />
        <meshBasicMaterial
          color="#f472b6"
          transparent
          opacity={hovered ? 0.45 : 0.25}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}
