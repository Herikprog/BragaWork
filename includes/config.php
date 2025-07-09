<?php
// Configurações principais do sistema BRAGA WORK

// Configurações do banco de dados PostgreSQL
$database_url = getenv('DATABASE_URL');
if ($database_url) {
    $db_parts = parse_url($database_url);
    define('DB_HOST', $db_parts['host']);
    define('DB_NAME', ltrim($db_parts['path'], '/'));
    define('DB_USER', $db_parts['user']);
    define('DB_PASS', $db_parts['pass'] ?? '');
    define('DB_PORT', $db_parts['port'] ?? '5432');
} else {
    define('DB_HOST', $_ENV['PGHOST'] ?? 'localhost');
    define('DB_NAME', $_ENV['PGDATABASE'] ?? 'braga_work');
    define('DB_USER', $_ENV['PGUSER'] ?? 'postgres');
    define('DB_PASS', $_ENV['PGPASSWORD'] ?? '');
    define('DB_PORT', $_ENV['PGPORT'] ?? '5432');
}

// Configurações do site
define('SITE_NAME', 'BRAGA WORK');
define('SITE_URL', $_ENV['SITE_URL'] ?? 'http://localhost:5000');
define('ADMIN_EMAIL', $_ENV['ADMIN_EMAIL'] ?? 'contato@bragawork.com.br');

// Configurações de sessão
define('SESSION_TIMEOUT', 3600); // 1 hora

// Configurações de upload
define('UPLOAD_DIR', 'uploads/');
define('MAX_FILE_SIZE', 10 * 1024 * 1024); // 10MB

// Cores da marca BRAGA WORK
define('BRAND_BLUE', '#00AEEF');
define('BRAND_GREEN', '#8BC53F');
define('BRAND_DARK', '#0D1B2A');

// Iniciar sessão se não estiver ativa
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Timezone
date_default_timezone_set('America/Sao_Paulo');

// Configurações de erro (remover em produção)
if (($_ENV['ENVIRONMENT'] ?? 'development') !== 'production') {
    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);
}
?>
