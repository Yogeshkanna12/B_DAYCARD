import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { soundEffects } from '../utils/soundEffects';

interface Envelope3DProps {
  isOpen: boolean;
  onOpen: () => void;
}

export function Envelope3D({ isOpen, onOpen }: Envelope3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const flapRef = useRef<THREE.Group>(null);
  const letterRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;

    // Gentle float & slight rotation
    groupRef.current.position.y = Math.sin(t * 1.4) * 0.12;
    groupRef.current.rotation.y = Math.sin(t * 0.8) * 0.15;
    groupRef.current.rotation.z = Math.cos(t * 0.6) * 0.05;

    // Hover scale
    const targetScale = hovered ? 1.08 : 1.0;
    groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 6);

    // Flap opening rotation (swings upward around top edge)
    if (flapRef.current) {
      const targetFlapAngle = isOpen ? -Math.PI * 0.85 : 0;
      flapRef.current.rotation.x = THREE.MathUtils.lerp(flapRef.current.rotation.x, targetFlapAngle, delta * 5);
    }

    // Letter sliding upward out of the envelope pocket
    if (letterRef.current) {
      const targetLetterY = isOpen ? 1.2 : 0;
      const targetLetterZ = isOpen ? 0.2 : 0;
      letterRef.current.position.y = THREE.MathUtils.lerp(letterRef.current.position.y, targetLetterY, delta * 4);
      letterRef.current.position.z = THREE.MathUtils.lerp(letterRef.current.position.z, targetLetterZ, delta * 4);
    }
  });

  const handleClick = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    if (!isOpen) {
      soundEffects.playEnvelopeOpen();
      onOpen();
    }
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
      {/* Envelope Back Body */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[2.8, 1.8, 0.08]} />
        <meshStandardMaterial
          color="#fdf2f8"
          roughness={0.3}
          metalness={0.1}
          emissive="#f472b6"
          emissiveIntensity={hovered ? 0.2 : 0.05}
        />
      </mesh>

      {/* Envelope Pocket Front Plate */}
      <mesh position={[0, -0.15, 0.05]}>
        <boxGeometry args={[2.76, 1.45, 0.03]} />
        <meshStandardMaterial color="#fce7f3" roughness={0.35} />
      </mesh>

      {/* Parchment Letter Paper Inside */}
      <mesh ref={letterRef} position={[0, 0, 0.02]}>
        <boxGeometry args={[2.4, 1.6, 0.02]} />
        <meshStandardMaterial
          color="#fffbeb"
          roughness={0.4}
          emissive="#fef08a"
          emissiveIntensity={0.1}
        />
      </mesh>

      {/* Top Folding Triangular Flap */}
      <group ref={flapRef} position={[0, 0.9, 0.045]}>
        <mesh position={[0, -0.45, 0]} rotation={[0, 0, Math.PI]}>
          <coneGeometry args={[1.4, 0.9, 3]} />
          <meshStandardMaterial color="#fbcfe8" roughness={0.35} side={THREE.DoubleSide} />
        </mesh>

        {/* Glowing Heart Wax Seal on the tip */}
        {!isOpen && (
          <group position={[0, -0.65, 0.04]}>
            {/* Heart Seal Base */}
            <mesh>
              <cylinderGeometry args={[0.22, 0.22, 0.04, 16]} />
              <meshStandardMaterial
                color="#e11d48"
                metalness={0.3}
                roughness={0.3}
                emissive="#be123c"
                emissiveIntensity={0.4}
              />
            </mesh>
            {/* Mini Heart Symbol */}
            <mesh position={[0, 0.02, 0]} scale={0.12}>
              <sphereGeometry args={[0.5, 8, 8]} />
              <meshStandardMaterial
                color="#fda4af"
                emissive="#f43f5e"
                emissiveIntensity={0.8}
              />
            </mesh>
          </group>
        )}
      </group>
    </group>
  );
}
