import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { NEON_COLORS } from '@/lib/constants';

interface DroneProps {
  startPosition: [number, number, number];
  path: 'circle' | 'line';
}

export function Drone({ startPosition, path }: DroneProps) {
  const droneRef = useRef<THREE.Group>(null);
  const trailRef = useRef<THREE.Line>(null);
  
  // Pre-calculate random offset for path variation
  const pathOffset = useMemo(() => Math.random() * Math.PI * 2, []);
  const speed = useMemo(() => 0.2 + Math.random() * 0.3, []);
  const radius = useMemo(() => 10 + Math.random() * 15, []);
  
  useFrame(({ clock }) => {
    if (droneRef.current) {
      const time = clock.getElapsedTime() * speed + pathOffset;
      
      if (path === 'circle') {
        droneRef.current.position.x = startPosition[0] + Math.cos(time) * radius;
        droneRef.current.position.z = startPosition[2] + Math.sin(time) * radius;
        droneRef.current.position.y = startPosition[1] + Math.sin(time * 0.5) * 3;
      } else {
        droneRef.current.position.x = startPosition[0] + Math.sin(time) * 20;
        droneRef.current.position.z = startPosition[2];
        droneRef.current.position.y = startPosition[1] + Math.cos(time * 0.8) * 2;
      }
      
      // Rotate drone
      droneRef.current.rotation.y = time * 2;
    }
  });
  
  return (
    <group ref={droneRef}>
      {/* Drone body */}
      <mesh>
        <boxGeometry args={[0.8, 0.3, 0.8]} />
        <meshStandardMaterial
          color="#333333"
          emissive={NEON_COLORS.cyan}
          emissiveIntensity={0.5}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
      
      {/* Propellers */}
      {[[-0.5, 0, -0.5], [0.5, 0, -0.5], [-0.5, 0, 0.5], [0.5, 0, 0.5]].map((pos, i) => (
        <group key={i} position={pos as [number, number, number]}>
          <mesh rotation={[0, 0, 0]}>
            <cylinderGeometry args={[0.3, 0.3, 0.05, 8]} />
            <meshStandardMaterial
              color={NEON_COLORS.magenta}
              emissive={NEON_COLORS.magenta}
              emissiveIntensity={1}
              transparent
              opacity={0.6}
            />
          </mesh>
        </group>
      ))}
      
      {/* Light */}
      <pointLight
        color={NEON_COLORS.cyan}
        intensity={5}
        distance={10}
      />
    </group>
  );
}
