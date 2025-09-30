import { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useIsMobile } from '@/hooks/use-is-mobile';
import { usePortfolio } from '@/lib/stores/usePortfolio';
import { GAME_CONFIG } from '@/lib/constants';
import { Play, Square, ArrowUp } from 'lucide-react';

export function MobileControls() {
  const isMobile = useIsMobile();
  const phase = usePortfolio((state) => state.phase);
  
  if (!isMobile || phase !== 'playing') return null;
  
  return (
    <>
      <VirtualJoystick />
      <ActionButtons />
    </>
  );
}

function VirtualJoystick() {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const joystickRef = useRef<HTMLDivElement>(null);
  const startPos = useRef({ x: 0, y: 0 });
  
  const handleStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    const touch = e.touches[0];
    startPos.current = { x: touch.clientX, y: touch.clientY };
  };
  
  const handleMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const touch = e.touches[0];
    const deltaX = touch.clientX - startPos.current.x;
    const deltaY = touch.clientY - startPos.current.y;
    
    const maxDistance = 50;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    if (distance > maxDistance) {
      const angle = Math.atan2(deltaY, deltaX);
      setPosition({
        x: Math.cos(angle) * maxDistance,
        y: Math.sin(angle) * maxDistance,
      });
    } else {
      setPosition({ x: deltaX, y: deltaY });
    }
  };
  
  const handleEnd = () => {
    setIsDragging(false);
    setPosition({ x: 0, y: 0 });
  };
  
  return (
    <div className="fixed bottom-24 left-6 z-40 pointer-events-auto">
      <div
        ref={joystickRef}
        className="relative w-32 h-32 bg-black/50 backdrop-blur-sm border-2 border-cyan-500/50 rounded-full"
        onTouchStart={handleStart}
        onTouchMove={handleMove}
        onTouchEnd={handleEnd}
      >
        <div
          className="absolute w-12 h-12 bg-cyan-500 rounded-full shadow-lg shadow-cyan-500/50 transform -translate-x-1/2 -translate-y-1/2 transition-transform"
          style={{
            left: `calc(50% + ${position.x}px)`,
            top: `calc(50% + ${position.y}px)`,
          }}
        />
      </div>
      <div className="text-center mt-2 text-xs text-cyan-400 font-bold">
        MOVE
      </div>
    </div>
  );
}

function ActionButtons() {
  const togglePause = usePortfolio((state) => state.togglePause);
  
  return (
    <div className="fixed bottom-24 right-6 z-40 pointer-events-auto space-y-4">
      {/* Jump Button */}
      <button
        className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center border-2 border-purple-400 shadow-lg shadow-purple-500/50 active:scale-95 transition-transform"
        onTouchStart={(e) => {
          e.preventDefault();
          // Jump logic would be triggered here
          console.log('Jump button pressed');
        }}
      >
        <ArrowUp className="w-8 h-8 text-white" />
      </button>
      
      {/* Run Button */}
      <button
        className="w-16 h-16 bg-pink-600 rounded-full flex items-center justify-center border-2 border-pink-400 shadow-lg shadow-pink-500/50 active:scale-95 transition-transform"
        onTouchStart={(e) => {
          e.preventDefault();
          console.log('Run button pressed');
        }}
      >
        <Play className="w-8 h-8 text-white" />
      </button>
      
      {/* Pause Button */}
      <button
        onClick={togglePause}
        className="w-16 h-16 bg-cyan-600 rounded-full flex items-center justify-center border-2 border-cyan-400 shadow-lg shadow-cyan-500/50 active:scale-95 transition-transform"
      >
        <Square className="w-8 h-8 text-white" />
      </button>
    </div>
  );
}
