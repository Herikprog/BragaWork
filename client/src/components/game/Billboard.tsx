import { useRef, useState } from 'react';
import { useFrame, ThreeEvent } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { NEON_COLORS, Project } from '@/lib/constants';
import { usePortfolio } from '@/lib/stores/usePortfolio';

interface BillboardProps {
  project: Project;
}

export function Billboard({ project }: BillboardProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const [isHovered, setIsHovered] = useState(false);
  const setHoveredBillboard = usePortfolio((state) => state.setHoveredBillboard);
  
  // Animate billboard
  useFrame(({ clock }) => {
    if (meshRef.current) {
      const time = clock.getElapsedTime();
      
      if (isHovered && glowRef.current) {
        // Pulsing glow effect when hovered
        const pulse = Math.sin(time * 5) * 0.3 + 0.7;
        glowRef.current.scale.set(pulse, pulse, 1);
      }
    }
  });
  
  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setIsHovered(true);
    setHoveredBillboard(project.id);
    document.body.style.cursor = 'pointer';
  };
  
  const handlePointerOut = () => {
    setIsHovered(false);
    setHoveredBillboard(null);
    document.body.style.cursor = 'auto';
  };
  
  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    window.open(project.url, '_blank');
  };
  
  return (
    <group position={project.position}>
      {/* Billboard frame */}
      <mesh
        ref={meshRef}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
      >
        <boxGeometry args={[8, 6, 0.2]} />
        <meshStandardMaterial
          color={isHovered ? NEON_COLORS.magenta : '#1a1a2e'}
          emissive={isHovered ? NEON_COLORS.magenta : NEON_COLORS.cyan}
          emissiveIntensity={isHovered ? 0.8 : 0.3}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      
      {/* Glow effect */}
      <mesh ref={glowRef} position={[0, 0, -0.15]}>
        <planeGeometry args={[8.5, 6.5]} />
        <meshBasicMaterial
          color={NEON_COLORS.cyan}
          transparent
          opacity={isHovered ? 0.4 : 0.2}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      {/* Project title */}
      <Text
        position={[0, 1.5, 0.15]}
        fontSize={0.6}
        color={NEON_COLORS.cyan}
        anchorX="center"
        anchorY="middle"
        maxWidth={7}
        font="/fonts/inter.json"
      >
        {project.title}
      </Text>
      
      {/* Project description */}
      <Text
        position={[0, 0.5, 0.15]}
        fontSize={0.3}
        color="#ffffff"}
        anchorX="center"
        anchorY="middle"
        maxWidth={7}
        font="/fonts/inter.json"
      >
        {project.description}
      </Text>
      
      {/* Click to view text */}
      <Text
        position={[0, -1.5, 0.15]}
        fontSize={0.25}
        color={isHovered ? NEON_COLORS.green : '#888888'}
        anchorX="center"
        anchorY="middle"
        font="/fonts/inter.json"
      >
        {isHovered ? '▶ CLICK TO VIEW' : 'Hover to interact'}
      </Text>
      
      {/* Support pole */}
      <mesh position={[0, -5, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 8, 8]} />
        <meshStandardMaterial
          color="#333333"
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
    </group>
  );
}
