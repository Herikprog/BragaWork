import { create } from 'zustand';

type GamePhase = 'loading' | 'playing' | 'paused';

interface PortfolioState {
  // Game state
  phase: GamePhase;
  isPointerLocked: boolean;
  
  // Player state
  playerPosition: [number, number, number];
  playerRotation: [number, number, number];
  
  // UI state
  hoveredBillboard: string | null;
  
  // Actions
  setPhase: (phase: GamePhase) => void;
  setPointerLocked: (locked: boolean) => void;
  setPlayerPosition: (pos: [number, number, number]) => void;
  setPlayerRotation: (rot: [number, number, number]) => void;
  setHoveredBillboard: (id: string | null) => void;
  togglePause: () => void;
}

export const usePortfolio = create<PortfolioState>((set, get) => ({
  // Initial state
  phase: 'loading',
  isPointerLocked: false,
  playerPosition: [0, GAME_CONFIG.PLAYER_HEIGHT, 0],
  playerRotation: [0, 0, 0],
  hoveredBillboard: null,
  
  // Actions
  setPhase: (phase) => set({ phase }),
  
  setPointerLocked: (locked) => set({ isPointerLocked: locked }),
  
  setPlayerPosition: (pos) => set({ playerPosition: pos }),
  
  setPlayerRotation: (rot) => set({ playerRotation: rot }),
  
  setHoveredBillboard: (id) => set({ hoveredBillboard: id }),
  
  togglePause: () => {
    const currentPhase = get().phase;
    if (currentPhase === 'playing') {
      set({ phase: 'paused', isPointerLocked: false });
    } else if (currentPhase === 'paused') {
      set({ phase: 'playing' });
    }
  },
}));

// Import GAME_CONFIG
import { GAME_CONFIG } from '../constants';
