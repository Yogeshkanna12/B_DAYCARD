import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { soundEffects } from '../utils/soundEffects';

interface TreasureBox3DProps {
  isUnlocked: boolean;
  onBoxClick?: () => void;
}

export function TreasureBox3D({ isUnlocked, onBoxClick }: TreasureBox3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const lidRef = useRef<THREE.Group>(null);
  const lightBeamRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;

    // Gentle float
    groupRef.current.position.y = Math.sin(t * 1.3) * 0.12;
    groupRef.current.rotation.y = Math.sin(t * 0.5) * 0.15;

    // Scale on hover
    const targetScale = hovered ? 1.08 : 1.0;
    groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 6);

    // Lid opening rotation
    if (lidRef.current) {
      const targetAngle = isUnlocked ? -Math.PI * 0.65 : 0;
      lidRef.current.rotation.x = THREE.MathUtils.lerp(lidRef.current.rotation.x, targetAngle, delta * 4);
    }

    // Light beam ascending & pulsating when unlocked
    if (lightBeamRef.current && isUnlocked) {
      lightBeamRef.current.scale.y = THREE.MathUtils.lerp(lightBeamRef.current.scale.y, 1, delta * 3);
      const pulse = Math.sin(t * 4) * 0.1 + 0.9;
      lightBeamRef.current.scale.x = pulse;
      lightBeamRef.current.scale.z = pulse;
    }
  });

  return (
    <group
      ref={groupRef}
      position={[0, -0.3, 0]}
      onClick={(e) => {
        e.stopPropagation();
        if (onBoxClick) onBoxClick();
      }}
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
      {/* Chest Lower Body */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.2, 1.1, 1.4]} />
        <meshStandardMaterial
          color="#831843" // royal wine magenta
          roughness={0.35}
          metalness={0.3}
          emissive="#be185d"
          emissiveIntensity={hovered ? 0.3 : 0.1}
        />
      </mesh>

      {/* Gold Trim / Corner Brackets */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2.24, 0.12, 1.44]} />
        <meshStandardMaterial color="#fde047" metalness={0.85} roughness={0.2} />
      </mesh>
      <mesh position={[0, -0.45, 0]}>
        <boxGeometry args={[2.24, 0.12, 1.44]} />
        <meshStandardMaterial color="#fde047" metalness={0.85} roughness={0.2} />
      </mesh>

      {/* Glowing Magical Rune Gem in Front */}
      <mesh position={[0, 0.05, 0.72]} scale={0.22}>
        <octahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          color="#f472b6"
          emissive="#f472b6"
          emissiveIntensity={isUnlocked ? 1.5 : 0.8}
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>

      {/* Chest Lid Group (hinged at back: z = -0.7, y = 0.55) */}
      <group ref={lidRef} position={[0, 0.55, -0.7]}>
        {/* Curved Vault Lid (half cylinder rotated) */}
        <mesh position={[0, 0.3, 0.7]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.7, 0.7, 2.2, 24, 1, false, 0, Math.PI]} />
          <meshStandardMaterial
            color="#9d174d"
            roughness={0.35}
            metalness={0.3}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Gold Lid Arch Trim */}
        <mesh position={[0, 0.31, 0.7]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.72, 0.72, 0.18, 24, 1, false, 0, Math.PI]} />
          <meshStandardMaterial color="#fde047" metalness={0.85} roughness={0.2} side={THREE.DoubleSide} />
        </mesh>

        {/* Front Keyhole Latch */}
        <mesh position={[0, 0.1, 1.42]}>
          <boxGeometry args={[0.28, 0.35, 0.08]} />
          <meshStandardMaterial color="#fde047" metalness={0.9} roughness={0.15} />
        </mesh>
      </group>

      {/* Light Beam from chest interior when unlocked */}
      {isUnlocked && (
        <mesh ref={lightBeamRef} position={[0, 1.8, 0]} scale={[1, 0.01, 1]}>
          <cylinderGeometry args={[0.6, 0.2, 3.5, 16]} />
          <meshBasicMaterial
            color="#fef08a"
            transparent
            opacity={0.4}
            blending={THREE.AdditiveBlending}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* Ground Glow Aura */}
      <mesh position={[0, -0.8, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.6, 2.0, 32]} />
        <meshBasicMaterial
          color="#ec4899"
          transparent
          opacity={isUnlocked ? 0.6 : 0.25}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}
