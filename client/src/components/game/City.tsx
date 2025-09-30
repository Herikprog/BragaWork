import { useMemo } from 'react';
import { Building } from './Building';
import { Billboard } from './Billboard';
import { Drone } from './Drone';
import { Terrain } from './Terrain';
import { GAME_CONFIG, PROJECTS, NEON_COLORS } from '@/lib/constants';
import * as THREE from 'three';

export function City() {
  // Pre-calculate building positions and sizes
  const buildings = useMemo(() => {
    const buildingData = [];
    const citySize = GAME_CONFIG.CITY_SIZE;
    const streetWidth = GAME_CONFIG.STREET_WIDTH;
    const colors = Object.values(NEON_COLORS);
    
    for (let i = 0; i < GAME_CONFIG.BUILDING_COUNT; i++) {
      const width = 4 + Math.random() * 6;
      const height = 10 + Math.random() * 30;
      const depth = 4 + Math.random() * 6;
      
      // Random position avoiding center streets
      let x, z;
      do {
        x = (Math.random() - 0.5) * citySize * 0.8;
        z = (Math.random() - 0.5) * citySize * 0.8;
      } while (
        (Math.abs(x) < streetWidth * 2 && Math.abs(z) < streetWidth * 2) ||
        buildingData.some(b => {
          const dist = Math.sqrt((b.position[0] - x) ** 2 + (b.position[2] - z) ** 2);
          return dist < (b.width + width) / 2 + 2;
        })
      );
      
      buildingData.push({
        position: [x, height / 2, z] as [number, number, number],
        width,
        height,
        depth,
        color: colors[Math.floor(Math.random() * colors.length)],
        boundingBox: {
          min: new THREE.Vector3(x - width / 2, 0, z - depth / 2),
          max: new THREE.Vector3(x + width / 2, height, z + depth / 2),
        },
      });
    }
    
    return buildingData;
  }, []);
  
  // Pre-calculate drone paths
  const drones = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => ({
      key: `drone-${i}`,
      startPosition: [
        (Math.random() - 0.5) * 60,
        15 + Math.random() * 20,
        (Math.random() - 0.5) * 60,
      ] as [number, number, number],
      path: (i % 2 === 0 ? 'circle' : 'line') as 'circle' | 'line',
    }));
  }, []);
  
  return (
    <group>
      {/* Terrain */}
      <Terrain />
      
      {/* Buildings */}
      {buildings.map((building, index) => (
        <Building
          key={`building-${index}`}
          position={building.position}
          width={building.width}
          height={building.height}
          depth={building.depth}
          color={building.color}
        />
      ))}
      
      {/* Project Billboards */}
      {PROJECTS.map((project) => (
        <Billboard key={project.id} project={project} />
      ))}
      
      {/* Drones */}
      {drones.map((drone) => (
        <Drone
          key={drone.key}
          startPosition={drone.startPosition}
          path={drone.path}
        />
      ))}
    </group>
  );
}

// Export buildings for collision detection
export function useCityCollisions() {
  return useMemo(() => {
    const buildingData = [];
    const citySize = GAME_CONFIG.CITY_SIZE;
    const streetWidth = GAME_CONFIG.STREET_WIDTH;
    
    for (let i = 0; i < GAME_CONFIG.BUILDING_COUNT; i++) {
      const width = 4 + Math.random() * 6;
      const height = 10 + Math.random() * 30;
      const depth = 4 + Math.random() * 6;
      
      let x, z;
      do {
        x = (Math.random() - 0.5) * citySize * 0.8;
        z = (Math.random() - 0.5) * citySize * 0.8;
      } while (
        (Math.abs(x) < streetWidth * 2 && Math.abs(z) < streetWidth * 2) ||
        buildingData.some(b => {
          const dist = Math.sqrt((b.position[0] - x) ** 2 + (b.position[2] - z) ** 2);
          return dist < (b.width + width) / 2 + 2;
        })
      );
      
      buildingData.push({
        position: [x, height / 2, z] as [number, number, number],
        width,
        height,
        depth,
        boundingBox: {
          min: new THREE.Vector3(x - width / 2, 0, z - depth / 2),
          max: new THREE.Vector3(x + width / 2, height, z + depth / 2),
        },
      });
    }
    
    return buildingData;
  }, []);
}
