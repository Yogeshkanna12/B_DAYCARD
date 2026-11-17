import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ButterflyProps {
  initialPos: [number, number, number];
  color: string;
  radius?: number;
  speed?: number;
  flightHeight?: number;
}

function Butterfly({ initialPos, color, radius = 3.5, speed = 1.2, flightHeight = 1 }: ButterflyProps) {
  const groupRef = useRef<THREE.Group>(null);
  const leftWingRef = useRef<THREE.Mesh>(null);
  const rightWingRef = useRef<THREE.Mesh>(null);
  const phase = Math.random() * Math.PI * 2;

  useFrame((state) => {
    const t = state.clock.elapsedTime * speed + phase;
    if (groupRef.current) {
      // Circular / Lissajous flight path
      const x = initialPos[0] + Math.sin(t) * radius;
      const z = initialPos[2] + Math.cos(t * 0.8) * (radius * 0.8);
      const y = initialPos[1] + Math.sin(t * 2) * flightHeight;
      groupRef.current.position.set(x, y, z);

      // Rotate to face movement direction
      const dx = Math.cos(t) * radius;
      const dz = -Math.sin(t * 0.8) * (radius * 0.8) * 0.8;
      groupRef.current.rotation.y = Math.atan2(dx, dz);
      groupRef.current.rotation.x = Math.sin(t * 2) * 0.2;
    }

    // Rapid wing flap
    const flap = Math.sin(state.clock.elapsedTime * 18 + phase) * 0.7;
    if (leftWingRef.current) {
      leftWingRef.current.rotation.z = flap;
    }
    if (rightWingRef.current) {
      rightWingRef.current.rotation.z = -flap;
    }
  });

  return (
    <group ref={groupRef} position={initialPos} scale={0.25}>
      {/* Butterfly Body */}
      <mesh>
        <cylinderGeometry args={[0.08, 0.05, 0.8, 8]} />
        <meshStandardMaterial color="#4a044e" roughness={0.4} />
      </mesh>

      {/* Left Wing */}
      <mesh ref={leftWingRef} position={[-0.45, 0, 0]}>
        <planeGeometry args={[0.9, 0.8]} />
        <meshStandardMaterial
          color={color}
          side={THREE.DoubleSide}
          transparent
          opacity={0.88}
          roughness={0.2}
          emissive={color}
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Right Wing */}
      <mesh ref={rightWingRef} position={[0.45, 0, 0]}>
        <planeGeometry args={[0.9, 0.8]} />
        <meshStandardMaterial
          color={color}
          side={THREE.DoubleSide}
          transparent
          opacity={0.88}
          roughness={0.2}
          emissive={color}
          emissiveIntensity={0.3}
        />
      </mesh>
    </group>
  );
}

export function Butterflies3D() {
  return (
    <group>
      <Butterfly initialPos={[-2, 1.5, 0]} color="#f472b6" radius={4} speed={0.9} flightHeight={0.8} />
      <Butterfly initialPos={[2, 2.5, -2]} color="#c084fc" radius={3.2} speed={1.1} flightHeight={0.6} />
      <Butterfly initialPos={[0, 3.2, 1.5]} color="#93c5fd" radius={4.5} speed={0.8} flightHeight={1.1} />
      <Butterfly initialPos={[-3, 2.0, -1]} color="#fde047" radius={3.8} speed={1.3} flightHeight={0.7} />
      <Butterfly initialPos={[3, 1.2, 2]} color="#fbcfe8" radius={2.8} speed={1.0} flightHeight={0.5} />
    </group>
  );
}
