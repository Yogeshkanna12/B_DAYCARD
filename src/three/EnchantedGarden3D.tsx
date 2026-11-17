import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// ----------------------------------------------------------------------------
// 1. PROCEDURAL GLOWING FLOWER COMPONENT
// ----------------------------------------------------------------------------
interface GlowingFlowerProps {
  position: [number, number, number];
  color: string;
  petalColor: string;
  scale?: number;
  rotation?: [number, number, number];
  swaySpeed?: number;
  swayAmount?: number;
  hasSparkleLight?: boolean;
}

function GlowingFlower({
  position,
  color,
  petalColor,
  scale = 1,
  rotation = [0, 0, 0],
  swaySpeed = 1.2,
  swayAmount = 0.08,
  hasSparkleLight = false,
}: GlowingFlowerProps) {
  const stemRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const phase = useMemo(() => Math.random() * Math.PI * 2, []);

  // 6 curved petals around a central glowing core
  const petalGeo = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.bezierCurveTo(0.12, 0.15, 0.22, 0.45, 0, 0.7);
    shape.bezierCurveTo(-0.22, 0.45, -0.12, 0.15, 0, 0);
    const geo = new THREE.ShapeGeometry(shape, 8);
    geo.center();
    return geo;
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime * swaySpeed + phase;
    // Gentle natural stem swaying
    if (stemRef.current) {
      stemRef.current.rotation.z = rotation[2] + Math.sin(t) * swayAmount;
      stemRef.current.rotation.x = rotation[0] + Math.cos(t * 0.8) * (swayAmount * 0.7);
    }
    // Subtle breathing pulse of flower core
    if (coreRef.current) {
      const pulse = Math.sin(t * 2) * 0.15 + 1.0;
      coreRef.current.scale.set(pulse, pulse, pulse);
    }
  });

  return (
    <group position={position} scale={scale}>
      <group ref={stemRef}>
        {/* Slender curved green/emerald stem */}
        <mesh position={[0, 0.35, 0]}>
          <cylinderGeometry args={[0.025, 0.035, 0.7, 8]} />
          <meshStandardMaterial color="#34d399" roughness={0.6} />
        </mesh>

        {/* Stem Leaf */}
        <mesh position={[0.08, 0.25, 0]} rotation={[0.4, 0, -0.6]} scale={[0.15, 0.3, 0.05]}>
          <coneGeometry args={[0.3, 0.8, 5]} />
          <meshStandardMaterial color="#10b981" roughness={0.5} />
        </mesh>

        {/* Flower Head Group */}
        <group position={[0, 0.7, 0]} rotation={[0.3, 0, 0]}>
          {/* Central Glowing Stamen/Pistil */}
          <mesh ref={coreRef} position={[0, 0, 0.05]}>
            <sphereGeometry args={[0.12, 12, 12]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={0.85}
              roughness={0.2}
            />
          </mesh>

          {/* 6 Radiant Layered Petals */}
          {[0, 1, 2, 3, 4, 5].map((idx) => {
            const angle = (idx / 6) * Math.PI * 2;
            return (
              <group key={idx} rotation={[0, 0, angle]}>
                <mesh
                  geometry={petalGeo}
                  position={[0, 0.26, 0]}
                  rotation={[-0.3, 0, 0]}
                  scale={[0.65, 0.65, 0.65]}
                >
                  <meshStandardMaterial
                    color={petalColor}
                    emissive={color}
                    emissiveIntensity={0.25}
                    side={THREE.DoubleSide}
                    transparent
                    opacity={0.92}
                    roughness={0.3}
                  />
                </mesh>
              </group>
            );
          })}

          {/* Optional soft fairy light cast onto nearby grass */}
          {hasSparkleLight && (
            <pointLight color={color} intensity={0.65} distance={1.8} decay={2} />
          )}
        </group>
      </group>
    </group>
  );
}

// ----------------------------------------------------------------------------
// 2. PROCEDURAL FAIRY BELLFLOWER
// ----------------------------------------------------------------------------
function FairyBellFlower({
  position,
  color = '#c084fc',
  scale = 1,
}: {
  position: [number, number, number];
  color?: string;
  scale?: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const phase = useMemo(() => Math.random() * Math.PI * 2, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime * 1.4 + phase;
    groupRef.current.rotation.z = Math.sin(t) * 0.12;
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Arching Stem */}
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.02, 0.03, 0.8, 6]} />
        <meshStandardMaterial color="#6ee7b7" />
      </mesh>
      {/* Drooping Bell Bloom */}
      <mesh position={[0.1, 0.75, 0]} rotation={[Math.PI, 0, 0.3]}>
        <coneGeometry args={[0.22, 0.45, 12, 1, true]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.7}
          side={THREE.DoubleSide}
          transparent
          opacity={0.9}
        />
      </mesh>
      {/* Glowing tip */}
      <mesh position={[0.1, 0.6, 0]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshStandardMaterial
          color="#fef08a"
          emissive="#fef08a"
          emissiveIntensity={1.2}
        />
      </mesh>
    </group>
  );
}

// ----------------------------------------------------------------------------
// 3. GLOWING FAIRY MUSHROOMS
// ----------------------------------------------------------------------------
function GlowingMushroom({
  position,
  capColor = '#f472b6',
  scale = 1,
}: {
  position: [number, number, number];
  capColor?: string;
  scale?: number;
}) {
  const capRef = useRef<THREE.Mesh>(null);
  const phase = useMemo(() => Math.random() * Math.PI * 2, []);

  useFrame((state) => {
    if (!capRef.current) return;
    const t = state.clock.elapsedTime * 1.5 + phase;
    const mat = capRef.current.material as THREE.MeshStandardMaterial;
    if (mat) {
      mat.emissiveIntensity = 0.5 + Math.sin(t) * 0.3;
    }
  });

  return (
    <group position={position} scale={scale}>
      {/* Mushroom Stalk */}
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.04, 0.07, 0.3, 8]} />
        <meshStandardMaterial color="#fdf4ff" roughness={0.6} />
      </mesh>
      {/* Glowing Cap */}
      <mesh ref={capRef} position={[0, 0.32, 0]}>
        <sphereGeometry args={[0.18, 12, 10, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial
          color={capColor}
          emissive={capColor}
          emissiveIntensity={0.6}
          roughness={0.3}
        />
      </mesh>
    </group>
  );
}

// ----------------------------------------------------------------------------
// 4. CHERRY BLOSSOM & FAIRY WILLOW TREE
// ----------------------------------------------------------------------------
function FairyTree({
  position,
  scale = 1,
  rotationY = 0,
}: {
  position: [number, number, number];
  scale?: number;
  rotationY?: number;
}) {
  return (
    <group position={position} scale={scale} rotation={[0, rotationY, 0]}>
      {/* Twisted Fairy Trunk */}
      <mesh position={[0, 1.0, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.32, 2.0, 8]} />
        <meshStandardMaterial color="#581c87" roughness={0.8} />
      </mesh>

      {/* Main Canopy Sphere (Soft Rose Blossom) */}
      <mesh position={[0, 2.2, 0]} castShadow>
        <sphereGeometry args={[1.3, 14, 14]} />
        <meshStandardMaterial
          color="#fbcfe8"
          emissive="#f472b6"
          emissiveIntensity={0.22}
          roughness={0.6}
        />
      </mesh>

      {/* Secondary Soft Foliage Cluster (Lavender Glow) */}
      <mesh position={[0.6, 2.5, 0.4]}>
        <sphereGeometry args={[0.85, 12, 12]} />
        <meshStandardMaterial
          color="#e9d5ff"
          emissive="#c084fc"
          emissiveIntensity={0.25}
          roughness={0.6}
        />
      </mesh>

      {/* Secondary Soft Foliage Cluster (Peach Blossom) */}
      <mesh position={[-0.6, 2.3, -0.3]}>
        <sphereGeometry args={[0.8, 12, 12]} />
        <meshStandardMaterial
          color="#fed7aa"
          emissive="#fb923c"
          emissiveIntensity={0.15}
          roughness={0.6}
        />
      </mesh>

      {/* Hanging Fairy Foliage Tendrils */}
      {[-0.5, 0, 0.5].map((xOffset, idx) => (
        <mesh key={idx} position={[xOffset, 1.4, 0.4 * (idx - 1)]}>
          <cylinderGeometry args={[0.04, 0.08, 0.9, 6]} />
          <meshStandardMaterial
            color="#f472b6"
            emissive="#f472b6"
            emissiveIntensity={0.3}
            transparent
            opacity={0.85}
          />
        </mesh>
      ))}
    </group>
  );
}

// ----------------------------------------------------------------------------
// 5. VOLUMETRIC MOONLIGHT BEAMS
// ----------------------------------------------------------------------------
function MoonbeamRays() {
  const beamRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!beamRef.current) return;
    const t = state.clock.elapsedTime * 0.4;
    beamRef.current.rotation.y = Math.sin(t) * 0.08;
  });

  return (
    <group ref={beamRef} position={[0, 4.5, 0]}>
      {/* Angled ethereal moonlight shafts descending */}
      <mesh position={[-2.5, 0, -1]} rotation={[0.2, 0.3, -0.3]}>
        <cylinderGeometry args={[0.15, 1.4, 8, 12, 1, true]} />
        <meshStandardMaterial
          color="#fdf4ff"
          emissive="#e9d5ff"
          emissiveIntensity={0.4}
          side={THREE.DoubleSide}
          transparent
          opacity={0.15}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      <mesh position={[2.8, -0.5, 1.2]} rotation={[-0.2, -0.4, 0.25]}>
        <cylinderGeometry args={[0.1, 1.2, 7.5, 12, 1, true]} />
        <meshStandardMaterial
          color="#fef08a"
          emissive="#fde047"
          emissiveIntensity={0.35}
          side={THREE.DoubleSide}
          transparent
          opacity={0.14}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

// ----------------------------------------------------------------------------
// 6. ENCHANTED GARDEN MAIN EXPORT
// ----------------------------------------------------------------------------
export function EnchantedGarden3D() {
  return (
    <group position={[0, -2.0, 0]}>
      {/* Volumetric Moonlight Filtering Through Canopy */}
      <MoonbeamRays />

      {/* Lush Moss Mounds / Soft Flower Beds on the Island Surface */}
      <mesh position={[-1.8, 0.38, 1.2]} scale={[1.8, 0.4, 1.4]} receiveShadow>
        <sphereGeometry args={[1, 14, 10]} />
        <meshStandardMaterial
          color="#4c1d95" // Deep twilight violet moss
          roughness={0.8}
        />
      </mesh>

      <mesh position={[2.2, 0.36, -0.8]} scale={[2.0, 0.45, 1.5]} receiveShadow>
        <sphereGeometry args={[1, 14, 10]} />
        <meshStandardMaterial
          color="#581c87" // Soft amethyst moss
          roughness={0.8}
        />
      </mesh>

      <mesh position={[0.2, 0.35, -2.2]} scale={[2.2, 0.38, 1.6]} receiveShadow>
        <sphereGeometry args={[1, 14, 10]} />
        <meshStandardMaterial
          color="#3b0764"
          roughness={0.85}
        />
      </mesh>

      {/* Fairy Trees */}
      <FairyTree position={[-3.2, 0.35, -1.8]} scale={1.15} rotationY={0.6} />
      <FairyTree position={[3.3, 0.35, -1.5]} scale={1.25} rotationY={-0.4} />
      <FairyTree position={[-1.2, 0.35, -3.6]} scale={1.05} rotationY={1.2} />

      {/* FOREGROUND & PERIMETER GLOWING FLOWERS (Soft Pink, Lavender, Violet, Pearl White) */}
      {/* Cluster Left */}
      <GlowingFlower
        position={[-1.8, 0.45, 2.2]}
        color="#f472b6"
        petalColor="#fbcfe8"
        scale={0.9}
        swaySpeed={1.1}
        hasSparkleLight={true}
      />
      <GlowingFlower
        position={[-2.3, 0.42, 1.6]}
        color="#c084fc"
        petalColor="#e9d5ff"
        scale={0.75}
        swaySpeed={1.4}
      />
      <GlowingFlower
        position={[-1.2, 0.45, 2.5]}
        color="#ffffff"
        petalColor="#fdf4ff"
        scale={0.8}
        swaySpeed={1.0}
      />

      {/* Cluster Right */}
      <GlowingFlower
        position={[2.0, 0.45, 1.8]}
        color="#c084fc"
        petalColor="#e9d5ff"
        scale={0.95}
        swaySpeed={1.2}
        hasSparkleLight={true}
      />
      <GlowingFlower
        position={[2.6, 0.42, 1.2]}
        color="#f472b6"
        petalColor="#fbcfe8"
        scale={0.8}
        swaySpeed={1.3}
      />
      <GlowingFlower
        position={[1.4, 0.46, 2.4]}
        color="#fde047"
        petalColor="#fef08a"
        scale={0.85}
        swaySpeed={1.0}
      />

      {/* Midground Back & Side Flowers */}
      <GlowingFlower
        position={[-2.8, 0.42, -0.6]}
        color="#a855f7"
        petalColor="#d8b4fe"
        scale={0.85}
        swaySpeed={1.2}
      />
      <GlowingFlower
        position={[2.9, 0.42, -0.4]}
        color="#f472b6"
        petalColor="#fbcfe8"
        scale={0.9}
        swaySpeed={1.1}
      />
      <GlowingFlower
        position={[0.8, 0.42, -2.5]}
        color="#c084fc"
        petalColor="#e9d5ff"
        scale={1.0}
        swaySpeed={1.3}
        hasSparkleLight={true}
      />
      <GlowingFlower
        position={[-1.5, 0.42, -2.4]}
        color="#ffffff"
        petalColor="#fdf2f8"
        scale={0.75}
        swaySpeed={1.0}
      />

      {/* Fairy Bellflowers */}
      <FairyBellFlower position={[-0.8, 0.4, 2.6]} color="#c084fc" scale={0.8} />
      <FairyBellFlower position={[0.7, 0.4, 2.7]} color="#f472b6" scale={0.75} />
      <FairyBellFlower position={[-3.1, 0.4, 0.6]} color="#93c5fd" scale={0.85} />
      <FairyBellFlower position={[3.2, 0.4, 0.8]} color="#c084fc" scale={0.8} />

      {/* Cute Glowing Fairy Mushrooms */}
      <GlowingMushroom position={[-1.6, 0.4, 0.8]} capColor="#f472b6" scale={0.8} />
      <GlowingMushroom position={[-1.4, 0.4, 0.6]} capColor="#c084fc" scale={0.6} />
      <GlowingMushroom position={[1.8, 0.4, 0.7]} capColor="#93c5fd" scale={0.75} />
      <GlowingMushroom position={[2.0, 0.4, 0.9]} capColor="#f472b6" scale={0.55} />
      <GlowingMushroom position={[-0.5, 0.4, -1.8]} capColor="#fde047" scale={0.65} />
      <GlowingMushroom position={[1.2, 0.4, -1.6]} capColor="#f472b6" scale={0.7} />

      {/* Soft Ambient Point Lights nested in the flower garden */}
      <pointLight position={[-1.8, 1.2, 1.8]} color="#f472b6" intensity={1.1} distance={4.5} />
      <pointLight position={[1.8, 1.2, 1.8]} color="#c084fc" intensity={1.1} distance={4.5} />
      <pointLight position={[0, 1.0, -1.8]} color="#fde047" intensity={0.9} distance={4.0} />
    </group>
  );
}
