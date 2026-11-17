import { useRef, useState, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { birthdayConfig } from '../config/birthdayConfig';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPassed: boolean;
}

function calculateTimeLeft(): TimeLeft {
  // Target birthday
  const targetDate = new Date(birthdayConfig.birthday.date).getTime();
  const now = new Date().getTime();
  const diff = targetDate - now;

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isPassed: true };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return { days, hours, minutes, seconds, isPassed: false };
}

function GlassCard3D({
  position,
  value,
  label,
}: {
  position: [number, number, number];
  value: string | number;
  label: string;
}) {
  const meshRef = useRef<THREE.Group>(null);

  // Generate canvas texture with value and label
  const cardTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;

    // Rounded rectangle card
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.beginPath();
    ctx.roundRect(10, 10, 236, 236, 28);
    ctx.fill();

    // Soft gradient border
    ctx.strokeStyle = '#ec4899';
    ctx.lineWidth = 8;
    ctx.stroke();

    // Number
    ctx.fillStyle = '#831843';
    ctx.font = 'bold 96px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(String(value).padStart(2, '0'), 128, 110);

    // Label
    ctx.fillStyle = '#db2777';
    ctx.font = '600 28px Outfit, sans-serif';
    ctx.letterSpacing = '3px';
    ctx.fillText(label.toUpperCase(), 128, 185);

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, [value, label]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime + position[0];
    meshRef.current.position.y = position[1] + Math.sin(t * 1.5) * 0.12;
    meshRef.current.rotation.y = Math.sin(t * 0.8) * 0.08;
  });

  return (
    <group ref={meshRef} position={position}>
      {/* 3D Glass Block */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.3, 1.45, 0.12]} />
        <meshPhysicalMaterial
          color="#fdf2f8"
          roughness={0.15}
          metalness={0.1}
          transmission={0.8}
          thickness={0.5}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Front Label Plane */}
      <mesh position={[0, 0, 0.07]}>
        <planeGeometry args={[1.2, 1.35]} />
        <meshBasicMaterial map={cardTexture} transparent opacity={0.96} />
      </mesh>

      {/* Glowing Back Aura */}
      <mesh position={[0, 0, -0.07]}>
        <planeGeometry args={[1.35, 1.5]} />
        <meshBasicMaterial
          color="#f472b6"
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

export function Countdown3D() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());
  const groupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.08;
    }
  });

  const cards = [
    { label: 'Days', val: timeLeft.days, pos: [-2.1, 0, 0] },
    { label: 'Hours', val: timeLeft.hours, pos: [-0.7, 0, 0.15] },
    { label: 'Minutes', val: timeLeft.minutes, pos: [0.7, 0, 0.15] },
    { label: 'Seconds', val: timeLeft.seconds, pos: [2.1, 0, 0] },
  ];

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {cards.map((card, idx) => (
        <GlassCard3D
          key={idx}
          position={card.pos as [number, number, number]}
          value={card.val}
          label={card.label}
        />
      ))}
    </group>
  );
}
