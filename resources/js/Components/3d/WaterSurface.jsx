/**
 * @fileoverview Water Surface Component
 * @description Animated water shader for Lake Titicaca
 */

import { useRef, useMemo } from 'react';
import { useFrame, extend } from '@react-three/fiber';
import { Water } from 'three/examples/jsm/objects/Water.js';
import * as THREE from 'three';

// Extend Three.js with Water
extend({ Water });

/**
 * WaterSurface - Plano de agua con shader animado
 * Simula las aguas del Lago Titicaca
 */
export function WaterSurface() {
  const waterRef = useRef();

  // Geometría del agua (plano grande)
  const waterGeometry = useMemo(
    () => new THREE.PlaneGeometry(200, 200, 32, 32),
    []
  );

  // Configuración del shader de agua
  const waterConfig = useMemo(() => {
    const textureLoader = new THREE.TextureLoader();
    const waterNormals = textureLoader.load(
      '/textures/waternormals.jpg',
      (texture) => {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      }
    );

    return {
      textureWidth: 512,
      textureHeight: 512,
      waterNormals,
      sunDirection: new THREE.Vector3(0.5, 0.5, 0),
      sunColor: 0xffeedd,
      waterColor: 0x0077be, // Azul Titicaca
      distortionScale: 2.5,
      fog: true,
      alpha: 0.9,
    };
  }, []);

  // Animar las ondas del agua
  useFrame((state, delta) => {
    if (waterRef.current?.material?.uniforms?.time) {
      waterRef.current.material.uniforms.time.value += delta * 0.4;
    }
  });

  return (
    <water
      ref={waterRef}
      args={[waterGeometry, waterConfig]}
      rotation-x={-Math.PI / 2}
      position={[0, -0.5, 0]}
    />
  );
}

export default WaterSurface;
