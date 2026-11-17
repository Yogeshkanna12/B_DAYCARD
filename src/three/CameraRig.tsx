import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface CameraRigProps {
  currentScene: number; // 1 to 8
  isTransitioning?: boolean;
  zoomed?: boolean;
}

export function CameraRig({ currentScene, zoomed = false }: CameraRigProps) {
  const { camera, pointer } = useThree();
  const targetPos = useRef(new THREE.Vector3(0, 1.5, 5));
  const lookAtTarget = useRef(new THREE.Vector3(0, 0.5, 0));

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    // Mouse parallax offsets
    const parallaxX = pointer.x * 0.5;
    const parallaxY = pointer.y * 0.3;

    // Define ideal camera position per scene
    switch (currentScene) {
      case 1: // Intro
        if (zoomed) {
          targetPos.current.set(0, 0.4, 1.8);
        } else {
          targetPos.current.set(parallaxX * 0.4, 1.2 + parallaxY * 0.2, 4.6);
        }
        lookAtTarget.current.set(0, 0.2, 0);
        break;

      case 2: // Birthday World
        targetPos.current.set(
          Math.sin(t * 0.2) * 1.2 + parallaxX,
          1.8 + parallaxY,
          6.0
        );
        lookAtTarget.current.set(0, 0.4, 0);
        break;

      case 3: // Memories Gallery
        targetPos.current.set(parallaxX * 1.2, 0.6 + parallaxY * 0.8, 5.6);
        lookAtTarget.current.set(0, 0, 0);
        break;

      case 4: // Letter
        if (zoomed) {
          targetPos.current.set(0, 0.6, 3.2);
        } else {
          targetPos.current.set(parallaxX * 0.6, 0.8 + parallaxY * 0.4, 4.6);
        }
        lookAtTarget.current.set(0, 0.3, 0);
        break;

      case 5: // Cake
        if (zoomed) {
          targetPos.current.set(
            Math.sin(t * 0.3) * 1.5,
            2.2,
            6.5
          );
        } else {
          targetPos.current.set(
            Math.sin(t * 0.25) * 1.0 + parallaxX * 0.6,
            1.4 + parallaxY * 0.4,
            4.8
          );
        }
        lookAtTarget.current.set(0, 0.6, 0);
        break;

      case 6: // Countdown (Previously 7)
        targetPos.current.set(parallaxX * 0.8, 0.9 + parallaxY * 0.4, 5.6);
        lookAtTarget.current.set(0, 0, 0);
        break;

      case 7: // Treasure Box (Previously 8)
        if (zoomed) {
          targetPos.current.set(0, 1.4, 3.8);
        } else {
          targetPos.current.set(parallaxX * 0.6, 1.1 + parallaxY * 0.4, 4.6);
        }
        lookAtTarget.current.set(0, 0.1, 0);
        break;

      case 8: // Grand Finale (Previously 9)
        targetPos.current.set(
          Math.sin(t * 0.2) * 1.8 + parallaxX,
          1.4 + Math.sin(t * 0.3) * 0.4,
          5.8
        );
        lookAtTarget.current.set(0, 0.5, 0);
        break;

      default:
        targetPos.current.set(0, 1.5, 5);
        lookAtTarget.current.set(0, 0, 0);
        break;
    }

    // Smooth camera damping
    camera.position.lerp(targetPos.current, delta * 3.5);
    camera.lookAt(lookAtTarget.current);
  });

  return null;
}
