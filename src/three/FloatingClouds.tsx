import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface CloudProps {
  position: [number, number, number];
  scale?: number;
  speed?: number;
  color?: string;
}

function DreamCloud({ position, scale = 1, speed = 0.2, color = '#fbcfe8' }: CloudProps) {
  const groupRef = useRef<THREE.Group>(null);
  const startX = position[0];

  // Procedural cloud cluster spheres
  const blobs = useMemo(() => {
    return [
      { offset: [0, 0, 0], r: 1.2 },
      { offset: [0.9, 0.2, 0.1], r: 0.95 },
      { offset: [-0.9, 0.15, -0.1], r: 0.9 },
      { offset: [0.4, 0.7, 0], r: 0.8 },
      { offset: [-0.4, 0.6, 0.1], r: 0.75 },
      { offset: [1.6, -0.1, 0.2], r: 0.65 },
      { offset: [-1.5, -0.1, -0.2], r: 0.6 },
    ];
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    // Slow drifting across X
    const time = state.clock.elapsedTime * speed;
    groupRef.current.position.x = startX + ((time * 0.5) % 40) - 20;
    // Gentle bobbing
    groupRef.current.position.y = position[1] + Math.sin(time + startX) * 0.25;
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {blobs.map((blob, idx) => (
        <mesh key={idx} position={blob.offset as [number, number, number]}>
          <sphereGeometry args={[blob.r, 16, 16]} />
          <meshStandardMaterial
            color={color}
            roughness={0.6}
            metalness={0.05}
            transparent
            opacity={0.88}
            emissive={color}
            emissiveIntensity={0.12}
          />
        </mesh>
      ))}
    </group>
  );
}

export function FloatingClouds() {
  const clouds = useMemo(() => [
    { pos: [-12, 5, -10], scale: 1.4, speed: 0.25, color: '#fbcfe8' }, // Pink
    { pos: [14, 7, -14], scale: 1.6, speed: 0.18, color: '#e9d5ff' },  // Lavender
    { pos: [-5, 8, -12], scale: 1.2, speed: 0.22, color: '#fed7aa' },  // Peach
    { pos: [8, 4, -8], scale: 1.1, speed: 0.3, color: '#bae6fd' },    // Baby blue
    { pos: [0, -3, -9], scale: 1.8, speed: 0.15, color: '#ffffff' },   // Pearl
    { pos: [-16, 2, -15], scale: 1.5, speed: 0.2, color: '#f5d0fe' },  // Soft orchid
  ], []);

  return (
    <group>
      {clouds.map((c, i) => (
        <DreamCloud
          key={i}
          position={c.pos as [number, number, number]}
          scale={c.scale}
          speed={c.speed}
          color={c.color}
        />
      ))}
    </group>
  );
}
