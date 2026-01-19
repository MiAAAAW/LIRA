/**
 * @fileoverview Totora Raft Component - IMPROVED
 * @description Realistic traditional reed boat (balsa de totora) of Lake Titicaca
 */

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Colores de totora seca
const TOTORA_COLORS = {
  base: '#8B7355',
  light: '#9C8B6E',
  dark: '#7A6B4E',
  accent: '#A89070',
  decoration: '#5a4a3a',
};

/**
 * Bundle de totora enrollada (capa de la balsa)
 */
function TotoraBundle({
  length = 2,
  radius = 0.18,
  color = TOTORA_COLORS.base,
  position = [0, 0, 0],
}) {
  return (
    <mesh position={position} rotation={[0, 0, Math.PI / 2]}>
      <capsuleGeometry args={[radius, length, 8, 16]} />
      <meshStandardMaterial color={color} roughness={0.92} metalness={0.02} />
    </mesh>
  );
}

/**
 * Proa tradicional curva (caracteristica del Titicaca)
 */
function TraditionalProw({ side = 'front' }) {
  const curve = useMemo(() => {
    const points = [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0.3, 0.25),
      new THREE.Vector3(0, 0.55, 0.45),
    ];
    return new THREE.CatmullRomCurve3(points);
  }, []);

  const tubeGeometry = useMemo(() => {
    return new THREE.TubeGeometry(curve, 12, 0.1, 8, false);
  }, [curve]);

  const posZ = side === 'front' ? 1.05 : -0.95;
  const rotX = side === 'front' ? -0.25 : 0.25;

  return (
    <group position={[0, 0.12, posZ]} rotation={[rotX, 0, 0]}>
      <mesh geometry={tubeGeometry}>
        <meshStandardMaterial color={TOTORA_COLORS.base} roughness={0.9} />
      </mesh>
      {/* Punta decorativa */}
      <mesh position={[0, 0.5, 0.4]}>
        <sphereGeometry args={[0.07, 8, 8]} />
        <meshStandardMaterial color={TOTORA_COLORS.dark} roughness={0.95} />
      </mesh>
    </group>
  );
}

/**
 * Decoracion tradicional (mastil con bandera/wiphala)
 */
function TraditionalDecoration() {
  return (
    <group position={[0, 0.3, 0.15]}>
      {/* Mastil */}
      <mesh>
        <cylinderGeometry args={[0.012, 0.018, 0.65, 6]} />
        <meshStandardMaterial color={TOTORA_COLORS.decoration} />
      </mesh>

      {/* Bandera roja con detalle dorado (simplificada wiphala) */}
      <group position={[0.1, 0.22, 0]} rotation={[0, 0, 0.12]}>
        <mesh>
          <planeGeometry args={[0.22, 0.18]} />
          <meshStandardMaterial color="#cc3333" side={THREE.DoubleSide} />
        </mesh>
        {/* Franja dorada */}
        <mesh position={[0, 0, 0.001]}>
          <planeGeometry args={[0.07, 0.18]} />
          <meshStandardMaterial color="#f4c430" side={THREE.DoubleSide} />
        </mesh>
      </group>
    </group>
  );
}

/**
 * Remo tradicional
 */
function Paddle({ position, rotation }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Mango */}
      <mesh>
        <cylinderGeometry args={[0.01, 0.012, 1, 4]} />
        <meshStandardMaterial color="#5a4a3a" />
      </mesh>
      {/* Pala */}
      <mesh position={[0, -0.55, 0]}>
        <boxGeometry args={[0.12, 0.25, 0.015]} />
        <meshStandardMaterial color="#6a5a4a" />
      </mesh>
    </group>
  );
}

/**
 * TotoraRaft - Balsa de totora mejorada y realista
 *
 * @param {Object} props
 * @param {[number, number, number]} props.position - Posicion en la escena
 * @param {number} props.scale - Escala uniforme
 * @param {boolean} props.withDecoration - Incluir mastil y bandera
 * @param {'passenger' | 'cargo'} props.variant - Tipo de balsa
 */
export function TotoraRaft({
  position = [3, 0, 4],
  scale = 1,
  withDecoration = true,
  variant = 'passenger',
}) {
  const raftRef = useRef();

  // Animacion de flotacion realista
  useFrame((state) => {
    if (raftRef.current) {
      const time = state.clock.elapsedTime;
      // Flotacion vertical (olas)
      raftRef.current.position.y = Math.sin(time * 0.8) * 0.07 + 0.08;
      // Balanceo suave
      raftRef.current.rotation.z = Math.sin(time * 0.5) * 0.02;
      raftRef.current.rotation.x = Math.cos(time * 0.6) * 0.012;
    }
  });

  return (
    <group ref={raftRef} position={position} scale={scale}>
      {/* Capa inferior - 2 rollos grandes laterales (base) */}
      <TotoraBundle
        length={1.85}
        radius={0.19}
        color={TOTORA_COLORS.base}
        position={[-0.26, -0.06, 0]}
      />
      <TotoraBundle
        length={1.85}
        radius={0.19}
        color={TOTORA_COLORS.light}
        position={[0.26, -0.06, 0]}
      />

      {/* Capa media - rollo central */}
      <TotoraBundle
        length={1.65}
        radius={0.13}
        color={TOTORA_COLORS.dark}
        position={[0, 0.1, 0]}
      />

      {/* Capa superior - rollos finos laterales (dan forma de banana) */}
      <TotoraBundle
        length={1.45}
        radius={0.07}
        color={TOTORA_COLORS.accent}
        position={[-0.16, 0.2, 0]}
      />
      <TotoraBundle
        length={1.45}
        radius={0.07}
        color={TOTORA_COLORS.accent}
        position={[0.16, 0.2, 0]}
      />

      {/* Proas curvas caracteristicas */}
      <TraditionalProw side="front" />
      <TraditionalProw side="back" />

      {/* Plataforma para pasajeros (solo en variant passenger) */}
      {variant === 'passenger' && (
        <mesh position={[0, 0.22, 0]}>
          <boxGeometry args={[0.5, 0.04, 1]} />
          <meshStandardMaterial color={TOTORA_COLORS.light} roughness={0.95} />
        </mesh>
      )}

      {/* Decoracion tradicional */}
      {withDecoration && <TraditionalDecoration />}

      {/* Remo (solo en variant passenger) */}
      {variant === 'passenger' && (
        <Paddle position={[0.45, 0.1, 0.2]} rotation={[0.25, 0.4, 0.7]} />
      )}

      {/* Carga (solo en variant cargo) */}
      {variant === 'cargo' && (
        <>
          <mesh position={[0, 0.35, 0.1]}>
            <boxGeometry args={[0.35, 0.2, 0.5]} />
            <meshStandardMaterial color="#5a4535" roughness={0.95} />
          </mesh>
          <mesh position={[0, 0.32, -0.35]}>
            <boxGeometry args={[0.3, 0.15, 0.25]} />
            <meshStandardMaterial color="#4a3a2a" roughness={0.95} />
          </mesh>
        </>
      )}
    </group>
  );
}

export default TotoraRaft;
