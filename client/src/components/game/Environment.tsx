import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { GAME_CONFIG, NEON_COLORS } from '@/lib/constants';

export function Environment() {
  const fogRef = useRef<THREE.Fog>();
  
  return (
    <>
      {/* Fog for atmosphere */}
      <fog
        ref={fogRef as any}
        attach="fog"
        args={[GAME_CONFIG.FOG_COLOR, GAME_CONFIG.FOG_NEAR, GAME_CONFIG.FOG_FAR]}
      />
      
      {/* Cyberpunk sky dome */}
      <Sky />
      
      {/* Particle effects */}
      <FloatingParticles />
    </>
  );
}

function Sky() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.01;
    }
  });
  
  return (
    <mesh ref={meshRef} scale={[500, 500, 500]}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshBasicMaterial
        side={THREE.BackSide}
        color="#0a0a1a"
        transparent
        opacity={0.9}
      />
    </mesh>
  );
}

function FloatingParticles() {
  const particlesRef = useRef<THREE.Points>(null);
  
  const { positions, colors } = useMemo(() => {
    const count = 500;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    const neonColorArray = Object.values(NEON_COLORS);
    
    for (let i = 0; i < count; i++) {
      // Random positions within city bounds
      positions[i * 3] = (Math.random() - 0.5) * 100;
      positions[i * 3 + 1] = Math.random() * 50;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 100;
      
      // Random neon colors
      const colorHex = neonColorArray[Math.floor(Math.random() * neonColorArray.length)];
      const color = new THREE.Color(colorHex);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    
    return { positions, colors };
  }, []);
  
  useFrame(({ clock }) => {
    if (particlesRef.current) {
      const time = clock.getElapsedTime();
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] = Math.sin(time * 0.5 + i) * 2 + positions[i + 1];
      }
      
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });
  
  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        vertexColors
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
