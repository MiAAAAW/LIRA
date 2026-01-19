/**
 * @fileoverview Totora Reeds Component - OPTIMIZED
 * @description Animated reeds using InstancedMesh for performance
 * Reduces draw calls from ~230 to 2
 */

import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Configuracion de clusters de totoras
const REED_CLUSTERS = [
  // Grupo izquierdo frontal
  { center: [-10, 0, 6], count: 25, spread: 3 },
  { center: [-8, 0, 8], count: 20, spread: 2.5 },
  // Grupo derecho frontal
  { center: [9, 0, 5], count: 22, spread: 2.8 },
  { center: [11, 0, 7], count: 18, spread: 2 },
  // Grupo izquierdo medio
  { center: [-12, 0, 2], count: 15, spread: 2 },
  // Grupo derecho medio
  { center: [13, 0, 3], count: 15, spread: 2 },
];

/**
 * Genera datos de todas las instancias de totoras
 */
function generateReedInstances(quality = 'high') {
  const instances = [];
  const qualityMultiplier = quality === 'high' ? 1 : quality === 'medium' ? 0.7 : 0.5;

  REED_CLUSTERS.forEach((cluster) => {
    const adjustedCount = Math.floor(cluster.count * qualityMultiplier);
    for (let i = 0; i < adjustedCount; i++) {
      instances.push({
        position: new THREE.Vector3(
          cluster.center[0] + (Math.random() - 0.5) * cluster.spread,
          cluster.center[1],
          cluster.center[2] + (Math.random() - 0.5) * cluster.spread
        ),
        height: 1.2 + Math.random() * 1.8,
        delay: Math.random() * 10,
        baseRotation: Math.random() * Math.PI * 2,
      });
    }
  });

  return instances;
}

/**
 * TotoraReeds - Optimizado con InstancedMesh
 *
 * Performance: ~230 draw calls -> 2 draw calls
 *
 * @param {Object} props
 * @param {'high' | 'medium' | 'low'} props.quality - Nivel de calidad
 */
export function TotoraReeds({ quality = 'high' }) {
  const stemRef = useRef();
  const tipRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Generar datos de instancias (memoizado)
  const reedData = useMemo(() => generateReedInstances(quality), [quality]);
  const instanceCount = reedData.length;

  // Datos de animacion pre-calculados
  const animData = useMemo(
    () => ({
      delays: Float32Array.from(reedData.map((r) => r.delay)),
      heights: Float32Array.from(reedData.map((r) => r.height)),
      baseRotations: Float32Array.from(reedData.map((r) => r.baseRotation)),
    }),
    [reedData]
  );

  // Geometrias compartidas (memoizadas)
  const stemGeometry = useMemo(() => {
    const segments = quality === 'high' ? 6 : quality === 'medium' ? 5 : 4;
    return new THREE.CylinderGeometry(0.015, 0.035, 2, segments);
  }, [quality]);

  const tipGeometry = useMemo(() => {
    const segments = quality === 'high' ? 4 : 3;
    return new THREE.CylinderGeometry(0.005, 0.015, 0.4, segments);
  }, [quality]);

  // Materiales compartidos
  const stemMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#2d4a3e',
        roughness: 0.8,
      }),
    []
  );

  const tipMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#3a5a4a',
        roughness: 0.85,
      }),
    []
  );

  // Configurar posiciones iniciales
  useEffect(() => {
    if (!stemRef.current || !tipRef.current) return;

    reedData.forEach((reed, i) => {
      const h = reed.height;

      // Tallo principal
      dummy.position.copy(reed.position);
      dummy.position.y += h / 2;
      dummy.scale.set(1, h / 2, 1);
      dummy.rotation.set(0, reed.baseRotation, 0);
      dummy.updateMatrix();
      stemRef.current.setMatrixAt(i, dummy.matrix);

      // Punta
      dummy.position.copy(reed.position);
      dummy.position.y += h + 0.15;
      dummy.scale.set(0.8, 0.5, 0.8);
      dummy.updateMatrix();
      tipRef.current.setMatrixAt(i, dummy.matrix);
    });

    stemRef.current.instanceMatrix.needsUpdate = true;
    tipRef.current.instanceMatrix.needsUpdate = true;
  }, [reedData, dummy]);

  // Animacion de viento (un solo useFrame para todas las instancias)
  useFrame((state) => {
    if (!stemRef.current || !tipRef.current) return;

    const time = state.clock.elapsedTime;

    // En calidad baja, animar menos frecuentemente
    if (quality === 'low' && Math.floor(time * 30) % 2 !== 0) return;

    for (let i = 0; i < instanceCount; i++) {
      const delay = animData.delays[i];
      const height = animData.heights[i];
      const baseRot = animData.baseRotations[i];
      const pos = reedData[i].position;
      const t = time + delay;

      // Rotaciones de viento
      const windZ = Math.sin(t * 1.2) * 0.12;
      const windX = Math.cos(t * 0.8) * 0.06;

      // Actualizar tallo
      dummy.position.set(pos.x, pos.y + height / 2, pos.z);
      dummy.scale.set(1, height / 2, 1);
      dummy.rotation.set(windX, baseRot, windZ);
      dummy.updateMatrix();
      stemRef.current.setMatrixAt(i, dummy.matrix);

      // Actualizar punta (con mas movimiento)
      const tipOffsetX = windZ * height * 0.3;
      const tipOffsetZ = windX * height * 0.2;
      dummy.position.set(pos.x + tipOffsetX, pos.y + height + 0.15, pos.z + tipOffsetZ);
      dummy.scale.set(0.8, 0.5, 0.8);
      dummy.rotation.set(windX * 1.5, baseRot, windZ * 1.5);
      dummy.updateMatrix();
      tipRef.current.setMatrixAt(i, dummy.matrix);
    }

    stemRef.current.instanceMatrix.needsUpdate = true;
    tipRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <group>
      {/* Tallos principales - InstancedMesh */}
      <instancedMesh
        ref={stemRef}
        args={[stemGeometry, stemMaterial, instanceCount]}
        frustumCulled={true}
      />

      {/* Puntas - InstancedMesh */}
      <instancedMesh
        ref={tipRef}
        args={[tipGeometry, tipMaterial, instanceCount]}
        frustumCulled={true}
      />
    </group>
  );
}

export default TotoraReeds;
