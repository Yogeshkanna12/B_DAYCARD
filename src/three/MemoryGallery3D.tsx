import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { MemoryItem } from '../config/birthdayConfig';
import { soundEffects } from '../utils/soundEffects';

interface MemoryGallery3DProps {
  memories: MemoryItem[];
  onSelectPhoto: (memory: MemoryItem) => void;
  selectedId: number | null;
}

function createFallbackTexture(title: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    // Beautiful pastel gradient
    const grad = ctx.createLinearGradient(0, 0, 512, 512);
    grad.addColorStop(0, '#fbcfe8'); // soft pink
    grad.addColorStop(0.5, '#e9d5ff'); // soft lavender
    grad.addColorStop(1, '#fed7aa'); // peach
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 512);

    // Inner glowing border
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 12;
    ctx.strokeRect(16, 16, 480, 480);

    // Cute heart icon
    ctx.font = '64px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('💖', 256, 200);

    // Title
    ctx.fillStyle = '#831843';
    ctx.font = 'bold 28px sans-serif';
    ctx.fillText(title || 'Sweet Memory', 256, 300);

    ctx.fillStyle = '#9d174d';
    ctx.font = 'italic 20px sans-serif';
    ctx.fillText('Mentalleyy & Bestie ✨', 256, 340);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function PolaroidFrame({
  memory,
  onSelect,
  isSelected,
}: {
  memory: MemoryItem;
  onSelect: (m: MemoryItem) => void;
  isSelected: boolean;
}) {
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const [photoDims, setPhotoDims] = useState<[number, number]>([1.28, 1.28]);

  useEffect(() => {
    let isMounted = true;
    const loader = new THREE.TextureLoader();

    loader.load(
      memory.image,
      (loadedTex) => {
        if (!isMounted) return;
        loadedTex.colorSpace = THREE.SRGBColorSpace;
        loadedTex.minFilter = THREE.LinearFilter;
        loadedTex.generateMipmaps = true;
        loadedTex.needsUpdate = true;
        setTexture(loadedTex);

        // Aspect ratio contain calculation for 3D Polaroid plane
        if (loadedTex.image && loadedTex.image.width && loadedTex.image.height) {
          const aspect = loadedTex.image.width / loadedTex.image.height;
          const maxDim = 1.28;
          if (aspect < 1) {
            // Portrait: height takes full frame, width scaled proportionally
            setPhotoDims([maxDim * aspect, maxDim]);
          } else {
            // Landscape: width takes full frame, height scaled proportionally
            setPhotoDims([maxDim, maxDim / aspect]);
          }
        }
      },
      undefined,
      () => {
        if (!isMounted) return;
        setTexture(createFallbackTexture(memory.title));
        setPhotoDims([1.28, 1.28]);
      }
    );

    return () => {
      isMounted = false;
    };
  }, [memory.image, memory.title]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime + memory.id;

    // Gentle float
    const floatY = Math.sin(t * 1.2) * 0.12;
    meshRef.current.position.y = memory.position[1] + floatY;

    // Interactive scale & rotation interpolation
    const targetScale = isSelected ? 1.35 : hovered ? 1.15 : 1.0;
    meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 8);

    if (hovered && !isSelected) {
      meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, 0, delta * 6);
      meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, 0, delta * 6);
    } else if (!isSelected) {
      meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, memory.rotation[0], delta * 4);
      meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, memory.rotation[1], delta * 4);
      meshRef.current.rotation.z = THREE.MathUtils.lerp(meshRef.current.rotation.z, memory.rotation[2], delta * 4);
    }
  });

  return (
    <group
      ref={meshRef}
      position={memory.position}
      rotation={memory.rotation}
      onClick={(e) => {
        e.stopPropagation();
        soundEffects.playClick();
        soundEffects.playSparkle();
        onSelect(memory);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
        soundEffects.playSparkle();
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = 'auto';
      }}
    >
      {/* Polaroid White Backing & Border */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.5, 1.85, 0.05]} />
        <meshStandardMaterial
          color="#ffffff"
          roughness={0.2}
          metalness={0.05}
          emissive="#fbcfe8"
          emissiveIntensity={hovered ? 0.35 : 0.05}
        />
      </mesh>

      {/* Soft Pastel Matte behind photo when aspect ratios differ */}
      <mesh position={[0, 0.18, 0.028]}>
        <planeGeometry args={[1.28, 1.28]} />
        <meshStandardMaterial color="#fdf2f8" roughness={0.4} />
      </mesh>

      {/* Photo Surface with Preserved Proportions (object-fit: contain in 3D) */}
      <mesh position={[0, 0.18, 0.032]}>
        <planeGeometry args={[photoDims[0], photoDims[1]]} />
        {texture ? (
          <meshBasicMaterial map={texture} />
        ) : (
          <meshStandardMaterial color="#f472b6" roughness={0.4} />
        )}
      </mesh>

      {/* Bottom Label Area Shadow/Indentation */}
      <mesh position={[0, -0.62, 0.03]}>
        <planeGeometry args={[1.28, 0.32]} />
        <meshBasicMaterial color="#f8fafc" />
      </mesh>

      {/* Glowing Border Frame */}
      <mesh position={[0, 0, 0.026]}>
        <ringGeometry args={[0.9, 0.95, 4]} />
        <meshBasicMaterial
          color="#f472b6"
          transparent
          opacity={hovered ? 0.8 : 0.2}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

export function MemoryGallery3D({ memories, onSelectPhoto, selectedId }: MemoryGallery3DProps) {
  return (
    <group position={[0, 0, 0]}>
      {memories.map((item) => (
        <PolaroidFrame
          key={item.id}
          memory={item}
          onSelect={onSelectPhoto}
          isSelected={selectedId === item.id}
        />
      ))}
    </group>
  );
}
