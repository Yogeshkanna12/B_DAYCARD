import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { BalloonCluster } from './Balloon3D';
import { BirthdayCake3D } from './BirthdayCake3D';

interface BirthdayHero3DProps {
  friendName: string;
}

export function BirthdayHero3D({ }: BirthdayHero3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.9) * 0.12;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.3;
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.4, 0]}>
      {/* Centerpiece 3D Birthday Cake */}
      <group position={[0, 0, 0]} scale={0.88}>
        <BirthdayCake3D candlesLit={true} />
      </group>

      {/* Flanking Balloon Clusters */}
      <BalloonCluster />

      {/* Orbiting Halo Ring of Gold & Pearl Dust */}
      <mesh ref={ringRef} position={[0, 1.2, 0]} rotation={[Math.PI / 2.5, 0, 0]}>
        <torusGeometry args={[3.2, 0.04, 16, 64]} />
        <meshStandardMaterial
          color="#fde047"
          emissive="#eab308"
          emissiveIntensity={0.6}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
    </group>
  );
}
