import { Canvas } from '@react-three/fiber';
import { Suspense, useEffect } from 'react';
import { KeyboardControls } from '@react-three/drei';
import { useAudio } from '@/lib/stores/useAudio';
import { usePortfolio } from '@/lib/stores/usePortfolio';
import '@fontsource/inter';

// Import game components
import { Player } from '@/components/game/Player';
import { City } from '@/components/game/City';
import { Lighting } from '@/components/game/Lighting';
import { Environment } from '@/components/game/Environment';

// Import UI components
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { GameHUD } from '@/components/ui/GameHUD';
import { PauseMenu } from '@/components/ui/PauseMenu';
import { MobileControls } from '@/components/ui/MobileControls';

// Define keyboard controls
enum Controls {
  forward = 'forward',
  backward = 'backward',
  left = 'left',
  right = 'right',
  run = 'run',
  jump = 'jump',
}

const controlsMap = [
  { name: Controls.forward, keys: ['KeyW', 'ArrowUp'] },
  { name: Controls.backward, keys: ['KeyS', 'ArrowDown'] },
  { name: Controls.left, keys: ['KeyA', 'ArrowLeft'] },
  { name: Controls.right, keys: ['KeyD', 'ArrowRight'] },
  { name: Controls.run, keys: ['ShiftLeft', 'ShiftRight'] },
  { name: Controls.jump, keys: ['Space'] },
];

function App() {
  const phase = usePortfolio((state) => state.phase);
  const togglePause = usePortfolio((state) => state.togglePause);
  const { setBackgroundMusic, isMuted } = useAudio();
  
  // Initialize audio
  useEffect(() => {
    const music = new Audio('/sounds/background.mp3');
    music.loop = true;
    music.volume = 0.3;
    setBackgroundMusic(music);
    
    // Try to play music when user interacts
    const playMusic = () => {
      if (!isMuted) {
        music.play().catch(err => console.log('Audio play prevented:', err));
      }
      document.removeEventListener('click', playMusic);
    };
    
    document.addEventListener('click', playMusic);
    
    return () => {
      music.pause();
      document.removeEventListener('click', playMusic);
    };
  }, [setBackgroundMusic, isMuted]);
  
  // Handle ESC key for pause menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && (phase === 'playing' || phase === 'paused')) {
        e.preventDefault();
        togglePause();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phase, togglePause]);
  
  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      <KeyboardControls map={controlsMap}>
        {/* Loading Screen */}
        <LoadingScreen />
        
        {/* 3D Canvas */}
        {phase !== 'loading' && (
          <Canvas
            shadows
            camera={{
              position: [0, 2, 0],
              fov: 75,
              near: 0.1,
              far: 1000,
            }}
            gl={{
              antialias: true,
              powerPreference: 'high-performance',
            }}
          >
            <Suspense fallback={null}>
              {/* Environment */}
              <Environment />
              
              {/* Lighting */}
              <Lighting />
              
              {/* City */}
              <City />
              
              {/* Player */}
              <Player />
            </Suspense>
          </Canvas>
        )}
        
        {/* UI Overlays */}
        <GameHUD />
        <PauseMenu />
        <MobileControls />
      </KeyboardControls>
    </div>
  );
}

export default App;
