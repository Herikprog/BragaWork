import * as THREE from 'three';
import { GAME_CONFIG } from './constants';

// Simple AABB collision detection
export interface BoundingBox {
  min: THREE.Vector3;
  max: THREE.Vector3;
}

export function createBoundingBox(position: THREE.Vector3, size: THREE.Vector3): BoundingBox {
  return {
    min: new THREE.Vector3(
      position.x - size.x / 2,
      position.y - size.y / 2,
      position.z - size.z / 2
    ),
    max: new THREE.Vector3(
      position.x + size.x / 2,
      position.y + size.y / 2,
      position.z + size.z / 2
    ),
  };
}

export function checkAABBCollision(box1: BoundingBox, box2: BoundingBox): boolean {
  return (
    box1.min.x <= box2.max.x &&
    box1.max.x >= box2.min.x &&
    box1.min.y <= box2.max.y &&
    box1.max.y >= box2.min.y &&
    box1.min.z <= box2.max.z &&
    box1.max.z >= box2.min.z
  );
}

export function resolveCollision(
  playerPos: THREE.Vector3,
  playerBox: BoundingBox,
  obstacleBox: BoundingBox
): THREE.Vector3 {
  const newPos = playerPos.clone();
  
  // Calculate overlap on each axis
  const overlapX = Math.min(
    playerBox.max.x - obstacleBox.min.x,
    obstacleBox.max.x - playerBox.min.x
  );
  const overlapZ = Math.min(
    playerBox.max.z - obstacleBox.min.z,
    obstacleBox.max.z - playerBox.min.z
  );
  
  // Resolve on the axis with smallest overlap
  if (overlapX < overlapZ) {
    if (playerPos.x < obstacleBox.min.x) {
      newPos.x = obstacleBox.min.x - GAME_CONFIG.PLAYER_RADIUS;
    } else {
      newPos.x = obstacleBox.max.x + GAME_CONFIG.PLAYER_RADIUS;
    }
  } else {
    if (playerPos.z < obstacleBox.min.z) {
      newPos.z = obstacleBox.min.z - GAME_CONFIG.PLAYER_RADIUS;
    } else {
      newPos.z = obstacleBox.max.z + GAME_CONFIG.PLAYER_RADIUS;
    }
  }
  
  return newPos;
}

// Check if player is on ground
export function isOnGround(playerY: number, groundY: number = 0): boolean {
  return Math.abs(playerY - groundY) < 0.1;
}
