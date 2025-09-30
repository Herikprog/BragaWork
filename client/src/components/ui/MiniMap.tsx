import { usePortfolio } from '@/lib/stores/usePortfolio';
import { PROJECTS, GAME_CONFIG } from '@/lib/constants';

export function MiniMap() {
  const playerPosition = usePortfolio((state) => state.playerPosition);
  
  const mapSize = 150;
  const scale = mapSize / GAME_CONFIG.CITY_SIZE;
  
  // Convert world position to minimap position
  const toMapCoords = (worldX: number, worldZ: number) => {
    return {
      x: (worldX * scale) + mapSize / 2,
      y: (worldZ * scale) + mapSize / 2,
    };
  };
  
  const playerMapPos = toMapCoords(playerPosition[0], playerPosition[2]);
  
  return (
    <div className="relative">
      <div
        className="relative bg-black/80 backdrop-blur-sm border-2 border-cyan-500 rounded-full overflow-hidden shadow-2xl shadow-cyan-500/50"
        style={{ width: mapSize, height: mapSize }}
      >
        {/* Grid lines */}
        <svg className="absolute inset-0 opacity-20">
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="cyan" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
        
        {/* Projects/Billboards */}
        {PROJECTS.map((project) => {
          const pos = toMapCoords(project.position[0], project.position[2]);
          return (
            <div
              key={project.id}
              className="absolute w-3 h-3 bg-purple-500 rounded-full animate-pulse"
              style={{
                left: `${pos.x - 1.5}px`,
                top: `${pos.y - 1.5}px`,
              }}
              title={project.title}
            />
          );
        })}
        
        {/* Player position */}
        <div
          className="absolute w-4 h-4 bg-cyan-400 rounded-full border-2 border-white shadow-lg"
          style={{
            left: `${playerMapPos.x - 2}px`,
            top: `${playerMapPos.y - 2}px`,
          }}
        />
        
        {/* Direction indicator */}
        <div
          className="absolute w-0 h-0 border-l-[6px] border-r-[6px] border-b-[10px] border-l-transparent border-r-transparent border-b-cyan-400"
          style={{
            left: `${playerMapPos.x - 6}px`,
            top: `${playerMapPos.y - 12}px`,
          }}
        />
      </div>
      
      <div className="text-center mt-2 text-xs text-cyan-400 font-bold">
        MINI MAP
      </div>
    </div>
  );
}
