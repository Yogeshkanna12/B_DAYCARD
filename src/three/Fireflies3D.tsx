import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface Fireflies3DProps {
  count?: number;
  radius?: number;
  height?: number;
}

export function Fireflies3D({
  count = 180,
  radius = 12,
  height = 8,
}: Fireflies3DProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const { pointer } = useThree();

  // Generate firefly attributes
  const [positions, initialPositions, colors, phases, speeds] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const initPos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const ph = new Float32Array(count);
    const sp = new Float32Array(count);

    const palette = [
      new THREE.Color('#fef08a'), // Warm radiant gold
      new THREE.Color('#fde047'), // Bright golden firefly
      new THREE.Color('#fed7aa'), // Soft peach gold
      new THREE.Color('#fbcfe8'), // Pastel rose
      new THREE.Color('#e9d5ff'), // Soft fairy lavender
      new THREE.Color('#ffffff'), // Pure pearl sparkle
    ];

    for (let i = 0; i < count; i++) {
      // Cylindrical distribution around the garden
      const r = Math.sqrt(Math.random()) * radius;
      const theta = Math.random() * Math.PI * 2;
      const x = Math.cos(theta) * r;
      const y = (Math.random() - 0.3) * height;
      const z = Math.sin(theta) * r;

      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;

      initPos[i * 3] = x;
      initPos[i * 3 + 1] = y;
      initPos[i * 3 + 2] = z;

      const c = palette[i % palette.length];
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;

      ph[i] = Math.random() * Math.PI * 2;
      sp[i] = 0.6 + Math.random() * 0.8;
    }

    return [pos, initPos, col, ph, sp];
  }, [count, radius, height]);

  // Procedural soft-glow firefly texture
  const glowTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d')!;

    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.2, 'rgba(254, 240, 138, 0.95)');
    grad.addColorStop(0.5, 'rgba(244, 114, 182, 0.45)');
    grad.addColorStop(0.8, 'rgba(192, 132, 252, 0.15)');
    grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(32, 32, 30, 0, Math.PI * 2);
    ctx.fill();

    return new THREE.CanvasTexture(canvas);
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const geo = pointsRef.current.geometry;
    const posAttr = geo.attributes.position;
    const array = posAttr.array as Float32Array;
    const time = state.clock.elapsedTime;

    // Mouse influence
    const targetMouseX = pointer.x * 1.5;
    const targetMouseY = pointer.y * 1.0;

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      const phase = phases[i];
      const speed = speeds[i];

      // Organic 3D wandering (Brownian Lissajous)
      const wanderX = Math.sin(time * speed * 0.7 + phase) * 0.4;
      const wanderY = Math.sin(time * speed * 1.2 + phase * 1.5) * 0.35;
      const wanderZ = Math.cos(time * speed * 0.8 + phase * 0.9) * 0.4;

      // Subtle cursor drift: fireflies gently move in reaction to the pointer
      const mouseFactor = 0.2 / (1 + Math.abs(array[idx] - targetMouseX) * 0.5);
      const cursorReactionX = targetMouseX * mouseFactor;
      const cursorReactionY = targetMouseY * mouseFactor;

      array[idx] = initialPositions[idx] + wanderX + cursorReactionX;
      array[idx + 1] = initialPositions[idx + 1] + wanderY + cursorReactionY + Math.sin(time * 0.3 + phase) * 0.2;
      array[idx + 2] = initialPositions[idx + 2] + wanderZ;
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
      </bufferGeometry>
      <pointsMaterial
        size={0.22}
        map={glowTexture}
        vertexColors
        transparent
        opacity={0.9}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}
