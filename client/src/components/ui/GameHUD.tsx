import { usePortfolio } from '@/lib/stores/usePortfolio';
import { PROJECTS } from '@/lib/constants';
import { MiniMap } from './MiniMap';

export function GameHUD() {
  const { phase, hoveredBillboard } = usePortfolio();
  
  if (phase !== 'playing') return null;
  
  const hoveredProject = PROJECTS.find((p) => p.id === hoveredBillboard);
  
  return (
    <div className="fixed inset-0 pointer-events-none z-10">
      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 p-6">
        <div className="flex justify-between items-start">
          <div className="bg-black/50 backdrop-blur-sm border border-cyan-500/30 rounded-lg p-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              BRAGAWORK CITY
            </h1>
            <p className="text-sm text-cyan-300 mt-1">Interactive Portfolio</p>
          </div>
          
          <div className="bg-black/50 backdrop-blur-sm border border-cyan-500/30 rounded-lg p-4 text-right">
            <div className="text-xs text-gray-400 space-y-1">
              <div>WASD - Move</div>
              <div>SHIFT - Run</div>
              <div>SPACE - Jump</div>
              <div>ESC - Menu</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Hovered project info */}
      {hoveredProject && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="bg-black/80 backdrop-blur-md border-2 border-cyan-500 rounded-lg p-6 min-w-[300px] shadow-2xl shadow-cyan-500/50 animate-pulse">
            <h2 className="text-2xl font-bold text-cyan-400 mb-2">
              {hoveredProject.title}
            </h2>
            <p className="text-gray-300 mb-4">
              {hoveredProject.description}
            </p>
            <div className="text-center">
              <span className="text-green-400 font-bold text-lg">
                ▶ CLICK TO VIEW PROJECT
              </span>
            </div>
          </div>
        </div>
      )}
      
      {/* Bottom right - Mini map */}
      <div className="absolute bottom-6 right-6">
        <MiniMap />
      </div>
      
      {/* Bottom left - Instructions */}
      <div className="absolute bottom-6 left-6 bg-black/50 backdrop-blur-sm border border-purple-500/30 rounded-lg p-4">
        <p className="text-sm text-purple-300">
          💡 Explore the city and find interactive billboards
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Press ESC for menu and more options
        </p>
      </div>
    </div>
  );
}
