<?php
require_once 'includes/config.php';
require_once 'includes/database.php';
require_once 'includes/functions.php';

// Apenas permitir requests POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    die(json_encode(['success' => false, 'message' => 'Método não permitido']));
}

// Definir content-type
header('Content-Type: application/json');

try {
    // Verificar CSRF token
    if (!isset($_POST['csrf_token']) || !validateCSRFToken($_POST['csrf_token'])) {
        throw new Exception('Token de segurança inválido');
    }
    
    // Validar dados obrigatórios
    $required_fields = ['name', 'email', 'phone', 'description'];
    foreach ($required_fields as $field) {
        if (!isset($_POST[$field]) || empty(trim($_POST[$field]))) {
            throw new Exception("Campo '{$field}' é obrigatório");
        }
    }
    
    // Sanitizar e validar dados
    $name = sanitizeInput($_POST['name']);
    $email = sanitizeInput($_POST['email']);
    $phone = sanitizeInput($_POST['phone']);
    $project_type = sanitizeInput($_POST['project_type'] ?? '');
    $description = sanitizeInput($_POST['description']);
    $budget_range = sanitizeInput($_POST['budget_range'] ?? '');
    
    // Validar email
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        throw new Exception('Email inválido');
    }
    
    // Validar telefone (formato brasileiro básico)
    if (!preg_match('/^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/', $phone)) {
        throw new Exception('Telefone inválido');
    }
    
    // Preparar dados para inserção
    $quote_data = [
        'name' => $name,
        'email' => $email,
        'phone' => $phone,
        'project_type' => $project_type,
        'description' => $description,
        'budget_range' => $budget_range
    ];
    
    // Inserir no banco de dados
    $db = Database::getInstance();
    $result = $db->addQuoteRequest($quote_data);
    
    if ($result) {
        // Enviar email de notificação (opcional)
        $subject = "Nova solicitação de orçamento - BRAGA WORK";
        $message = "
            Nova solicitação de orçamento recebida:
            
            Nome: {$name}
            Email: {$email}
            Telefone: {$phone}
            Tipo de Projeto: {$project_type}
            Orçamento: {$budget_range}
            
            Descrição:
            {$description}
            
            Acesse o painel administrativo para mais detalhes.
        ";
        
        // Aqui você pode implementar o envio de email usando PHPMailer ou função mail()
        // mail(ADMIN_EMAIL, $subject, $message);
        
        echo json_encode([
            'success' => true,
            'message' => 'Solicitação enviada com sucesso! Entraremos em contato em breve.'
        ]);
    } else {
        throw new Exception('Erro ao salvar solicitação');
    }
    
} catch (Exception $e) {
    error_log("Erro ao processar formulário de orçamento: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>