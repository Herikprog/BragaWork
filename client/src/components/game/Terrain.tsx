import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { GAME_CONFIG, NEON_COLORS } from '@/lib/constants';

export function Terrain() {
  const asphaltTexture = useTexture('/textures/asphalt.png');
  
  // Configure texture
  asphaltTexture.wrapS = asphaltTexture.wrapT = THREE.RepeatWrapping;
  asphaltTexture.repeat.set(20, 20);
  
  return (
    <group>
      {/* Main ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
        <planeGeometry args={[GAME_CONFIG.CITY_SIZE, GAME_CONFIG.CITY_SIZE]} />
        <meshStandardMaterial
          map={asphaltTexture}
          roughness={0.8}
          metalness={0.2}
          emissive={new THREE.Color(NEON_COLORS.cyan)}
          emissiveIntensity={0.05}
        />
      </mesh>
      
      {/* Street grid lines */}
      <StreetGrid />
    </group>
  );
}

function StreetGrid() {
  const streetPositions = [];
  const streetWidth = GAME_CONFIG.STREET_WIDTH;
  const citySize = GAME_CONFIG.CITY_SIZE;
  
  // Create street lines
  for (let i = -citySize / 2; i <= citySize / 2; i += 15) {
    // Horizontal streets
    streetPositions.push({
      position: [0, 0.01, i] as [number, number, number],
      rotation: [0, 0, 0] as [number, number, number],
      scale: [citySize, 0.1, streetWidth] as [number, number, number],
    });
    
    // Vertical streets
    streetPositions.push({
      position: [i, 0.01, 0] as [number, number, number],
      rotation: [0, 0, 0] as [number, number, number],
      scale: [streetWidth, 0.1, citySize] as [number, number, number],
    });
  }
  
  return (
    <group>
      {streetPositions.map((street, index) => (
        <mesh
          key={index}
          position={street.position}
          rotation={street.rotation}
          scale={street.scale}
        >
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial
            color={NEON_COLORS.cyan}
            emissive={NEON_COLORS.cyan}
            emissiveIntensity={0.3}
            transparent
            opacity={0.3}
          />
        </mesh>
      ))}
    </group>
  );
}
