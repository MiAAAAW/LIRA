/**
 * @fileoverview Mountains Component
 * @description Silhouette of Andes mountains for Lake Titicaca background
 */

import { useMemo } from 'react';
import * as THREE from 'three';

/**
 * Mountains - Silueta de los Andes
 * Crea múltiples capas de montañas con diferentes profundidades
 */
export function Mountains() {
  // Forma de montañas principal
  const mountainShape = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-60, 0);
    shape.lineTo(-50, 6);
    shape.lineTo(-45, 4);
    shape.lineTo(-38, 12);
    shape.lineTo(-30, 8);
    shape.lineTo(-22, 16); // Pico alto
    shape.lineTo(-15, 10);
    shape.lineTo(-8, 14);
    shape.lineTo(0, 9);
    shape.lineTo(8, 20); // Apu (montaña sagrada más alta)
    shape.lineTo(18, 12);
    shape.lineTo(25, 15);
    shape.lineTo(35, 8);
    shape.lineTo(45, 11);
    shape.lineTo(55, 5);
    shape.lineTo(60, 0);
    shape.lineTo(-60, 0);
    return shape;
  }, []);

  // Forma de montañas secundaria (más suave)
  const mountainShapeBack = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-70, 0);
    shape.lineTo(-55, 8);
    shape.lineTo(-40, 5);
    shape.lineTo(-25, 14);
    shape.lineTo(-10, 10);
    shape.lineTo(5, 18);
    shape.lineTo(20, 12);
    shape.lineTo(35, 16);
    shape.lineTo(50, 9);
    shape.lineTo(65, 6);
    shape.lineTo(70, 0);
    shape.lineTo(-70, 0);
    return shape;
  }, []);

  const extrudeSettings = {
    depth: 2,
    bevelEnabled: false,
  };

  return (
    <group position={[0, 0, -35]}>
      {/* Capa más lejana - más oscura */}
      <mesh position={[0, 0, -15]} scale={[1.2, 1.1, 1]}>
        <extrudeGeometry args={[mountainShapeBack, extrudeSettings]} />
        <meshStandardMaterial
          color="#080818"
          side={THREE.DoubleSide}
          flatShading
        />
      </mesh>

      {/* Capa media */}
      <mesh position={[-5, -1, -8]} scale={[1, 0.9, 1]}>
        <extrudeGeometry args={[mountainShape, extrudeSettings]} />
        <meshStandardMaterial
          color="#0f0f2a"
          side={THREE.DoubleSide}
          flatShading
        />
      </mesh>

      {/* Capa frontal - más clara */}
      <mesh position={[10, -2, 0]} scale={[0.9, 0.8, 1]}>
        <extrudeGeometry args={[mountainShape, extrudeSettings]} />
        <meshStandardMaterial
          color="#1a1a3e"
          side={THREE.DoubleSide}
          flatShading
        />
      </mesh>

      {/* Pico nevado destacado */}
      <mesh position={[8, 14, -5]}>
        <coneGeometry args={[3, 5, 4]} />
        <meshStandardMaterial color="#2a2a4e" flatShading />
      </mesh>
    </group>
  );
}

export default Mountains;
