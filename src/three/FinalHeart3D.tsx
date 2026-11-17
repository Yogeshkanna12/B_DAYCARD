import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function FinalHeart3D() {
  const heartMeshRef = useRef<THREE.Group>(null);
  const orbitGroupRef = useRef<THREE.Group>(null);

  // Procedural Extruded 3D Heart Shape
  const heartGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    // Centered parametric heart
    const x = 0, y = 0;
    shape.moveTo(x, y + 0.4);
    shape.bezierCurveTo(x, y + 0.7, x - 0.6, y + 0.7, x - 0.6, y + 0.35);
    shape.bezierCurveTo(x - 0.6, y, x, y - 0.45, x, y - 0.7);
    shape.bezierCurveTo(x, y - 0.45, x + 0.6, y, x + 0.6, y + 0.35);
    shape.bezierCurveTo(x + 0.6, y + 0.7, x, y + 0.7, x, y + 0.4);

    const extrudeSettings: THREE.ExtrudeGeometryOptions = {
      depth: 0.35,
      bevelEnabled: true,
      bevelSegments: 8,
      steps: 2,
      bevelSize: 0.14,
      bevelThickness: 0.14,
    };

    const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geom.center();
    return geom;
  }, []);

  // Orbiting mini satellites (hearts, stars, petals)
  const satellites = useMemo(() => {
    const list = [];
    const colors = ['#f472b6', '#c084fc', '#93c5fd', '#fde047', '#fbcfe8', '#fed7aa'];
    for (let i = 0; i < 18; i++) {
      const angle = (i / 18) * Math.PI * 2;
      const r = 2.4 + Math.sin(i * 2) * 0.4;
      const y = (Math.random() - 0.5) * 1.6;
      list.push({
        x: Math.cos(angle) * r,
        z: Math.sin(angle) * r,
        y,
        color: colors[i % colors.length],
        scale: 0.12 + Math.random() * 0.14,
      });
    }
    return list;
  }, []);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;

    // Rhythmic Heartbeat pulse
    if (heartMeshRef.current) {
      const beat = Math.sin(t * 3.5) * 0.08 + 1.0;
      const doubleBeat = Math.sin(t * 7) > 0.7 ? 1.06 : 1.0;
      const scale = beat * doubleBeat * 1.5;
      heartMeshRef.current.scale.set(scale, scale, scale);
      heartMeshRef.current.rotation.y = Math.sin(t * 0.8) * 0.25;
      heartMeshRef.current.rotation.x = Math.sin(t * 0.4) * 0.08;
    }

    // Orbiting mini stars rotation
    if (orbitGroupRef.current) {
      orbitGroupRef.current.rotation.y += delta * 0.4;
    }
  });

  return (
    <group position={[0, 0.4, 0]}>
      {/* Giant 3D Glowing Heart */}
      <group ref={heartMeshRef}>
        <mesh geometry={heartGeometry} castShadow receiveShadow>
          <meshPhysicalMaterial
            color="#f43f5e" // Radiant rose pink
            roughness={0.15}
            metalness={0.25}
            clearcoat={0.9}
            clearcoatRoughness={0.1}
            emissive="#e11d48"
            emissiveIntensity={0.4}
          />
        </mesh>
      </group>

      {/* Orbiting Satellites Ring */}
      <group ref={orbitGroupRef}>
        {satellites.map((sat, idx) => (
          <mesh key={idx} position={[sat.x, sat.y, sat.z]} scale={sat.scale}>
            <octahedronGeometry args={[1, 0]} />
            <meshStandardMaterial
              color={sat.color}
              emissive={sat.color}
              emissiveIntensity={0.8}
              roughness={0.1}
            />
          </mesh>
        ))}
      </group>

      {/* Radiant Glow Ring */}
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.0, 2.6, 48]} />
        <meshBasicMaterial
          color="#f472b6"
          transparent
          opacity={0.35}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}
