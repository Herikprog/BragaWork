import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { NEON_COLORS } from '@/lib/constants';

export function Lighting() {
  const pointLightRefs = useRef<THREE.PointLight[]>([]);
  
  // Animated neon lights positions
  const neonLightPositions = useMemo(() => [
    { pos: [10, 5, -15] as [number, number, number], color: NEON_COLORS.cyan },
    { pos: [-15, 8, -10] as [number, number, number], color: NEON_COLORS.magenta },
    { pos: [20, 12, 5] as [number, number, number], color: NEON_COLORS.purple },
    { pos: [-25, 6, 15] as [number, number, number], color: NEON_COLORS.pink },
    { pos: [0, 15, -25] as [number, number, number], color: NEON_COLORS.blue },
    { pos: [30, 10, 10] as [number, number, number], color: NEON_COLORS.green },
  ], []);
  
  // Animate neon lights
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    pointLightRefs.current.forEach((light, index) => {
      if (light) {
        // Pulsing effect
        const pulse = Math.sin(time * 2 + index) * 0.5 + 0.5;
        light.intensity = 20 + pulse * 10;
      }
    });
  });
  
  return (
    <>
      {/* Ambient light for general illumination */}
      <ambientLight intensity={0.2} color="#1a1a2e" />
      
      {/* Main directional light (moon/artificial sky) */}
      <directionalLight
        position={[50, 100, 50]}
        intensity={0.3}
        color="#4a5a8a"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={200}
        shadow-camera-left={-50}
        shadow-camera-right={50}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
      />
      
      {/* Hemisphere light for sky/ground ambient */}
      <hemisphereLight
        args={['#7a00ff', '#00ff9f', 0.3]}
        position={[0, 50, 0]}
      />
      
      {/* Neon point lights around the city */}
      {neonLightPositions.map((light, index) => (
        <pointLight
          key={index}
          ref={(el) => {
            if (el) pointLightRefs.current[index] = el;
          }}
          position={light.pos}
          color={light.color}
          intensity={25}
          distance={30}
          decay={2}
          castShadow={index < 3} // Only first 3 cast shadows for performance
        />
      ))}
      
      {/* Ground reflection light */}
      <pointLight
        position={[0, 1, 0]}
        color={NEON_COLORS.cyan}
        intensity={5}
        distance={20}
        decay={2}
      />
    </>
  );
}
