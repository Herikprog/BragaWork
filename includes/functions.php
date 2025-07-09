<?php
require_once 'config.php';
require_once 'database.php';

// Função para verificar se o usuário está logado
function isLoggedIn() {
    return isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true;
}

// Função para verificar timeout da sessão
function checkSessionTimeout() {
    if (isset($_SESSION['last_activity'])) {
        if (time() - $_SESSION['last_activity'] > SESSION_TIMEOUT) {
            session_unset();
            session_destroy();
            return false;
        }
    }
    $_SESSION['last_activity'] = time();
    return true;
}

// Função para proteger páginas administrativas
function requireLogin() {
    if (!isLoggedIn() || !checkSessionTimeout()) {
        header('Location: login.php');
        exit;
    }
}

// Função para sanitizar entrada de dados
function sanitizeInput($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data, ENT_QUOTES, 'UTF-8');
    return $data;
}

// Função para validar email
function validateEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}

// Função para validar telefone europeu
function validatePhone($phone) {
    // European format: 000 000 000
    return preg_match('/^\d{3}\s\d{3}\s\d{3}$/', $phone);
}

// Função para formatar telefone europeu
function formatPhone($phone) {
    $phone = preg_replace('/[^0-9]/', '', $phone);
    if (strlen($phone) == 9) {
        return substr($phone, 0, 3) . ' ' . substr($phone, 3, 3) . ' ' . substr($phone, 6, 3);
    }
    return $phone;
}

// Função para gerar token CSRF
function generateCSRFToken() {
    if (!isset($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

// Função para verificar token CSRF
function verifyCSRFToken($token) {
    return isset($_SESSION['csrf_token']) && hash_equals($_SESSION['csrf_token'], $token);
}

// Alias para validateCSRFToken
function validateCSRFToken($token) {
    return verifyCSRFToken($token);
}

// Função para upload de arquivos
function uploadFile($file, $allowed_types = ['jpg', 'jpeg', 'png', 'gif', 'mp4', 'mov']) {
    if (!isset($file['error']) || is_array($file['error'])) {
        throw new RuntimeException('Parâmetros inválidos.');
    }
    
    switch ($file['error']) {
        case UPLOAD_ERR_OK:
            break;
        case UPLOAD_ERR_NO_FILE:
            throw new RuntimeException('Nenhum arquivo foi enviado.');
        case UPLOAD_ERR_INI_SIZE:
        case UPLOAD_ERR_FORM_SIZE:
            throw new RuntimeException('Arquivo muito grande.');
        default:
            throw new RuntimeException('Erro desconhecido.');
    }
    
    if ($file['size'] > MAX_FILE_SIZE) {
        throw new RuntimeException('Arquivo excede o tamanho máximo permitido.');
    }
    
    $finfo = new finfo(FILEINFO_MIME_TYPE);
    $mime = $finfo->file($file['tmp_name']);
    
    $allowed_mimes = [
        'jpg' => 'image/jpeg',
        'jpeg' => 'image/jpeg',
        'png' => 'image/png',
        'gif' => 'image/gif',
        'mp4' => 'video/mp4',
        'mov' => 'video/quicktime'
    ];
    
    $ext = array_search($mime, $allowed_mimes, true);
    
    if ($ext === false || !in_array($ext, $allowed_types)) {
        throw new RuntimeException('Formato de arquivo inválido.');
    }
    
    if (!is_dir(UPLOAD_DIR)) {
        mkdir(UPLOAD_DIR, 0755, true);
    }
    
    $filename = sprintf('%s.%s', sha1_file($file['tmp_name']), $ext);
    $filepath = UPLOAD_DIR . $filename;
    
    if (!move_uploaded_file($file['tmp_name'], $filepath)) {
        throw new RuntimeException('Falha ao mover o arquivo.');
    }
    
    return $filepath;
}

// Função para enviar email (simulação - em produção usar PHPMailer ou similar)
function sendEmail($to, $subject, $message) {
    // Em um ambiente real, você usaria PHPMailer ou similar
    $headers = "From: " . ADMIN_EMAIL . "\r\n";
    $headers .= "Reply-To: " . ADMIN_EMAIL . "\r\n";
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
    
    return mail($to, $subject, $message, $headers);
}

// Função para log de atividades
function logActivity($message, $level = 'INFO') {
    $log_file = 'logs/activity.log';
    $timestamp = date('Y-m-d H:i:s');
    $user = isset($_SESSION['admin_username']) ? $_SESSION['admin_username'] : 'guest';
    $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    
    $log_message = "[$timestamp] [$level] [$user] [$ip] $message" . PHP_EOL;
    
    if (!is_dir('logs')) {
        mkdir('logs', 0755, true);
    }
    
    file_put_contents($log_file, $log_message, FILE_APPEND | LOCK_EX);
}

// Função para resposta JSON
function jsonResponse($data, $status_code = 200) {
    http_response_code($status_code);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}
?>
