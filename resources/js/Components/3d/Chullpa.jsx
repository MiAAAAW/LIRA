/**
 * @fileoverview Chullpa de Sillustani Component
 * @description Authentic pre-Inca funeral tower with procedural stone texture
 *
 * Arquitectura basada en investigacion:
 * - Forma: Cono invertido (base angosta, tope ancho)
 * - Material: Piedra granito/andesita (flatShading para efecto de bloques)
 * - Elementos: Cornisa superior, entrada ritual, decoracion de lagarto
 * - Variantes: tall (completa), medium (menor altura), ruined (deteriorada)
 */

import { useRef, useMemo } from 'react';
import * as THREE from 'three';

// Colores de piedra andina
const STONE_COLORS = {
  light: '#8B7355', // Granito claro
  medium: '#7A6B5E', // Andesita
  dark: '#5A4A3E', // Sombra/detalles
  hill: '#4A4A3A', // Colina base
  interior: '#1a1a1a', // Interior oscuro
};

/**
 * Geometria de cono invertido (caracteristica distintiva)
 * Base angosta, parte superior ancha
 */
function createChullpaGeometry(baseRadius, topRadius, height, segments = 16) {
  return new THREE.CylinderGeometry(topRadius, baseRadius, height, segments, 6, false);
}

/**
 * Cornisa superior - Reborde tipico del estilo Inca
 */
function Cornice({ radius = 1.2, thickness = 0.1 }) {
  return (
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[radius, thickness, 6, 24]} />
      <meshStandardMaterial color={STONE_COLORS.medium} roughness={0.95} flatShading />
    </mesh>
  );
}

/**
 * Entrada ritual - Pequena abertura orientada al este
 */
function RitualEntrance({ bodyRadius, height }) {
  const entranceHeight = height * 0.12;
  const entranceWidth = 0.2;
  const offset = bodyRadius * 0.92;

  return (
    <group position={[offset, -height * 0.25, 0]}>
      {/* Marco de piedra */}
      <mesh>
        <boxGeometry args={[0.08, entranceHeight + 0.06, entranceWidth + 0.06]} />
        <meshStandardMaterial color={STONE_COLORS.dark} roughness={1} flatShading />
      </mesh>
      {/* Hueco interior (oscuro) */}
      <mesh position={[0.02, 0, 0]}>
        <boxGeometry args={[0.12, entranceHeight, entranceWidth]} />
        <meshBasicMaterial color={STONE_COLORS.interior} />
      </mesh>
    </group>
  );
}

/**
 * Tallado de lagarto en bajo relieve
 * Los lagartos eran simbolo de regeneracion para los Collas
 */
function LizardCarving({ bodyRadius }) {
  const offset = bodyRadius * 0.88;

  return (
    <group position={[0, 0, offset]} scale={0.12}>
      {/* Cuerpo */}
      <mesh position={[0, 0, 0.02]}>
        <capsuleGeometry args={[0.12, 0.5, 4, 6]} />
        <meshStandardMaterial color={STONE_COLORS.dark} roughness={1} />
      </mesh>
      {/* Cabeza */}
      <mesh position={[0, 0.38, 0.02]}>
        <sphereGeometry args={[0.1, 6, 6]} />
        <meshStandardMaterial color={STONE_COLORS.dark} roughness={1} />
      </mesh>
      {/* Cola */}
      <mesh position={[0, -0.42, 0.02]} rotation={[0, 0, 0.15]}>
        <coneGeometry args={[0.06, 0.35, 4]} />
        <meshStandardMaterial color={STONE_COLORS.dark} roughness={1} />
      </mesh>
      {/* Patas (4) */}
      {[
        [-0.12, 0.15],
        [0.12, 0.15],
        [-0.12, -0.15],
        [0.12, -0.15],
      ].map(([x, y], i) => (
        <mesh key={i} position={[x, y, 0.02]} rotation={[0, 0, x > 0 ? -0.4 : 0.4]}>
          <capsuleGeometry args={[0.025, 0.12, 3, 4]} />
          <meshStandardMaterial color={STONE_COLORS.dark} roughness={1} />
        </mesh>
      ))}
    </group>
  );
}

/**
 * Base de colina/promontorio
 * Las chullpas se construian en elevaciones
 */
function HillBase({ radius = 2.5, height = 1 }) {
  const geometry = useMemo(() => {
    const geo = new THREE.ConeGeometry(radius, height, 10, 3);

    // Deformar vertices para apariencia natural de colina
    const positions = geo.attributes.position;
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const y = positions.getY(i);
      const z = positions.getZ(i);

      // Añadir variacion excepto en la base
      if (y > -height / 2 + 0.1) {
        positions.setX(i, x + (Math.random() - 0.5) * 0.25);
        positions.setZ(i, z + (Math.random() - 0.5) * 0.25);
      }
    }

    geo.computeVertexNormals();
    return geo;
  }, [radius, height]);

  return (
    <mesh geometry={geometry} position={[0, -height / 2, 0]}>
      <meshStandardMaterial color={STONE_COLORS.hill} roughness={1} flatShading />
    </mesh>
  );
}

/**
 * Piedras caidas (para variante ruined)
 */
function FallenStones() {
  const stones = useMemo(
    () => [
      { pos: [1.1, 0.08, 0.4], rot: [0.3, 0.5, 0.2], size: [0.35, 0.25, 0.3] },
      { pos: [-0.7, 0.05, 0.7], rot: [0.1, -0.3, 0.1], size: [0.3, 0.2, 0.25] },
      { pos: [0.5, 0.04, -0.6], rot: [-0.1, 0.4, 0.2], size: [0.25, 0.18, 0.22] },
    ],
    []
  );

  return (
    <group>
      {stones.map((stone, i) => (
        <mesh key={i} position={stone.pos} rotation={stone.rot}>
          <boxGeometry args={stone.size} />
          <meshStandardMaterial
            color={i % 2 === 0 ? STONE_COLORS.medium : STONE_COLORS.light}
            roughness={1}
            flatShading
          />
        </mesh>
      ))}
    </group>
  );
}

/**
 * Chullpa - Torre funeraria completa de Sillustani
 *
 * @param {Object} props
 * @param {[number, number, number]} props.position - Posicion en la escena
 * @param {number} props.scale - Escala uniforme
 * @param {boolean} props.showLizard - Mostrar decoracion de lagarto
 * @param {'tall' | 'medium' | 'ruined'} props.variant - Estado de conservacion
 * @param {[number, number, number]} props.rotation - Rotacion
 */
export function Chullpa({
  position = [0, 0, 0],
  scale = 1,
  showLizard = true,
  variant = 'tall',
  rotation = [0, 0, 0],
}) {
  const groupRef = useRef();

  // Configuracion segun variante
  const config = useMemo(() => {
    const variants = {
      tall: {
        height: 3.2,
        baseRadius: 0.65,
        topRadius: 1.0,
        color: STONE_COLORS.light,
        hillRadius: 2.2,
        hillHeight: 0.9,
      },
      medium: {
        height: 2.3,
        baseRadius: 0.55,
        topRadius: 0.85,
        color: STONE_COLORS.medium,
        hillRadius: 1.8,
        hillHeight: 0.7,
      },
      ruined: {
        height: 1.6,
        baseRadius: 0.6,
        topRadius: 0.9,
        color: STONE_COLORS.medium,
        hillRadius: 2.0,
        hillHeight: 0.8,
      },
    };
    return variants[variant] || variants.tall;
  }, [variant]);

  // Geometria del cuerpo principal (memoizada)
  const bodyGeometry = useMemo(
    () => createChullpaGeometry(config.baseRadius, config.topRadius, config.height, 14),
    [config]
  );

  return (
    <group ref={groupRef} position={position} scale={scale} rotation={rotation}>
      {/* Base de colina */}
      <HillBase radius={config.hillRadius} height={config.hillHeight} />

      {/* Cuerpo principal de la Chullpa */}
      <mesh geometry={bodyGeometry} position={[0, config.height / 2 + 0.25, 0]}>
        <meshStandardMaterial color={config.color} roughness={0.95} flatShading />
      </mesh>

      {/* Cornisa superior (solo si no esta en ruinas) */}
      {variant !== 'ruined' && (
        <group position={[0, config.height + 0.3, 0]}>
          <Cornice radius={config.topRadius + 0.12} thickness={0.1} />
        </group>
      )}

      {/* Entrada ritual */}
      <group position={[0, config.height / 2 + 0.25, 0]}>
        <RitualEntrance bodyRadius={config.topRadius * 0.95} height={config.height} />
      </group>

      {/* Tallado de lagarto (opcional, solo en variante tall) */}
      {showLizard && variant === 'tall' && (
        <group position={[0, config.height * 0.6, 0]}>
          <LizardCarving bodyRadius={config.topRadius * 0.95} />
        </group>
      )}

      {/* Piedras caidas (solo en variante ruined) */}
      {variant === 'ruined' && <FallenStones />}

      {/* Tapa superior (piedra plana en la cima) */}
      {variant !== 'ruined' && (
        <mesh position={[0, config.height + 0.35, 0]}>
          <cylinderGeometry args={[config.topRadius * 0.9, config.topRadius * 0.95, 0.12, 12]} />
          <meshStandardMaterial color={STONE_COLORS.dark} roughness={1} flatShading />
        </mesh>
      )}
    </group>
  );
}

export default Chullpa;
