// BragaWork City - Interactive 3D Portfolio
// Vanilla JavaScript + Three.js

// ============= CONFIGURATION =============
const CONFIG = {
    MOVE_SPEED: 5,
    RUN_MULTIPLIER: 2,
    JUMP_FORCE: 8,
    GRAVITY: -20,
    PLAYER_HEIGHT: 1.8,
    PLAYER_RADIUS: 0.5,
    CITY_SIZE: 500,
    BUILDING_COUNT: 30,
    FOG_COLOR: 0x0a0a1a,
    FOG_NEAR: 10,
    FOG_FAR: 300,
};

const NEON_COLORS = {
    cyan: 0x00ffff,
    magenta: 0xff00ff,
    purple: 0x9d00ff,
    blue: 0x0066ff,
    pink: 0xff0066,
    green: 0x00ff66,
};

const PROJECTS = [
    {
        id: 'project1',
        title: 'E-Commerce Platform',
        description: 'Full-stack shopping experience',
        url: 'https://github.com/bragawork',
        position: [20, 8, -100],
        coverImage: null, // Adicione: '/projects/ecommerce-platform/cover.jpg'
    },
    {
        id: 'project2',
        title: 'AI Chat Application',
        description: 'Real-time messaging with AI',
        url: 'https://github.com/bragawork',
        position: [-140, 8, -60],
        coverImage: null, // Adicione: '/projects/ai-chat-application/cover.jpg'
    },
    {
        id: 'project3',
        title: 'Portfolio 3D',
        description: 'Interactive 3D experience',
        url: 'https://github.com/bragawork',
        position: [100, 8, 60],
        coverImage: null, // Adicione: '/projects/portfolio-3d/cover.jpg'
    },
    {
        id: 'project4',
        title: 'Mobile Game',
        description: 'Cross-platform gaming',
        url: 'https://github.com/bragawork',
        position: [-60, 8, 140],
        coverImage: null, // Adicione: '/projects/mobile-game/cover.jpg'
    },
    {
        id: 'project5',
        title: 'Dashboard Analytics',
        description: 'Data visualization platform',
        url: 'https://github.com/bragawork',
        position: [140, 8, -140],
        coverImage: null, // Adicione: '/projects/dashboard-analytics/cover.jpg'
    },
];

// ============= GAME STATE =============
const gameState = {
    phase: 'loading',
    isPaused: false,
    isPointerLocked: false,
    isMuted: false,
    playerPosition: new THREE.Vector3(0, CONFIG.PLAYER_HEIGHT, 0),
    playerVelocity: new THREE.Vector3(0, 0, 0),
    playerRotation: { x: 0, y: 0 },
    isJumping: false,
    keys: {},
    hoveredBillboard: null,
    buildings: [],
    billboards: [],
    drones: [],
};

// ============= THREE.JS SETUP =============
let scene, camera, renderer, clock;
let raycaster, mouse;

function initThree() {
    try {
        // Scene
        scene = new THREE.Scene();
        scene.background = new THREE.Color(CONFIG.FOG_COLOR);
        scene.fog = new THREE.Fog(CONFIG.FOG_COLOR, CONFIG.FOG_NEAR, CONFIG.FOG_FAR);

        // Camera
        camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        camera.position.copy(gameState.playerPosition);

        // Renderer with better compatibility settings
        const canvas = document.getElementById('game-canvas');
        renderer = new THREE.WebGLRenderer({ 
            canvas, 
            antialias: true,
            alpha: false,
            preserveDrawingBuffer: true,
            powerPreference: 'high-performance',
            failIfMajorPerformanceCaveat: false
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        // Clock
        clock = new THREE.Clock();

        // Raycaster for interaction
        raycaster = new THREE.Raycaster();
        mouse = new THREE.Vector2();

        // Resize handler
        window.addEventListener('resize', onWindowResize);
        
        console.log('Three.js initialized successfully');
    } catch (error) {
        console.error('Failed to initialize Three.js:', error);
        // Show error to user
        document.getElementById('loading-screen').innerHTML = `
            <div class="loading-content">
                <h1 class="title">ERRO</h1>
                <p class="subtitle" style="color: #ff0066;">Seu navegador não suporta WebGL</p>
                <p style="color: #aaa; margin-top: 2rem;">
                    Por favor, use um navegador moderno como Chrome, Firefox, ou Edge<br>
                    e certifique-se de que WebGL está habilitado.
                </p>
            </div>
        `;
        throw error;
    }
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// ============= LIGHTING =============
function createLighting() {
    // Ambient light
    const ambient = new THREE.AmbientLight(0x1a1a2e, 0.2);
    scene.add(ambient);

    // Directional light (moon)
    const directional = new THREE.DirectionalLight(0x4a5a8a, 0.3);
    directional.position.set(50, 100, 50);
    directional.castShadow = true;
    directional.shadow.mapSize.width = 2048;
    directional.shadow.mapSize.height = 2048;
    scene.add(directional);

    // Hemisphere light
    const hemisphere = new THREE.HemisphereLight(0x7a00ff, 0x00ff9f, 0.3);
    scene.add(hemisphere);

    // Neon point lights
    const neonLights = [
        { pos: [40, 5, -50], color: NEON_COLORS.cyan },
        { pos: [-50, 8, -40], color: NEON_COLORS.magenta },
        { pos: [60, 12, 30], color: NEON_COLORS.purple },
        { pos: [-60, 6, 50], color: NEON_COLORS.pink },
        { pos: [0, 15, -70], color: NEON_COLORS.blue },
        { pos: [70, 10, 60], color: NEON_COLORS.green },
        { pos: [-40, 8, -60], color: NEON_COLORS.cyan },
        { pos: [50, 10, -30], color: NEON_COLORS.purple },
        { pos: [-70, 12, 40], color: NEON_COLORS.magenta },
        { pos: [30, 8, 70], color: NEON_COLORS.pink },
    ];

    neonLights.forEach((light) => {
        const pointLight = new THREE.PointLight(light.color, 25, 40, 2);
        pointLight.position.set(...light.pos);
        scene.add(pointLight);
    });

    // Ground reflection light
    const groundLight = new THREE.PointLight(NEON_COLORS.cyan, 5, 20, 2);
    groundLight.position.set(0, 1, 0);
    scene.add(groundLight);
}

// ============= TERRAIN =============
function createTerrain() {
    // Main ground
    const groundGeometry = new THREE.PlaneGeometry(CONFIG.CITY_SIZE, CONFIG.CITY_SIZE);
    const groundMaterial = new THREE.MeshStandardMaterial({
        color: 0x1a1a2e,
        roughness: 0.8,
        metalness: 0.2,
        emissive: NEON_COLORS.cyan,
        emissiveIntensity: 0.05,
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.1;
    ground.receiveShadow = true;
    scene.add(ground);

    // Street grid lines
    const streetWidth = 8;
    for (let i = -CONFIG.CITY_SIZE / 2; i <= CONFIG.CITY_SIZE / 2; i += 15) {
        // Horizontal streets
        const hStreet = new THREE.Mesh(
            new THREE.BoxGeometry(CONFIG.CITY_SIZE, 0.1, streetWidth),
            new THREE.MeshStandardMaterial({
                color: NEON_COLORS.cyan,
                emissive: NEON_COLORS.cyan,
                emissiveIntensity: 0.3,
                transparent: true,
                opacity: 0.3,
            })
        );
        hStreet.position.set(0, 0.01, i);
        scene.add(hStreet);

        // Vertical streets
        const vStreet = new THREE.Mesh(
            new THREE.BoxGeometry(streetWidth, 0.1, CONFIG.CITY_SIZE),
            new THREE.MeshStandardMaterial({
                color: NEON_COLORS.cyan,
                emissive: NEON_COLORS.cyan,
                emissiveIntensity: 0.3,
                transparent: true,
                opacity: 0.3,
            })
        );
        vStreet.position.set(i, 0.01, 0);
        scene.add(vStreet);
    }
}

// ============= BUILDINGS =============
function createBuildings() {
    const colors = Object.values(NEON_COLORS);
    const blockSize = 25; // Tamanho de cada quarteirão (MAIOR)
    const streetWidth = 15; // Ruas mais largas
    const buildingsPerBlock = 3;

    // Criar prédios organizados em blocos/quarteirões
    for (let blockX = -5; blockX <= 5; blockX++) {
        for (let blockZ = -5; blockZ <= 5; blockZ++) {
            // Pular o centro (onde o jogador começa)
            if (Math.abs(blockX) <= 1 && Math.abs(blockZ) <= 1) continue;

            for (let b = 0; b < buildingsPerBlock; b++) {
                const width = 6 + Math.random() * 4;
                const height = 15 + Math.random() * 25;
                const depth = 6 + Math.random() * 4;

                // Posição dentro do bloco
                const baseX = blockX * (blockSize + streetWidth);
                const baseZ = blockZ * (blockSize + streetWidth);
                const offsetX = (Math.random() - 0.5) * (blockSize - width - 2);
                const offsetZ = (Math.random() - 0.5) * (blockSize - depth - 2);

                const x = baseX + offsetX;
                const z = baseZ + offsetZ;

                // Create building
                const geometry = new THREE.BoxGeometry(width, height, depth);
                const color = colors[Math.floor(Math.random() * colors.length)];
                const material = new THREE.MeshStandardMaterial({
                    color: color,
                    roughness: 0.7,
                    metalness: 0.3,
                    emissive: color,
                    emissiveIntensity: 0.15,
                });
                const building = new THREE.Mesh(geometry, material);
                building.position.set(x, height / 2, z);
                building.castShadow = true;
                building.receiveShadow = true;
                scene.add(building);

                // Add neon trim on top
                const trimGeometry = new THREE.BoxGeometry(width + 0.3, 0.5, depth + 0.3);
                const trimMaterial = new THREE.MeshStandardMaterial({
                    color: NEON_COLORS.magenta,
                    emissive: NEON_COLORS.magenta,
                    emissiveIntensity: 2.5,
                });
                const trim = new THREE.Mesh(trimGeometry, trimMaterial);
                trim.position.set(x, height / 2 + 0.3, z);
                scene.add(trim);

                // Store collision data
                gameState.buildings.push({
                    position: new THREE.Vector3(x, height / 2, z),
                    size: new THREE.Vector3(width, height, depth),
                });
            }
        }
    }

    // ADICIONAR BARREIRAS INVISÍVEIS NOS 4 CANTOS
    const barrierHeight = 50;
    const barrierThickness = 1;
    const cityLimit = CONFIG.CITY_SIZE / 2;

    // Barreira Norte
    gameState.buildings.push({
        position: new THREE.Vector3(0, barrierHeight / 2, -cityLimit),
        size: new THREE.Vector3(CONFIG.CITY_SIZE, barrierHeight, barrierThickness),
    });

    // Barreira Sul
    gameState.buildings.push({
        position: new THREE.Vector3(0, barrierHeight / 2, cityLimit),
        size: new THREE.Vector3(CONFIG.CITY_SIZE, barrierHeight, barrierThickness),
    });

    // Barreira Leste
    gameState.buildings.push({
        position: new THREE.Vector3(cityLimit, barrierHeight / 2, 0),
        size: new THREE.Vector3(barrierThickness, barrierHeight, CONFIG.CITY_SIZE),
    });

    // Barreira Oeste
    gameState.buildings.push({
        position: new THREE.Vector3(-cityLimit, barrierHeight / 2, 0),
        size: new THREE.Vector3(barrierThickness, barrierHeight, CONFIG.CITY_SIZE),
    });
}

// ============= BILLBOARDS =============
function createBillboards() {
    PROJECTS.forEach((project) => {
        const group = new THREE.Group();
        
        const billboardY = project.position[1];
        const frameHeight = 10;
        const frameBaseY = -frameHeight / 2; // -5 em coordenadas locais
        const groundY = -billboardY; // chão em coordenadas locais
        const poleHeight = Math.abs(groundY - frameBaseY); // altura do poste

        // Billboard frame (MUITO MAIOR)
        const frameGeometry = new THREE.BoxGeometry(14, frameHeight, 0.3);
        const frameMaterial = new THREE.MeshStandardMaterial({
            color: 0x1a1a2e,
            emissive: NEON_COLORS.cyan,
            emissiveIntensity: 0.3,
            metalness: 0.8,
            roughness: 0.2,
        });
        const frame = new THREE.Mesh(frameGeometry, frameMaterial);
        group.add(frame);

        // Project cover image (se existir)
        if (project.coverImage) {
            const textureLoader = new THREE.TextureLoader();
            textureLoader.load(
                project.coverImage,
                (texture) => {
                    // Sucesso ao carregar a textura
                    console.log(`✅ Capa carregada: ${project.title} - ${project.coverImage}`);
                    
                    const coverGeometry = new THREE.PlaneGeometry(13, 9);
                    const coverMaterial = new THREE.MeshStandardMaterial({
                        map: texture,
                        emissive: 0xffffff,
                        emissiveIntensity: 0.1,
                        side: THREE.FrontSide,
                    });
                    const cover = new THREE.Mesh(coverGeometry, coverMaterial);
                    cover.position.z = 0.2;
                    group.add(cover);
                },
                undefined,
                (error) => {
                    // Erro ao carregar a textura
                    console.warn(`⚠️  Não foi possível carregar a capa: ${project.title} - ${project.coverImage}`);
                    console.warn('   Certifique-se de que a imagem existe na pasta correta.');
                }
            );
        }

        // Glow effect (maior)
        const glowGeometry = new THREE.PlaneGeometry(14.5, 10.5);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: NEON_COLORS.cyan,
            transparent: true,
            opacity: 0.2,
            blending: THREE.AdditiveBlending,
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        glow.position.z = -0.2;
        group.add(glow);

        // Support poles (dois postes do chão até a base do frame)
        const poleGeometry = new THREE.CylinderGeometry(0.3, 0.3, poleHeight, 8);
        const poleMaterial = new THREE.MeshStandardMaterial({
            color: 0x333333,
            metalness: 0.9,
            roughness: 0.1,
        });
        
        const poleCenterY = (groundY + frameBaseY) / 2;
        
        const poleLeft = new THREE.Mesh(poleGeometry, poleMaterial);
        poleLeft.position.set(-6, poleCenterY, 0);
        group.add(poleLeft);
        
        const poleRight = new THREE.Mesh(poleGeometry, poleMaterial);
        poleRight.position.set(6, poleCenterY, 0);
        group.add(poleRight);

        group.position.set(...project.position);
        group.userData = { project: project, glow: glow, frame: frame };
        scene.add(group);

        gameState.billboards.push(group);
    });
}

// ============= DRONES =============
function createDrones() {
    for (let i = 0; i < 8; i++) {
        const drone = new THREE.Group();

        // Body
        const bodyGeometry = new THREE.BoxGeometry(0.8, 0.3, 0.8);
        const bodyMaterial = new THREE.MeshStandardMaterial({
            color: 0x333333,
            emissive: NEON_COLORS.cyan,
            emissiveIntensity: 0.5,
            metalness: 0.9,
            roughness: 0.1,
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        drone.add(body);

        // Propellers
        const propellerPositions = [[-0.5, 0, -0.5], [0.5, 0, -0.5], [-0.5, 0, 0.5], [0.5, 0, 0.5]];
        propellerPositions.forEach((pos) => {
            const propellerGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.05, 8);
            const propellerMaterial = new THREE.MeshStandardMaterial({
                color: NEON_COLORS.magenta,
                emissive: NEON_COLORS.magenta,
                emissiveIntensity: 1,
                transparent: true,
                opacity: 0.6,
            });
            const propeller = new THREE.Mesh(propellerGeometry, propellerMaterial);
            propeller.position.set(...pos);
            drone.add(propeller);
        });

        // Light
        const light = new THREE.PointLight(NEON_COLORS.cyan, 5, 10);
        drone.add(light);

        // Random starting position
        const startPos = new THREE.Vector3(
            (Math.random() - 0.5) * 60,
            15 + Math.random() * 20,
            (Math.random() - 0.5) * 60
        );
        drone.position.copy(startPos);

        // Store animation data
        drone.userData = {
            startPos: startPos,
            path: i % 2 === 0 ? 'circle' : 'line',
            speed: 0.2 + Math.random() * 0.3,
            radius: 10 + Math.random() * 15,
            offset: Math.random() * Math.PI * 2,
        };

        scene.add(drone);
        gameState.drones.push(drone);
    }
}

// ============= PARTICLES =============
function createParticles() {
    const particleCount = 500;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const neonColorArray = Object.values(NEON_COLORS).map((c) => new THREE.Color(c));

    for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 100;
        positions[i * 3 + 1] = Math.random() * 50;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 100;

        const color = neonColorArray[Math.floor(Math.random() * neonColorArray.length)];
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        size: 0.1,
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    return particles;
}

// ============= SKY =============
function createSky() {
    const geometry = new THREE.SphereGeometry(500, 32, 32);
    const material = new THREE.MeshBasicMaterial({
        color: 0x0a0a1a,
        side: THREE.BackSide,
        transparent: true,
        opacity: 0.9,
    });
    const sky = new THREE.Mesh(geometry, material);
    scene.add(sky);
    return sky;
}

// ============= COLLISION DETECTION =============
function checkCollision(newPos) {
    for (const building of gameState.buildings) {
        const dx = Math.abs(newPos.x - building.position.x);
        const dz = Math.abs(newPos.z - building.position.z);

        if (dx < (building.size.x / 2 + CONFIG.PLAYER_RADIUS) &&
            dz < (building.size.z / 2 + CONFIG.PLAYER_RADIUS)) {
            return true;
        }
    }
    return false;
}

// ============= PLAYER CONTROLS =============
function setupControls() {
    // Keyboard
    document.addEventListener('keydown', (e) => {
        gameState.keys[e.code] = true;
        
        if (e.code === 'Escape') {
            togglePause();
        }
    });

    document.addEventListener('keyup', (e) => {
        gameState.keys[e.code] = false;
    });

    // Mouse movement (Pointer Lock)
    document.addEventListener('click', () => {
        if (gameState.phase === 'playing' && !gameState.isPaused) {
            document.body.requestPointerLock();
        }
    });

    document.addEventListener('pointerlockchange', () => {
        gameState.isPointerLocked = document.pointerLockElement === document.body;
    });

    document.addEventListener('mousemove', (e) => {
        if (gameState.isPointerLocked && gameState.phase === 'playing' && !gameState.isPaused) {
            gameState.playerRotation.y -= e.movementX * 0.002;
            gameState.playerRotation.x -= e.movementY * 0.002;
            gameState.playerRotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, gameState.playerRotation.x));
        }
    });

    // Mouse click for billboards
    document.addEventListener('click', (e) => {
        if (gameState.hoveredBillboard && gameState.phase === 'playing' && !gameState.isPaused) {
            const project = gameState.hoveredBillboard.userData.project;
            window.open(project.url, '_blank');
        }
    });
}

// ============= UPDATE PLAYER =============
function updatePlayer(delta) {
    if (gameState.phase !== 'playing' || gameState.isPaused) return;

    // Movement direction
    const direction = new THREE.Vector3();
    const forward = new THREE.Vector3(0, 0, -1);
    const right = new THREE.Vector3(1, 0, 0);

    forward.applyAxisAngle(new THREE.Vector3(0, 1, 0), gameState.playerRotation.y);
    right.applyAxisAngle(new THREE.Vector3(0, 1, 0), gameState.playerRotation.y);

    if (gameState.keys['KeyW'] || gameState.keys['ArrowUp']) {
        direction.add(forward);
    }
    if (gameState.keys['KeyS'] || gameState.keys['ArrowDown']) {
        direction.sub(forward);
    }
    if (gameState.keys['KeyA'] || gameState.keys['ArrowLeft']) {
        direction.sub(right);
    }
    if (gameState.keys['KeyD'] || gameState.keys['ArrowRight']) {
        direction.add(right);
    }

    direction.normalize();

    // Speed
    const isRunning = gameState.keys['ShiftLeft'] || gameState.keys['ShiftRight'];
    const speed = isRunning ? CONFIG.MOVE_SPEED * CONFIG.RUN_MULTIPLIER : CONFIG.MOVE_SPEED;

    gameState.playerVelocity.x = direction.x * speed;
    gameState.playerVelocity.z = direction.z * speed;

    // Jump
    if (gameState.keys['Space'] && !gameState.isJumping && 
        Math.abs(gameState.playerPosition.y - CONFIG.PLAYER_HEIGHT) < 0.1) {
        gameState.playerVelocity.y = CONFIG.JUMP_FORCE;
        gameState.isJumping = true;
    }

    // Gravity
    gameState.playerVelocity.y += CONFIG.GRAVITY * delta;

    // New position
    const newPos = gameState.playerPosition.clone();
    newPos.add(gameState.playerVelocity.clone().multiplyScalar(delta));

    // Collision detection
    if (!checkCollision(newPos)) {
        gameState.playerPosition.copy(newPos);
    } else {
        gameState.playerVelocity.x = 0;
        gameState.playerVelocity.z = 0;
    }

    // Ground collision
    if (gameState.playerPosition.y <= CONFIG.PLAYER_HEIGHT) {
        gameState.playerPosition.y = CONFIG.PLAYER_HEIGHT;
        gameState.playerVelocity.y = 0;
        gameState.isJumping = false;
    }

    // Update camera
    camera.position.copy(gameState.playerPosition);
    camera.rotation.set(gameState.playerRotation.x, gameState.playerRotation.y, 0, 'YXZ');
}

// ============= UPDATE BILLBOARDS =============
function updateBillboards(delta) {
    if (gameState.phase !== 'playing' || gameState.isPaused) return;

    // Check hover
    raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);
    const intersects = raycaster.intersectObjects(gameState.billboards, true);

    gameState.hoveredBillboard = null;

    if (intersects.length > 0) {
        const billboard = intersects[0].object.parent;
        if (billboard && billboard.userData.project) {
            gameState.hoveredBillboard = billboard;

            // Pulsing effect
            const glow = billboard.userData.glow;
            const frame = billboard.userData.frame;
            if (glow && frame) {
                const pulse = Math.sin(clock.getElapsedTime() * 5) * 0.3 + 0.7;
                glow.scale.set(pulse, pulse, 1);
                frame.material.emissiveIntensity = 0.8;
                frame.material.emissive.setHex(NEON_COLORS.magenta);
            }

            // Show info
            const info = document.getElementById('billboard-info');
            info.style.display = 'block';
            document.getElementById('billboard-title').textContent = billboard.userData.project.title;
            document.getElementById('billboard-description').textContent = billboard.userData.project.description;
            document.body.style.cursor = 'pointer';
        }
    } else {
        // Reset all billboards
        gameState.billboards.forEach((billboard) => {
            const glow = billboard.userData.glow;
            const frame = billboard.userData.frame;
            if (glow && frame) {
                glow.scale.set(1, 1, 1);
                frame.material.emissiveIntensity = 0.3;
                frame.material.emissive.setHex(NEON_COLORS.cyan);
            }
        });

        document.getElementById('billboard-info').style.display = 'none';
        document.body.style.cursor = 'auto';
    }
}

// ============= UPDATE DRONES =============
function updateDrones(time) {
    gameState.drones.forEach((drone) => {
        const data = drone.userData;

        if (data.path === 'circle') {
            drone.position.x = data.startPos.x + Math.cos(time * data.speed + data.offset) * data.radius;
            drone.position.z = data.startPos.z + Math.sin(time * data.speed + data.offset) * data.radius;
            drone.position.y = data.startPos.y + Math.sin(time * data.speed * 0.5 + data.offset) * 3;
        } else {
            drone.position.x = data.startPos.x + Math.sin(time * data.speed + data.offset) * 20;
            drone.position.y = data.startPos.y + Math.cos(time * data.speed * 0.8 + data.offset) * 2;
        }

        drone.rotation.y = time * 2 * data.speed;
    });
}

// ============= UPDATE MINIMAP =============
function updateMinimap() {
    const canvas = document.getElementById('minimap');
    const ctx = canvas.getContext('2d');
    const size = 150;
    const scale = size / CONFIG.CITY_SIZE;

    ctx.clearRect(0, 0, size, size);

    // Grid
    ctx.strokeStyle = 'rgba(0, 255, 255, 0.2)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= size; i += 20) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, size);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(size, i);
        ctx.stroke();
    }

    // Projects
    PROJECTS.forEach((project) => {
        const x = (project.position[0] * scale) + size / 2;
        const y = (project.position[2] * scale) + size / 2;

        ctx.fillStyle = '#9d00ff';
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
    });

    // Player
    const px = (gameState.playerPosition.x * scale) + size / 2;
    const py = (gameState.playerPosition.z * scale) + size / 2;

    ctx.fillStyle = '#00ffff';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(px, py, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Direction indicator
    ctx.fillStyle = '#00ffff';
    ctx.beginPath();
    ctx.moveTo(px, py - 10);
    ctx.lineTo(px - 6, py);
    ctx.lineTo(px + 6, py);
    ctx.closePath();
    ctx.fill();
}

// ============= UI CONTROLS =============
function setupUI() {
    // Resume button
    document.getElementById('btn-resume').addEventListener('click', togglePause);

    // Sound toggle
    const bgMusic = document.getElementById('background-music');
    document.getElementById('btn-sound').addEventListener('click', () => {
        gameState.isMuted = !gameState.isMuted;
        if (gameState.isMuted) {
            bgMusic.pause();
            document.getElementById('sound-icon').textContent = '🔇';
            document.getElementById('sound-status').textContent = 'OFF';
        } else {
            bgMusic.play();
            document.getElementById('sound-icon').textContent = '🔊';
            document.getElementById('sound-status').textContent = 'ON';
        }
    });

    // Exit button
    document.getElementById('btn-exit').addEventListener('click', () => {
        window.location.reload();
    });

    // Start music on first interaction
    document.addEventListener('click', () => {
        if (!gameState.isMuted && bgMusic.paused) {
            bgMusic.volume = 0.3;
            bgMusic.play().catch(() => {});
        }
    }, { once: true });
}

function togglePause() {
    if (gameState.phase !== 'playing' && gameState.phase !== 'paused') return;

    gameState.isPaused = !gameState.isPaused;
    
    if (gameState.isPaused) {
        gameState.phase = 'paused';
        document.getElementById('pause-menu').style.display = 'flex';
        document.exitPointerLock();
    } else {
        gameState.phase = 'playing';
        document.getElementById('pause-menu').style.display = 'none';
    }
}

// ============= LOADING =============
function updateLoading(progress) {
    document.getElementById('progress-bar').style.width = progress + '%';
    document.getElementById('progress-text').textContent = Math.round(progress) + '% CARREGANDO...';

    if (progress >= 100) {
        setTimeout(() => {
            document.getElementById('instructions').style.display = 'block';
            setTimeout(() => {
                document.getElementById('loading-screen').style.opacity = '0';
                setTimeout(() => {
                    document.getElementById('loading-screen').style.display = 'none';
                    gameState.phase = 'playing';
                    document.getElementById('hud').style.display = 'block';
                    
                    // Check if mobile
                    if (window.innerWidth < 768) {
                        document.getElementById('mobile-controls').style.display = 'block';
                    }
                }, 500);
            }, 1000);
        }, 500);
    }
}

// ============= ANIMATION LOOP =============
let sky, particles;

function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta();
    const time = clock.getElapsedTime();

    // Update game objects
    updatePlayer(delta);
    updateBillboards(delta);
    updateDrones(time);

    if (gameState.phase === 'playing' && !gameState.isPaused) {
        updateMinimap();
    }

    // Animate sky
    if (sky) {
        sky.rotation.y = time * 0.01;
    }

    // Render
    renderer.render(scene, camera);
}

// ============= INITIALIZATION =============
async function init() {
    // Initialize Three.js
    initThree();

    // Create scene elements
    createLighting();
    createTerrain();
    
    updateLoading(20);
    await new Promise(resolve => setTimeout(resolve, 100));

    createBuildings();
    updateLoading(40);
    await new Promise(resolve => setTimeout(resolve, 100));

    createBillboards();
    updateLoading(60);
    await new Promise(resolve => setTimeout(resolve, 100));

    createDrones();
    particles = createParticles();
    sky = createSky();
    updateLoading(80);
    await new Promise(resolve => setTimeout(resolve, 100));

    // Setup controls and UI
    setupControls();
    setupUI();
    
    // Instruções sobre capas dos projetos
    console.log('%c🎨 COMO ADICIONAR CAPAS AOS OUTDOORS:', 'color: #00ffff; font-size: 14px; font-weight: bold');
    console.log('%c1. Adicione sua capa (cover.jpg) na pasta do projeto:', 'color: #ff00ff');
    console.log('%c   - client/public/projects/ecommerce-platform/cover.jpg', 'color: #00ff66');
    console.log('%c   - client/public/projects/ai-chat-application/cover.jpg', 'color: #00ff66');
    console.log('%c   - etc...', 'color: #00ff66');
    console.log('%c2. No arquivo game.js (linhas 38, 46, 54, 62, 70), altere:', 'color: #ff00ff');
    console.log('%c   De: coverImage: null,', 'color: #ff6666');
    console.log('%c   Para: coverImage: "/projects/nome-pasta/cover.jpg",', 'color: #00ff66');
    console.log('%c3. A capa aparecerá automaticamente no outdoor!', 'color: #ffff00');
    updateLoading(100);

    // Start animation loop
    animate();
}

// Start the game
init();
