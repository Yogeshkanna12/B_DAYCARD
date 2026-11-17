import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface IslandProps {
  position?: [number, number, number];
  scale?: number;
  floatSpeed?: number;
}

export function FloatingIsland({
  position = [0, -1.8, 0],
  scale = 1,
  floatSpeed = 0.8,
}: IslandProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Procedural decorations (flowers, miniature trees, glowing crystals)
  const decorations = useMemo(() => {
    const items = [];
    const colors = ['#f472b6', '#c084fc', '#93c5fd', '#fde047', '#fed7aa', '#fbcfe8'];

    for (let i = 0; i < 24; i++) {
      const angle = (i / 24) * Math.PI * 2;
      const r = 2.2 + Math.random() * 2.2;
      const x = Math.cos(angle) * r;
      const z = Math.sin(angle) * r;
      const c = colors[i % colors.length];
      const s = 0.15 + Math.random() * 0.2;
      items.push({ x, z, color: c, s, type: i % 4 });
    }
    return items;
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime * floatSpeed;
    groupRef.current.position.y = position[1] + Math.sin(t) * 0.18;
    groupRef.current.rotation.y = Math.sin(t * 0.3) * 0.05;
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Upper Grassy/Pastel Surface */}
      <mesh position={[0, 0, 0]} receiveShadow>
        <cylinderGeometry args={[5.2, 4.2, 0.7, 32]} />
        <meshStandardMaterial
          color="#fdf2f8" // Soft blush pearl
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>

      {/* Island Lower Rocky Underside (inverted cone with rugged steps) */}
      <mesh position={[0, -1.6, 0]} receiveShadow>
        <coneGeometry args={[4.2, 2.8, 16]} />
        <meshStandardMaterial
          color="#a855f7" // Purple fantasy rock
          roughness={0.9}
          metalness={0.15}
        />
      </mesh>

      {/* Bottom Hanging Rock Tip */}
      <mesh position={[0, -3.2, 0]}>
        <coneGeometry args={[1.5, 1.8, 8]} />
        <meshStandardMaterial color="#6b21a8" roughness={0.9} />
      </mesh>

      {/* Decorative Miniature Trees & Glowing Crystals */}
      {decorations.map((item, idx) => (
        <group key={idx} position={[item.x, 0.35, item.z]}>
          {item.type === 0 ? (
            // Miniature Cherry Blossom Tree
            <group scale={item.s * 2.2}>
              {/* Trunk */}
              <mesh position={[0, 0.4, 0]}>
                <cylinderGeometry args={[0.08, 0.14, 0.8, 6]} />
                <meshStandardMaterial color="#78350f" roughness={0.9} />
              </mesh>
              {/* Blossom foliage sphere */}
              <mesh position={[0, 1.1, 0]}>
                <sphereGeometry args={[0.65, 8, 8]} />
                <meshStandardMaterial
                  color="#fbcfe8"
                  emissive="#f472b6"
                  emissiveIntensity={0.2}
                  roughness={0.5}
                />
              </mesh>
            </group>
          ) : item.type === 1 ? (
            // Glowing Crystal Shard
            <mesh position={[0, item.s * 1.5, 0]} scale={item.s * 1.8} rotation={[0.1, idx, 0.05]}>
              <octahedronGeometry args={[0.5, 0]} />
              <meshStandardMaterial
                color={item.color}
                emissive={item.color}
                emissiveIntensity={0.6}
                roughness={0.1}
                metalness={0.8}
                transparent
                opacity={0.9}
              />
            </mesh>
          ) : (
            // Cute Floating Pastel Flower
            <group scale={item.s * 1.2}>
              <mesh position={[0, 0.2, 0]}>
                <cylinderGeometry args={[0.03, 0.03, 0.4, 6]} />
                <meshStandardMaterial color="#86efac" />
              </mesh>
              <mesh position={[0, 0.4, 0]}>
                <sphereGeometry args={[0.2, 8, 8]} />
                <meshStandardMaterial
                  color={item.color}
                  emissive={item.color}
                  emissiveIntensity={0.4}
                />
              </mesh>
            </group>
          )}
        </group>
      ))}

      {/* Magical Ring of Light around island edge */}
      <mesh position={[0, 0.36, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[4.8, 5.2, 48]} />
        <meshStandardMaterial
          color="#f472b6"
          emissive="#f472b6"
          emissiveIntensity={0.5}
          side={THREE.DoubleSide}
          transparent
          opacity={0.4}
        />
      </mesh>
    </group>
  );
}
