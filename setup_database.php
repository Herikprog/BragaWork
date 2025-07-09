<?php
require_once 'includes/config.php';

// Configurar conexão com DATABASE_URL
$database_url = getenv('DATABASE_URL');
if (!$database_url) {
    die("DATABASE_URL não encontrada. Verifique a configuração do banco de dados.");
}

// Parse da URL do banco
$db_parts = parse_url($database_url);
$host = $db_parts['host'];
$port = $db_parts['port'] ?? 5432;
$dbname = ltrim($db_parts['path'], '/');
$user = $db_parts['user'];
$password = $db_parts['pass'] ?? '';

try {
    $dsn = "pgsql:host=$host;port=$port;dbname=$dbname";
    $pdo = new PDO($dsn, $user, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
    
    echo "Conectado ao banco de dados com sucesso!\n";
    
    // Criar tabelas
    $sql_projects = "
    CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        image_url VARCHAR(500),
        video_url VARCHAR(500),
        project_url VARCHAR(500),
        featured BOOLEAN DEFAULT false,
        order_index INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )";
    
    $sql_quotes = "
    CREATE TABLE IF NOT EXISTS quote_requests (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        project_type VARCHAR(100),
        description TEXT NOT NULL,
        budget_range VARCHAR(50),
        status VARCHAR(20) DEFAULT 'novo',
        admin_notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )";
    
    $sql_admin_users = "
    CREATE TABLE IF NOT EXISTS admin_users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        email VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP
    )";
    
    $pdo->exec($sql_projects);
    echo "Tabela 'projects' criada com sucesso!\n";
    
    $pdo->exec($sql_quotes);
    echo "Tabela 'quote_requests' criada com sucesso!\n";
    
    $pdo->exec($sql_admin_users);
    echo "Tabela 'admin_users' criada com sucesso!\n";
    
    // Inserir usuário admin padrão se não existir
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM admin_users WHERE username = ?");
    $stmt->execute(['admin']);
    
    if ($stmt->fetchColumn() == 0) {
        $default_password = password_hash('admin123', PASSWORD_DEFAULT);
        $stmt = $pdo->prepare("INSERT INTO admin_users (username, password_hash, email) VALUES (?, ?, ?)");
        $stmt->execute(['admin', $default_password, 'admin@bragawork.com.br']);
        echo "Usuário admin criado com sucesso! (login: admin, senha: admin123)\n";
    }
    
    // Inserir alguns projetos de exemplo se não existirem
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM projects");
    $stmt->execute();
    
    if ($stmt->fetchColumn() == 0) {
        $example_projects = [
            [
                'title' => 'Site Institucional - Empresa XYZ',
                'description' => 'Desenvolvimento de site institucional moderno e responsivo para empresa do setor tecnológico.',
                'image_url' => 'https://via.placeholder.com/600x400/00AEEF/FFFFFF?text=Site+Institucional',
                'video_url' => null,
                'project_url' => '#',
                'featured' => true,
                'order_index' => 1
            ],
            [
                'title' => 'E-commerce - Loja Virtual',
                'description' => 'Plataforma de e-commerce completa com sistema de pagamento integrado e painel administrativo.',
                'image_url' => 'https://via.placeholder.com/600x400/8BC53F/FFFFFF?text=E-commerce',
                'video_url' => null,
                'project_url' => '#',
                'featured' => true,
                'order_index' => 2
            ],
            [
                'title' => 'Landing Page - Campanha Marketing',
                'description' => 'Landing page otimizada para conversão com formulários integrados e analytics.',
                'image_url' => 'https://via.placeholder.com/600x400/0D1B2A/FFFFFF?text=Landing+Page',
                'video_url' => null,
                'project_url' => '#',
                'featured' => true,
                'order_index' => 3
            ]
        ];
        
        $stmt = $pdo->prepare("INSERT INTO projects (title, description, image_url, video_url, project_url, featured, order_index) VALUES (?, ?, ?, ?, ?, ?, ?)");
        
        foreach ($example_projects as $project) {
            $stmt->execute([
                $project['title'],
                $project['description'],
                $project['image_url'],
                $project['video_url'],
                $project['project_url'],
                $project['featured'],
                $project['order_index']
            ]);
        }
        
        echo "Projetos de exemplo inseridos com sucesso!\n";
    }
    
    echo "\nConfiguração do banco de dados concluída com sucesso!\n";
    
} catch (PDOException $e) {
    die("Erro na configuração do banco de dados: " . $e->getMessage());
}
?>