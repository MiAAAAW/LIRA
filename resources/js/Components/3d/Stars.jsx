/**
 * @fileoverview Stars Component
 * @description Starry night sky for Lake Titicaca scene
 */

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Stars - Cielo estrellado con parpadeo sutil
 * Representa el cielo nocturno del altiplano
 */
export function Stars({ count = 800 }) {
  const pointsRef = useRef();

  // Generar posiciones aleatorias de estrellas
  const [positions, sizes] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const size = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Distribuir en un domo sobre la escena
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI * 0.4; // Solo en la parte superior

      const radius = 80 + Math.random() * 40;

      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.cos(phi) + 15; // Elevar
      pos[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta) - 30;

      // Tamaños variados
      size[i] = Math.random() * 0.8 + 0.2;
    }
    return [pos, size];
  }, [count]);

  // Parpadeo de estrellas
  useFrame((state) => {
    if (pointsRef.current) {
      const time = state.clock.elapsedTime;
      // Variación de opacidad para simular parpadeo
      pointsRef.current.material.opacity = 0.65 + Math.sin(time * 0.5) * 0.15;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={count}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.2}
        color="#ffffff"
        transparent
        opacity={0.75}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

/**
 * Bright Stars - Estrellas más brillantes y grandes
 */
export function BrightStars({ count = 50 }) {
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI * 0.35;
      const radius = 70 + Math.random() * 30;

      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.cos(phi) + 20;
      pos[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta) - 25;
    }
    return pos;
  }, [count]);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.5}
        color="#ffffee"
        transparent
        opacity={0.9}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default Stars;
