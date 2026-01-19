/**
 * @fileoverview useDevicePerformance Hook
 * @description Detects device performance level for adaptive 3D quality
 */

import { useState, useEffect, useMemo } from 'react';

/**
 * Detecta el nivel de rendimiento del dispositivo
 * @returns {'high' | 'medium' | 'low'} Nivel de performance
 */
export function useDevicePerformance() {
  const [performance, setPerformance] = useState('medium');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkPerformance = () => {
      let score = 0;

      // 1. Memoria del dispositivo (GB)
      const memory = navigator.deviceMemory || 4;
      if (memory >= 8) score += 2;
      else if (memory >= 4) score += 1;

      // 2. Nucleos de CPU
      const cores = navigator.hardwareConcurrency || 4;
      if (cores >= 8) score += 2;
      else if (cores >= 4) score += 1;

      // 3. Deteccion de movil
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
      if (!isMobile) score += 1;

      // 4. Detectar GPU via WebGL
      try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (gl) {
          const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
          if (debugInfo) {
            const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL).toLowerCase();

            // GPUs de alto rendimiento
            if (renderer.includes('nvidia') || renderer.includes('radeon') || renderer.includes('geforce')) {
              score += 2;
            }
            // GPUs integradas de gama media
            else if (renderer.includes('iris') || renderer.includes('apple')) {
              score += 1;
            }
            // GPUs de bajo rendimiento
            else if (renderer.includes('intel hd') || renderer.includes('mali') || renderer.includes('adreno 3')) {
              score += 0;
            }
          }
        }
      } catch (e) {
        console.warn('WebGL detection failed:', e);
      }

      // 5. Connection type (si esta disponible)
      if (navigator.connection) {
        const connection = navigator.connection;
        if (connection.saveData) {
          score -= 1; // Usuario quiere ahorrar datos
        }
        if (connection.effectiveType === '4g') {
          score += 1;
        }
      }

      // Determinar nivel final
      if (score >= 6) {
        setPerformance('high');
      } else if (score >= 3) {
        setPerformance('medium');
      } else {
        setPerformance('low');
      }
    };

    checkPerformance();
  }, []);

  return performance;
}

/**
 * Configuracion de calidad basada en nivel de rendimiento
 * @param {'high' | 'medium' | 'low'} performance - Nivel de rendimiento
 * @returns {Object} Configuracion de calidad
 */
export function getQualitySettings(performance) {
  const settings = {
    high: {
      dpr: [1, 2],
      shadows: true,
      antialias: true,
      reedQuality: 'high',
      starCount: 600,
      brightStarCount: 30,
      waterSegments: 32,
      chullpaCount: 3,
      frameloop: 'always',
      powerPreference: 'high-performance',
    },
    medium: {
      dpr: [1, 1.5],
      shadows: false,
      antialias: true,
      reedQuality: 'medium',
      starCount: 400,
      brightStarCount: 20,
      waterSegments: 24,
      chullpaCount: 2,
      frameloop: 'always',
      powerPreference: 'default',
    },
    low: {
      dpr: [0.75, 1],
      shadows: false,
      antialias: false,
      reedQuality: 'low',
      starCount: 200,
      brightStarCount: 10,
      waterSegments: 16,
      chullpaCount: 1,
      frameloop: 'always', // 'demand' causa problemas con animaciones
      powerPreference: 'low-power',
    },
  };

  return settings[performance] || settings.medium;
}

/**
 * Hook combinado que retorna tanto el nivel como la configuracion
 */
export function useAdaptiveQuality() {
  const performance = useDevicePerformance();
  const settings = useMemo(() => getQualitySettings(performance), [performance]);

  return { performance, settings };
}

export default useDevicePerformance;
