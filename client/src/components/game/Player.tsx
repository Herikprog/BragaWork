import { useRef, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useKeyboardControls, PointerLockControls as PointerLockControlsImpl } from '@react-three/drei';
import * as THREE from 'three';
import { GAME_CONFIG } from '@/lib/constants';
import { usePortfolio } from '@/lib/stores/usePortfolio';
import { createBoundingBox, checkAABBCollision, resolveCollision, isOnGround } from '@/lib/physics';
import { useCityCollisions } from './City';

enum Controls {
  forward = 'forward',
  backward = 'backward',
  left = 'left',
  right = 'right',
  run = 'run',
  jump = 'jump',
}

export function Player() {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);
  const [, getKeys] = useKeyboardControls<Controls>();
  
  const setPlayerPosition = usePortfolio((state) => state.setPlayerPosition);
  const setPointerLocked = usePortfolio((state) => state.setPointerLocked);
  const phase = usePortfolio((state) => state.phase);
  
  const velocityRef = useRef(new THREE.Vector3(0, 0, 0));
  const positionRef = useRef(new THREE.Vector3(0, GAME_CONFIG.PLAYER_HEIGHT, 0));
  const isJumpingRef = useRef(false);
  
  const cityCollisions = useCityCollisions();
  
  useEffect(() => {
    console.log('Player controls initialized');
  }, []);
  
  useFrame((state, delta) => {
    if (phase !== 'playing' || !controlsRef.current) return;
    
    const controls = getKeys();
    const camera = state.camera;
    
    // Movement
    const direction = new THREE.Vector3();
    const forward = new THREE.Vector3();
    const right = new THREE.Vector3();
    
    camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();
    
    right.crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();
    
    // Calculate movement direction
    if (controls.forward) {
      direction.add(forward);
      console.log('Moving forward');
    }
    if (controls.backward) {
      direction.sub(forward);
      console.log('Moving backward');
    }
    if (controls.left) {
      direction.sub(right);
      console.log('Moving left');
    }
    if (controls.right) {
      direction.add(right);
      console.log('Moving right');
    }
    
    direction.normalize();
    
    // Apply speed
    const speed = controls.run ? GAME_CONFIG.MOVE_SPEED * GAME_CONFIG.RUN_MULTIPLIER : GAME_CONFIG.MOVE_SPEED;
    velocityRef.current.x = direction.x * speed;
    velocityRef.current.z = direction.z * speed;
    
    // Jump
    if (controls.jump && isOnGround(positionRef.current.y) && !isJumpingRef.current) {
      velocityRef.current.y = GAME_CONFIG.JUMP_FORCE;
      isJumpingRef.current = true;
      console.log('Jumping');
    }
    
    // Apply gravity
    velocityRef.current.y += GAME_CONFIG.GRAVITY * delta;
    
    // Update position
    const newPosition = positionRef.current.clone();
    newPosition.add(velocityRef.current.clone().multiplyScalar(delta));
    
    // Collision detection
    const playerBox = createBoundingBox(
      newPosition,
      new THREE.Vector3(GAME_CONFIG.PLAYER_RADIUS * 2, GAME_CONFIG.PLAYER_HEIGHT, GAME_CONFIG.PLAYER_RADIUS * 2)
    );
    
    let hasCollision = false;
    for (const building of cityCollisions) {
      if (checkAABBCollision(playerBox, building.boundingBox)) {
        newPosition.copy(resolveCollision(newPosition, playerBox, building.boundingBox));
        velocityRef.current.x = 0;
        velocityRef.current.z = 0;
        hasCollision = true;
        break;
      }
    }
    
    // Ground collision
    if (newPosition.y <= GAME_CONFIG.PLAYER_HEIGHT) {
      newPosition.y = GAME_CONFIG.PLAYER_HEIGHT;
      velocityRef.current.y = 0;
      isJumpingRef.current = false;
    }
    
    // City bounds
    const halfCity = GAME_CONFIG.CITY_SIZE / 2;
    newPosition.x = THREE.MathUtils.clamp(newPosition.x, -halfCity, halfCity);
    newPosition.z = THREE.MathUtils.clamp(newPosition.z, -halfCity, halfCity);
    
    // Update position
    positionRef.current.copy(newPosition);
    camera.position.copy(newPosition);
    
    // Update store
    setPlayerPosition([newPosition.x, newPosition.y, newPosition.z]);
  });
  
  return (
    <PointerLockControlsImpl
      ref={controlsRef}
      onLock={() => {
        setPointerLocked(true);
        console.log('Pointer locked');
      }}
      onUnlock={() => {
        setPointerLocked(false);
        console.log('Pointer unlocked');
      }}
    />
  );
}
