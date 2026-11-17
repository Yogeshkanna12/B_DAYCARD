import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ButterflyProps {
  initialPos: [number, number, number];
  color: string;
  accentColor?: string;
  radius?: number;
  speed?: number;
  flightHeight?: number;
  nearCamera?: boolean;
}

function Butterfly({
  initialPos,
  color,
  accentColor = '#ffffff',
  radius = 3.5,
  speed = 1.0,
  flightHeight = 0.8,
  nearCamera = false,
}: ButterflyProps) {
  const groupRef = useRef<THREE.Group>(null);
  const leftWingRef = useRef<THREE.Group>(null);
  const rightWingRef = useRef<THREE.Group>(null);
  const phase = useMemo(() => Math.random() * Math.PI * 2, []);

  // Procedural elegant curved butterfly wing shape
  const wingGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    // Upper wing lobe
    shape.moveTo(0, 0);
    shape.bezierCurveTo(-0.2, 0.4, -0.7, 0.7, -0.85, 0.4);
    shape.bezierCurveTo(-0.9, 0.1, -0.6, -0.1, -0.2, -0.1);
    // Lower wing lobe
    shape.bezierCurveTo(-0.6, -0.4, -0.4, -0.7, -0.1, -0.5);
    shape.bezierCurveTo(-0.05, -0.3, -0.02, -0.1, 0, 0);

    return new THREE.ShapeGeometry(shape, 12);
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime * speed + phase;

    if (groupRef.current) {
      if (nearCamera) {
        // Butterfly that sweeps gracefully near the foreground camera
        const x = Math.sin(t * 0.7) * 2.8;
        const y = Math.cos(t * 1.1) * 0.7 + initialPos[1];
        const z = Math.sin(t * 0.5) * 2.2 + 2.0; // Brings it close to camera
        groupRef.current.position.set(x, y, z);

        const dx = Math.cos(t * 0.7) * 2.8 * 0.7;
        const dz = Math.cos(t * 0.5) * 2.2 * 0.5;
        groupRef.current.rotation.y = Math.atan2(dx, dz) + Math.PI;
        groupRef.current.rotation.z = Math.sin(t * 1.5) * 0.15;
      } else {
        // Smooth curved Lissajous flight path around garden
        const x = initialPos[0] + Math.sin(t) * radius;
        const z = initialPos[2] + Math.cos(t * 0.75) * (radius * 0.85);
        const y = initialPos[1] + Math.sin(t * 1.8) * flightHeight;
        groupRef.current.position.set(x, y, z);

        const dx = Math.cos(t) * radius;
        const dz = -Math.sin(t * 0.75) * (radius * 0.85) * 0.75;
        groupRef.current.rotation.y = Math.atan2(dx, dz) + Math.PI;
        groupRef.current.rotation.x = Math.sin(t * 1.5) * 0.15;
      }
    }

    // Natural fluttering motion (flutter + slight tilt)
    const flap = Math.sin(state.clock.elapsedTime * 14 + phase) * 0.65;
    if (leftWingRef.current) {
      leftWingRef.current.rotation.y = flap;
    }
    if (rightWingRef.current) {
      rightWingRef.current.rotation.y = -flap;
    }
  });

  return (
    <group ref={groupRef} position={initialPos} scale={0.28}>
      {/* Slender Butterfly Body */}
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 4, 0, 0]}>
        <cylinderGeometry args={[0.04, 0.02, 0.65, 8]} />
        <meshStandardMaterial color="#4a044e" roughness={0.5} />
      </mesh>

      {/* Little glowing antenna / head */}
      <mesh position={[0, 0.24, 0.1]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial
          color={accentColor}
          emissive={accentColor}
          emissiveIntensity={0.8}
        />
      </mesh>

      {/* Left Wing Group */}
      <group ref={leftWingRef} position={[-0.03, 0, 0]}>
        <mesh geometry={wingGeometry}>
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.45}
            side={THREE.DoubleSide}
            transparent
            opacity={0.9}
            roughness={0.25}
          />
        </mesh>
      </group>

      {/* Right Wing Group (mirrored on X) */}
      <group ref={rightWingRef} position={[0.03, 0, 0]} scale={[-1, 1, 1]}>
        <mesh geometry={wingGeometry}>
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.45}
            side={THREE.DoubleSide}
            transparent
            opacity={0.9}
            roughness={0.25}
          />
        </mesh>
      </group>

      {/* Soft Fairy Sparkle attached to butterfly */}
      <pointLight color={color} intensity={0.4} distance={1.2} />
    </group>
  );
}

export function Butterflies3D() {
  return (
    <group>
      {/* Garden Orbit Butterflies */}
      <Butterfly
        initialPos={[-2.2, 1.2, -0.5]}
        color="#f472b6"
        accentColor="#fbcfe8"
        radius={3.8}
        speed={0.85}
        flightHeight={0.6}
      />
      <Butterfly
        initialPos={[2.5, 1.8, -1.8]}
        color="#c084fc"
        accentColor="#e9d5ff"
        radius={3.2}
        speed={1.05}
        flightHeight={0.7}
      />
      <Butterfly
        initialPos={[0.5, 2.4, 0.5]}
        color="#93c5fd"
        accentColor="#ffffff"
        radius={4.2}
        speed={0.75}
        flightHeight={0.9}
      />
      <Butterfly
        initialPos={[-2.8, 1.6, -1.5]}
        color="#fde047"
        accentColor="#fef08a"
        radius={3.6}
        speed={1.15}
        flightHeight={0.5}
      />
      <Butterfly
        initialPos={[2.8, 0.9, 1.2]}
        color="#fbcfe8"
        accentColor="#f472b6"
        radius={2.6}
        speed={0.95}
        flightHeight={0.45}
      />

      {/* Foreground Cinematic Butterflies (Dips close to camera) */}
      <Butterfly
        initialPos={[0, 1.1, 2.5]}
        color="#f472b6"
        accentColor="#fde047"
        speed={0.6}
        nearCamera={true}
      />
      <Butterfly
        initialPos={[1.2, 1.6, 2.8]}
        color="#c084fc"
        accentColor="#ffffff"
        speed={0.75}
        nearCamera={true}
      />
    </group>
  );
}
