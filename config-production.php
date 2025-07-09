<?php
// CONFIGURAÇÃO PARA PRODUÇÃO
// Renomeie este arquivo para config.php após fazer o deploy

// ======================================
// CONFIGURAÇÕES DO BANCO DE DADOS
// ======================================
// Substitua pelos dados da sua hospedagem
define('DB_HOST', 'localhost');          // Host do banco (ex: localhost, ip do servidor)
define('DB_NAME', 'braga_work');         // Nome do banco de dados
define('DB_USER', 'seu_usuario');        // Usuário do banco
define('DB_PASS', 'sua_senha');          // Senha do banco
define('DB_PORT', '5432');               // Porta do PostgreSQL

// ======================================
// CONFIGURAÇÕES DO SITE
// ======================================
define('SITE_NAME', 'BRAGA WORK');
define('SITE_URL', 'https://seudominio.com.br');      // URL do seu site
define('ADMIN_EMAIL', 'contato@seudominio.com.br');   // Email do administrador

// ======================================
// CONFIGURAÇÕES DE SEGURANÇA
// ======================================
define('SESSION_TIMEOUT', 3600); // 1 hora

// ======================================
// CONFIGURAÇÕES DE UPLOAD
// ======================================
define('UPLOAD_DIR', 'uploads/');
define('MAX_FILE_SIZE', 10 * 1024 * 1024); // 10MB

// ======================================
// CORES DA MARCA BRAGA WORK
// ======================================
define('BRAND_BLUE', '#00AEEF');
define('BRAND_GREEN', '#8BC53F');
define('BRAND_DARK', '#0D1B2A');

// ======================================
// CONFIGURAÇÕES DE PRODUÇÃO
// ======================================
// Desabilitar exibição de erros em produção
ini_set('display_errors', 0);
ini_set('display_startup_errors', 0);
error_reporting(0);

// Log de erros
ini_set('log_errors', 1);
ini_set('error_log', 'error.log');

// Iniciar sessão
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Timezone
date_default_timezone_set('America/Sao_Paulo');

// ======================================
// CONFIGURAÇÕES DE EMAIL (OPCIONAL)
// ======================================
// Descomente e configure se quiser receber notificações por email
/*
define('SMTP_HOST', 'smtp.gmail.com');
define('SMTP_USER', 'seu_email@gmail.com');
define('SMTP_PASS', 'sua_senha_app');
define('SMTP_PORT', 587);
define('SMTP_SECURE', 'tls');
*/

// ======================================
// CONFIGURAÇÕES DE BACKUP (OPCIONAL)
// ======================================
// Configurações para backup automático
define('BACKUP_ENABLED', false);
define('BACKUP_PATH', 'backups/');
define('BACKUP_FREQUENCY', 'daily'); // daily, weekly, monthly
?>