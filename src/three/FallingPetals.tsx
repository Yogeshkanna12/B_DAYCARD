import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface FallingPetalsProps {
  count?: number;
  areaWidth?: number;
  areaHeight?: number;
}

export function FallingPetals({
  count = 75,
  areaWidth = 14,
  areaHeight = 10,
}: FallingPetalsProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Initialize petals with random positions, rotations, scales, and speeds
  const petals = useMemo(() => {
    const data = [];
    const colors = [
      new THREE.Color('#fbcfe8'), // Soft rose pink
      new THREE.Color('#f472b6'), // Vibrant pastel pink
      new THREE.Color('#e9d5ff'), // Gentle lavender
      new THREE.Color('#ffffff'), // Luminous white
      new THREE.Color('#fed7aa'), // Soft peach
    ];

    for (let i = 0; i < count; i++) {
      data.push({
        x: (Math.random() - 0.5) * areaWidth,
        y: Math.random() * areaHeight - 2,
        z: (Math.random() - 0.5) * areaWidth,
        rotX: Math.random() * Math.PI * 2,
        rotY: Math.random() * Math.PI * 2,
        rotZ: Math.random() * Math.PI * 2,
        rotSpeedX: (Math.random() - 0.5) * 1.5,
        rotSpeedY: (Math.random() - 0.5) * 2.0,
        rotSpeedZ: (Math.random() - 0.5) * 1.2,
        fallSpeed: 0.35 + Math.random() * 0.45,
        windPhase: Math.random() * Math.PI * 2,
        windFrequency: 0.8 + Math.random() * 0.6,
        scale: 0.08 + Math.random() * 0.07,
        color: colors[i % colors.length],
      });
    }
    return data;
  }, [count, areaWidth, areaHeight]);

  // Set initial colors on the instanced mesh
  const petalGeometry = useMemo(() => {
    // Create an elegant petal shape: pinched at base, wider in middle, rounded tip
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.bezierCurveTo(0.2, 0.3, 0.35, 0.7, 0, 1.0);
    shape.bezierCurveTo(-0.35, 0.7, -0.2, 0.3, 0, 0);

    const geo = new THREE.ShapeGeometry(shape, 8);
    // Center the geometry so rotation happens around its middle
    geo.center();
    return geo;
  }, []);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    const time = state.clock.elapsedTime;

    for (let i = 0; i < count; i++) {
      const p = petals[i];

      // Vertical descent
      p.y -= p.fallSpeed * delta;

      // Gentle horizontal wind drift
      p.x += Math.sin(time * p.windFrequency + p.windPhase) * 0.012;
      p.z += Math.cos(time * 0.7 + p.windPhase) * 0.008;

      // 3D tumbling rotation
      p.rotX += p.rotSpeedX * delta;
      p.rotY += p.rotSpeedY * delta;
      p.rotZ += p.rotSpeedZ * delta;

      // Respawn at the top when falling below ground
      if (p.y < -3.2) {
        p.y = areaHeight * 0.6 + Math.random() * 2;
        p.x = (Math.random() - 0.5) * areaWidth;
        p.z = (Math.random() - 0.5) * areaWidth;
      }

      dummy.position.set(p.x, p.y, p.z);
      dummy.rotation.set(p.rotX, p.rotY, p.rotZ);
      dummy.scale.set(p.scale, p.scale * 1.3, p.scale);
      dummy.updateMatrix();

      meshRef.current.setMatrixAt(i, dummy.matrix);
      meshRef.current.setColorAt(i, p.color);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[petalGeometry, undefined, count]}
      castShadow={false}
      receiveShadow={false}
    >
      <meshStandardMaterial
        side={THREE.DoubleSide}
        transparent
        opacity={0.88}
        roughness={0.4}
        metalness={0.05}
        depthWrite={false}
      />
    </instancedMesh>
  );
}
