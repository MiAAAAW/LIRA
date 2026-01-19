/**
 * @fileoverview Camera Rig Component
 * @description Mouse-controlled parallax camera movement
 */

import { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * CameraRig - Parallax con movimiento del mouse
 * Crea un efecto de profundidad sutil al mover el mouse
 */
export function CameraRig({ children, intensity = 1 }) {
  const groupRef = useRef();
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  // Escuchar movimiento del mouse
  useEffect(() => {
    const handleMouseMove = (event) => {
      // Normalizar posición del mouse (-1 a 1)
      setMouse({
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Movimiento suave siguiendo el mouse (lerp)
      const targetRotationY = mouse.x * 0.08 * intensity;
      const targetRotationX = mouse.y * 0.04 * intensity;

      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        targetRotationY,
        delta * 2
      );

      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        targetRotationX,
        delta * 2
      );

      // Movimiento de posición sutil
      groupRef.current.position.x = THREE.MathUtils.lerp(
        groupRef.current.position.x,
        mouse.x * 0.5 * intensity,
        delta * 1.5
      );

      groupRef.current.position.y = THREE.MathUtils.lerp(
        groupRef.current.position.y,
        mouse.y * 0.3 * intensity,
        delta * 1.5
      );
    }
  });

  return <group ref={groupRef}>{children}</group>;
}

/**
 * AutoRotate - Rotación automática suave
 * Para cuando el usuario no interactúa
 */
export function AutoRotate({ children, speed = 0.1 }) {
  const groupRef = useRef();

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y =
        Math.sin(state.clock.elapsedTime * speed) * 0.05;
    }
  });

  return <group ref={groupRef}>{children}</group>;
}

export default CameraRig;
