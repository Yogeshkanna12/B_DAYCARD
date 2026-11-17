import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ParticleEffectsProps {
  count?: number;
  areaSize?: number;
  theme?: 'stars' | 'sparkles' | 'petals' | 'hearts';
}

export function ParticleEffects({
  count = 120,
  areaSize = 25,
  theme = 'sparkles',
}: ParticleEffectsProps) {
  const pointsRef = useRef<THREE.Points>(null);

  // Generate particle positions, colors, speeds, and random phases
  const [positions, colors, scales, speeds] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const sca = new Float32Array(count);
    const spd = new Float32Array(count);

    // Pastel palette
    const colorPalette = [
      new THREE.Color('#f472b6'), // soft pink
      new THREE.Color('#c084fc'), // lavender
      new THREE.Color('#93c5fd'), // baby blue
      new THREE.Color('#fde047'), // soft gold
      new THREE.Color('#fbcfe8'), // rose
      new THREE.Color('#ffffff'), // pearl white
    ];

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * areaSize;
      pos[i * 3 + 1] = (Math.random() - 0.5) * areaSize * 0.8 + 2;
      pos[i * 3 + 2] = (Math.random() - 0.5) * areaSize;

      const c = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;

      sca[i] = Math.random() * 0.8 + 0.4;
      spd[i] = Math.random() * 0.5 + 0.3;
    }

    return [pos, col, sca, spd];
  }, [count, areaSize]);

  // Procedural soft glowing circle texture
  const particleTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d')!;

    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.3, 'rgba(255, 220, 240, 0.8)');
    grad.addColorStop(0.7, 'rgba(230, 180, 255, 0.3)');
    grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(32, 32, 30, 0, Math.PI * 2);
    ctx.fill();

    return new THREE.CanvasTexture(canvas);
  }, []);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    const geo = pointsRef.current.geometry;
    const posAttr = geo.attributes.position;
    const array = posAttr.array as Float32Array;

    for (let i = 0; i < count; i++) {
      const idx = i * 3 + 1;
      // Gentle floating upward or undulating
      array[idx] += Math.sin(state.clock.elapsedTime * speeds[i] + i) * 0.015 + delta * 0.15;
      
      // Horizontal gentle sway
      const xIdx = i * 3;
      array[xIdx] += Math.cos(state.clock.elapsedTime * 0.5 + i) * 0.005;

      // Wrap around when rising too high
      if (array[idx] > areaSize * 0.5 + 2) {
        array[idx] = -areaSize * 0.4;
      }
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
        <bufferAttribute
          attach="attributes-scale"
          args={[scales, 1]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={theme === 'stars' ? 0.25 : 0.4}
        map={particleTexture}
        vertexColors
        transparent
        opacity={0.85}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
