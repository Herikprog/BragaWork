// Game constants and configuration
export const GAME_CONFIG = {
  // Player movement
  MOVE_SPEED: 5,
  RUN_MULTIPLIER: 2,
  JUMP_FORCE: 8,
  GRAVITY: -20,
  
  // Physics
  PLAYER_HEIGHT: 1.8,
  PLAYER_RADIUS: 0.5,
  COLLISION_DISTANCE: 2,
  
  // Camera
  CAMERA_HEIGHT: 1.6,
  CAMERA_SENSITIVITY: 0.002,
  
  // City dimensions
  CITY_SIZE: 500,
  BUILDING_COUNT: 30,
  STREET_WIDTH: 8,
  
  // Visual effects
  FOG_NEAR: 10,
  FOG_FAR: 300,
  FOG_COLOR: 0x0a0a1a,
  
  // Audio
  MUSIC_VOLUME: 0.3,
  SFX_VOLUME: 0.5,
};

// Portfolio projects data
export interface Project {
  id: string;
  title: string;
  description: string;
  url: string;
  image?: string;
  position: [number, number, number];
}

export const PROJECTS: Project[] = [
  {
    id: 'project1',
    title: 'E-Commerce Platform',
    description: 'Full-stack shopping experience',
    url: 'https://github.com/bragawork',
    position: [20, 8, -100],
  },
  {
    id: 'project2',
    title: 'AI Chat Application',
    description: 'Real-time messaging with AI',
    url: 'https://github.com/bragawork',
    position: [-140, 8, -60],
  },
  {
    id: 'project3',
    title: 'Portfolio 3D',
    description: 'Interactive 3D experience',
    url: 'https://github.com/bragawork',
    position: [100, 8, 60],
  },
  {
    id: 'project4',
    title: 'Mobile Game',
    description: 'Cross-platform gaming',
    url: 'https://github.com/bragawork',
    position: [-60, 8, 140],
  },
  {
    id: 'project5',
    title: 'Dashboard Analytics',
    description: 'Data visualization platform',
    url: 'https://github.com/bragawork',
    position: [140, 8, -140],
  },
];

// Social links
export const SOCIAL_LINKS = {
  github: 'https://github.com/bragawork',
  linkedin: 'https://linkedin.com/in/bragawork',
  twitter: 'https://twitter.com/bragawork',
  portfolio: 'https://bragawork.com',
  resume: '/resume.pdf',
};

// Neon color palette
export const NEON_COLORS = {
  cyan: '#00ffff',
  magenta: '#ff00ff',
  purple: '#9d00ff',
  blue: '#0066ff',
  pink: '#ff0066',
  green: '#00ff66',
  yellow: '#ffff00',
};
