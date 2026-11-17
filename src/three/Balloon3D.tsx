import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface BalloonProps {
  position: [number, number, number];
  color: string;
  scale?: number;
  speed?: number;
  swayAmount?: number;
}

export function Balloon3D({
  position,
  color,
  scale = 1,
  speed = 1.0,
  swayAmount = 0.15,
}: BalloonProps) {
  const groupRef = useRef<THREE.Group>(null);
  const phase = Math.random() * Math.PI * 2;

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime * speed + phase;

    // Natural bobbing up and down
    groupRef.current.position.y = position[1] + Math.sin(t * 1.5) * 0.25;

    // Gentle pendulum sway
    groupRef.current.rotation.z = Math.sin(t) * swayAmount;
    groupRef.current.rotation.x = Math.cos(t * 0.8) * swayAmount * 0.7;
    groupRef.current.rotation.y = Math.sin(t * 0.5) * 0.3;
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Balloon Oval Body (slightly pear-shaped using scale) */}
      <mesh position={[0, 0, 0]} castShadow>
        <sphereGeometry args={[0.75, 24, 24]} />
        <meshPhysicalMaterial
          color={color}
          roughness={0.15}
          metalness={0.2}
          clearcoat={0.9}
          clearcoatRoughness={0.1}
          emissive={color}
          emissiveIntensity={0.12}
        />
      </mesh>

      {/* Balloon Bottom Knot */}
      <mesh position={[0, -0.72, 0]}>
        <coneGeometry args={[0.1, 0.14, 12]} />
        <meshStandardMaterial color={color} roughness={0.3} />
      </mesh>

      {/* Hanging Curved String */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[
              new Float32Array([
                0, -0.76, 0,
                0.05, -1.2, 0.02,
                -0.04, -1.7, -0.02,
                0.06, -2.2, 0.03,
                0, -2.8, 0,
              ]),
              3,
            ]}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#ffffff" opacity={0.65} transparent linewidth={1} />
      </line>
    </group>
  );
}

export function BalloonCluster() {
  return (
    <group>
      <Balloon3D position={[-3.2, 2.5, -2]} color="#f472b6" scale={1.1} speed={0.9} />
      <Balloon3D position={[-2.4, 3.4, -2.4]} color="#c084fc" scale={0.95} speed={1.1} />
      <Balloon3D position={[-2.8, 1.8, -1.5]} color="#93c5fd" scale={1.05} speed={0.8} />

      <Balloon3D position={[3.2, 2.7, -1.8]} color="#fed7aa" scale={1.0} speed={1.2} />
      <Balloon3D position={[2.6, 3.6, -2.2]} color="#fbcfe8" scale={1.15} speed={0.85} />
      <Balloon3D position={[3.6, 2.0, -1.2]} color="#fde047" scale={0.9} speed={1.0} />
    </group>
  );
}
