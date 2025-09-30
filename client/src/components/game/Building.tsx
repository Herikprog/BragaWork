import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { NEON_COLORS } from '@/lib/constants';

interface BuildingProps {
  position: [number, number, number];
  width: number;
  height: number;
  depth: number;
  color: string;
}

export function Building({ position, width, height, depth, color }: BuildingProps) {
  const buildingRef = useRef<THREE.Mesh>(null);
  const windowsRef = useRef<THREE.InstancedMesh>(null);
  
  // Pre-calculate window positions
  const windowPositions = useMemo(() => {
    const positions: Array<[number, number, number]> = [];
    const floors = Math.floor(height / 3);
    const windowsPerFloor = Math.max(2, Math.floor(width / 2));
    
    for (let floor = 0; floor < floors; floor++) {
      for (let w = 0; w < windowsPerFloor; w++) {
        const x = (w - windowsPerFloor / 2) * 1.5 + 0.75;
        const y = floor * 3 + 1.5;
        positions.push([x, y, depth / 2 + 0.01]);
        positions.push([x, y, -depth / 2 - 0.01]);
      }
    }
    
    return positions;
  }, [width, height, depth]);
  
  // Animate windows
  useFrame(({ clock }) => {
    if (windowsRef.current) {
      const time = clock.getElapsedTime();
      const matrix = new THREE.Matrix4();
      
      windowPositions.forEach((pos, index) => {
        matrix.setPosition(pos[0], pos[1], pos[2]);
        windowsRef.current!.setMatrixAt(index, matrix);
        
        // Random flickering
        const flicker = Math.sin(time * 10 + index) > 0.7 ? 1 : 0.3;
        const instanceColor = new THREE.Color(NEON_COLORS.cyan);
        windowsRef.current!.setColorAt(index, instanceColor.multiplyScalar(flicker));
      });
      
      windowsRef.current.instanceMatrix.needsUpdate = true;
      if (windowsRef.current.instanceColor) {
        windowsRef.current.instanceColor.needsUpdate = true;
      }
    }
  });
  
  return (
    <group position={position}>
      {/* Main building structure */}
      <mesh ref={buildingRef} castShadow receiveShadow>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial
          color={color}
          roughness={0.7}
          metalness={0.3}
          emissive={color}
          emissiveIntensity={0.1}
        />
      </mesh>
      
      {/* Windows */}
      <instancedMesh
        ref={windowsRef}
        args={[undefined, undefined, windowPositions.length]}
        castShadow={false}
      >
        <boxGeometry args={[0.8, 1, 0.1]} />
        <meshStandardMaterial
          color={NEON_COLORS.cyan}
          emissive={NEON_COLORS.cyan}
          emissiveIntensity={1}
          toneMapped={false}
        />
      </instancedMesh>
      
      {/* Neon trim on top */}
      <mesh position={[0, height / 2 + 0.2, 0]}>
        <boxGeometry args={[width + 0.2, 0.3, depth + 0.2]} />
        <meshStandardMaterial
          color={NEON_COLORS.magenta}
          emissive={NEON_COLORS.magenta}
          emissiveIntensity={2}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}
