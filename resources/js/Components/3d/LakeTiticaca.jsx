/**
 * @fileoverview Lake Titicaca 3D Scene - OPTIMIZED
 * @description Complete optimized 3D scene with Chullpas and adaptive quality
 *
 * Mejoras implementadas:
 * - Sistema de calidad adaptativa (detecta dispositivo)
 * - InstancedMesh para TotoraReeds (230→2 draw calls)
 * - Chullpas de Sillustani autenticas
 * - Balsas de totora mejoradas
 * - Fallback robusto para dispositivos sin WebGL
 */

import { Suspense, useMemo, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Preload } from '@react-three/drei';
import { WaterSurface } from './WaterSurface';
import { Mountains } from './Mountains';
import { TotoraReeds } from './TotoraReeds';
import { TotoraRaft } from './TotoraRaft';
import { Chullpa } from './Chullpa';
import { Stars, BrightStars } from './Stars';
import { CameraRig } from './CameraRig';
import { useAdaptiveQuality } from './hooks/useDevicePerformance';

/**
 * Fallback mientras carga la escena 3D
 */
function LoadingFallback() {
  return (
    <mesh>
      <planeGeometry args={[200, 200]} />
      <meshBasicMaterial color="#0a0a1a" />
    </mesh>
  );
}

/**
 * Fallback estatico para dispositivos sin WebGL
 */
function StaticFallback() {
  return (
    <div
      className="absolute inset-0 -z-10"
      style={{
        background: 'linear-gradient(to bottom, #0a0a1a 0%, #1a1a3e 40%, #0a4f6d 70%, #0077be 100%)',
      }}
    >
      {/* Silueta de montanas CSS */}
      <svg
        className="absolute bottom-1/3 left-0 w-full h-1/3 opacity-60"
        viewBox="0 0 100 30"
        preserveAspectRatio="none"
      >
        <path
          d="M0,30 L10,20 L20,25 L35,10 L45,18 L55,8 L65,15 L80,12 L90,22 L100,18 L100,30 Z"
          fill="#0f0f2a"
        />
      </svg>
      {/* Overlay para profundidad */}
      <div className="absolute inset-0 bg-gradient-to-t from-blue-900/30 to-transparent" />
    </div>
  );
}

/**
 * Contenido de la escena 3D
 */
function SceneContent({ settings, performance }) {
  return (
    <>
      {/* Fondo y atmosfera */}
      <color attach="background" args={['#0a0a1a']} />
      <fog attach="fog" args={['#1a1a3e', 15, 80]} />

      {/* Iluminacion */}
      <ambientLight intensity={0.3} />
      <directionalLight
        position={[15, 25, 10]}
        intensity={0.8}
        color="#ffeedd"
        castShadow={settings.shadows}
      />
      <pointLight position={[-10, 10, -10]} intensity={0.3} color="#8888ff" />
      {/* Luz de luna/sol en el horizonte */}
      <pointLight position={[0, 5, -30]} intensity={0.5} color="#ffd4aa" />

      {/* Parallax Camera Rig */}
      <CameraRig intensity={0.8}>
        {/* Estrellas en el cielo */}
        <Stars count={settings.starCount} />
        {performance !== 'low' && <BrightStars count={settings.brightStarCount} />}

        {/* Montanas al fondo */}
        <Mountains />

        {/* === CHULLPAS DE SILLUSTANI === */}
        {/* Chullpa principal (alta, completa) */}
        <Chullpa
          position={[-9, 0.8, -18]}
          scale={1.1}
          variant="tall"
          showLizard={true}
          rotation={[0, 0.25, 0]}
        />

        {/* Segunda chullpa (mediana) */}
        {settings.chullpaCount >= 2 && (
          <Chullpa
            position={[-5.5, 0.5, -21]}
            scale={0.85}
            variant="medium"
            showLizard={false}
            rotation={[0, -0.15, 0]}
          />
        )}

        {/* Tercera chullpa (en ruinas, solo en high quality) */}
        {settings.chullpaCount >= 3 && (
          <Chullpa
            position={[-12, 0.4, -15]}
            scale={0.7}
            variant="ruined"
            rotation={[0, 0.5, 0]}
          />
        )}

        {/* Agua del lago */}
        <WaterSurface />

        {/* Totoras (juncos) - OPTIMIZADO con InstancedMesh */}
        <TotoraReeds quality={settings.reedQuality} />

        {/* Balsas de totora - MEJORADAS */}
        <TotoraRaft position={[4, 0, 5]} scale={0.8} variant="passenger" withDecoration={true} />
        <TotoraRaft position={[-6, 0, 8]} scale={0.6} variant="cargo" withDecoration={false} />
      </CameraRig>

      {/* Precargar assets */}
      <Preload all />
    </>
  );
}

/**
 * LakeTiticaca - Componente principal del lago 3D
 * Con deteccion de rendimiento adaptativa
 */
export function LakeTiticaca() {
  const [hasWebGL, setHasWebGL] = useState(true);
  const { performance, settings } = useAdaptiveQuality();

  // Verificar soporte WebGL al montar
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      setHasWebGL(!!gl);
    } catch (e) {
      setHasWebGL(false);
    }
  }, []);

  // Fallback para dispositivos sin WebGL
  if (!hasWebGL) {
    return <StaticFallback />;
  }

  return (
    <div className="absolute inset-0 -z-10">
      <Canvas
        camera={{
          position: [0, 4, 14],
          fov: 50,
          near: 0.5,
          far: 150,
        }}
        dpr={settings.dpr}
        gl={{
          antialias: settings.antialias,
          alpha: true,
          powerPreference: settings.powerPreference,
          failIfMajorPerformanceCaveat: false,
        }}
        style={{ background: 'transparent' }}
        flat={performance === 'low'}
      >
        <Suspense fallback={<LoadingFallback />}>
          <SceneContent settings={settings} performance={performance} />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default LakeTiticaca;
