import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface BirthdayCake3DProps {
  candlesLit: boolean;
  onBlowCandles?: () => void;
}

export function BirthdayCake3D({ candlesLit }: BirthdayCake3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const flamesRef = useRef<THREE.Group>(null);
  const smokeRef = useRef<THREE.Points>(null);

  // Candles positions on top tier
  const candles = useMemo(() => {
    return [
      { x: 0, z: 0, height: 0.65, color: '#fbcfe8' },
      { x: 0.45, z: 0.25, height: 0.55, color: '#fed7aa' },
      { x: -0.45, z: 0.25, height: 0.55, color: '#bae6fd' },
      { x: 0.35, z: -0.4, height: 0.55, color: '#e9d5ff' },
      { x: -0.35, z: -0.4, height: 0.55, color: '#fde047' },
    ];
  }, []);

  // Cream piping beads for tier edges
  const creamBeads = useMemo(() => {
    const beads: { x: number; y: number; z: number; r: number }[] = [];
    // Tier 1 (bottom) rim
    for (let i = 0; i < 28; i++) {
      const angle = (i / 28) * Math.PI * 2;
      beads.push({ x: Math.cos(angle) * 1.85, y: -0.2, z: Math.sin(angle) * 1.85, r: 0.12 });
      beads.push({ x: Math.cos(angle) * 1.82, y: 0.42, z: Math.sin(angle) * 1.82, r: 0.1 });
    }
    // Tier 2 (middle) rim
    for (let i = 0; i < 22; i++) {
      const angle = (i / 22) * Math.PI * 2;
      beads.push({ x: Math.cos(angle) * 1.35, y: 0.45, z: Math.sin(angle) * 1.35, r: 0.1 });
      beads.push({ x: Math.cos(angle) * 1.32, y: 0.98, z: Math.sin(angle) * 1.32, r: 0.09 });
    }
    // Tier 3 (top) rim
    for (let i = 0; i < 16; i++) {
      const angle = (i / 16) * Math.PI * 2;
      beads.push({ x: Math.cos(angle) * 0.88, y: 1.0, z: Math.sin(angle) * 0.88, r: 0.09 });
      beads.push({ x: Math.cos(angle) * 0.85, y: 1.48, z: Math.sin(angle) * 0.85, r: 0.08 });
    }
    return beads;
  }, []);

  // Strawberries around middle tier
  const strawberries = useMemo(() => {
    const list = [];
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2 + 0.3;
      list.push({ x: Math.cos(angle) * 1.55, y: 0.48, z: Math.sin(angle) * 1.55 });
    }
    return list;
  }, []);

  // Smoke particles buffer
  const [smokePositions] = useMemo(() => {
    const count = 40;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 0.6;
      pos[i * 3 + 1] = 2.0 + Math.random() * 0.8;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.6;
    }
    return [pos];
  }, []);

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Gentle orbit float
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.2) * 0.1 - 0.2;
      groupRef.current.rotation.y += delta * 0.2;
    }

    // Flicker candle flames
    if (flamesRef.current && candlesLit) {
      const flicker = Math.sin(state.clock.elapsedTime * 20) * 0.08 + 1.0;
      flamesRef.current.scale.set(flicker, flicker * 1.1, flicker);
    }

    // Smoke rising when candles are blown
    if (smokeRef.current && !candlesLit) {
      const posAttr = smokeRef.current.geometry.attributes.position;
      const arr = posAttr.array as Float32Array;
      for (let i = 0; i < 40; i++) {
        arr[i * 3 + 1] += delta * 0.8;
        arr[i * 3] += Math.sin(state.clock.elapsedTime * 3 + i) * 0.01;
        if (arr[i * 3 + 1] > 4.5) {
          arr[i * 3 + 1] = 2.0;
        }
      }
      posAttr.needsUpdate = true;
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.2, 0]}>
      {/* Cake Stand / Glass Plate */}
      <mesh position={[0, -0.6, 0]} receiveShadow>
        <cylinderGeometry args={[2.4, 2.2, 0.15, 36]} />
        <meshPhysicalMaterial
          color="#ffffff"
          roughness={0.1}
          metalness={0.1}
          transmission={0.6}
          thickness={0.5}
          transparent
          opacity={0.85}
        />
      </mesh>
      {/* Cake Stand Pedestal Base */}
      <mesh position={[0, -0.9, 0]}>
        <cylinderGeometry args={[0.6, 1.4, 0.5, 24]} />
        <meshStandardMaterial color="#ffffff" roughness={0.2} metalness={0.2} />
      </mesh>

      {/* TIER 1 - BOTTOM (Pastel Lavender-Pink) */}
      <mesh position={[0, 0.1, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.8, 1.8, 0.65, 36]} />
        <meshStandardMaterial
          color="#f472b6"
          roughness={0.3}
          metalness={0.1}
          emissive="#f472b6"
          emissiveIntensity={0.06}
        />
      </mesh>

      {/* TIER 2 - MIDDLE (Pastel Soft Peach/Cream) */}
      <mesh position={[0, 0.72, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.3, 1.3, 0.58, 32]} />
        <meshStandardMaterial
          color="#fbcfe8"
          roughness={0.3}
          metalness={0.1}
          emissive="#fbcfe8"
          emissiveIntensity={0.08}
        />
      </mesh>

      {/* TIER 3 - TOP (Pastel Baby Rose / Pearl) */}
      <mesh position={[0, 1.25, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.85, 0.85, 0.5, 28]} />
        <meshStandardMaterial
          color="#fdf2f8"
          roughness={0.25}
          metalness={0.1}
          emissive="#f472b6"
          emissiveIntensity={0.1}
        />
      </mesh>

      {/* Decorative Cream Piping Beads around rims */}
      {creamBeads.map((bead, i) => (
        <mesh key={i} position={[bead.x, bead.y, bead.z]}>
          <sphereGeometry args={[bead.r, 8, 8]} />
          <meshStandardMaterial color="#ffffff" roughness={0.2} />
        </mesh>
      ))}

      {/* Decorative Strawberries */}
      {strawberries.map((s, i) => (
        <group key={i} position={[s.x, s.y, s.z]} rotation={[0.2, i, 0.1]} scale={0.22}>
          <mesh>
            <coneGeometry args={[0.5, 0.9, 12]} />
            <meshStandardMaterial color="#ef4444" roughness={0.3} />
          </mesh>
          {/* Green Stem Leaf */}
          <mesh position={[0, 0.45, 0]}>
            <sphereGeometry args={[0.2, 6, 6]} />
            <meshStandardMaterial color="#22c55e" />
          </mesh>
        </group>
      ))}

      {/* 5 Birthday Candles */}
      {candles.map((candle, idx) => (
        <group key={idx} position={[candle.x, 1.5, candle.z]}>
          {/* Candle Body */}
          <mesh position={[0, candle.height / 2, 0]} castShadow>
            <cylinderGeometry args={[0.045, 0.045, candle.height, 12]} />
            <meshStandardMaterial
              color={candle.color}
              roughness={0.2}
              emissive={candle.color}
              emissiveIntensity={0.2}
            />
          </mesh>
          {/* Black Wick */}
          <mesh position={[0, candle.height + 0.04, 0]}>
            <cylinderGeometry args={[0.008, 0.008, 0.08, 6]} />
            <meshBasicMaterial color="#1f2937" />
          </mesh>
        </group>
      ))}

      {/* Flickering Candle Flames */}
      {candlesLit && (
        <group ref={flamesRef}>
          {candles.map((candle, idx) => (
            <group key={idx} position={[candle.x, 1.5 + candle.height + 0.12, candle.z]}>
              {/* Outer Golden Flame */}
              <mesh scale={[0.07, 0.16, 0.07]}>
                <sphereGeometry args={[1, 12, 12]} />
                <meshBasicMaterial color="#fbbf24" />
              </mesh>
              {/* Inner White Flame Core */}
              <mesh scale={[0.04, 0.09, 0.04]}>
                <sphereGeometry args={[1, 8, 8]} />
                <meshBasicMaterial color="#ffffff" />
              </mesh>
              {/* Point Light from candle flame */}
              <pointLight color="#fde047" intensity={0.8} distance={2.5} />
            </group>
          ))}
        </group>
      )}

      {/* Smoke particles when candles are extinguished */}
      {!candlesLit && (
        <points ref={smokeRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[smokePositions, 3]}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.16}
            color="#e2e8f0"
            transparent
            opacity={0.45}
            blending={THREE.NormalBlending}
          />
        </points>
      )}
    </group>
  );
}
