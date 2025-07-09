<?php
require_once '../includes/config.php';
require_once '../includes/database.php';
require_once '../includes/functions.php';

header('Content-Type: application/json; charset=utf-8');

// Verificar se é uma requisição POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['success' => false, 'message' => 'Método não permitido'], 405);
}

// Verificar token CSRF
if (!isset($_POST['csrf_token']) || !verifyCSRFToken($_POST['csrf_token'])) {
    jsonResponse(['success' => false, 'message' => 'Token de segurança inválido'], 403);
}

// Validar e sanitizar dados
$name = sanitizeInput($_POST['name'] ?? '');
$email = sanitizeInput($_POST['email'] ?? '');
$phone = sanitizeInput($_POST['phone'] ?? '');
$project_type = sanitizeInput($_POST['project_type'] ?? '');
$description = sanitizeInput($_POST['description'] ?? '');
$budget_range = sanitizeInput($_POST['budget_range'] ?? '');

// Validações
$errors = [];

if (empty($name) || strlen($name) < 2) {
    $errors[] = 'Nome deve ter pelo menos 2 caracteres';
}

if (empty($email) || !validateEmail($email)) {
    $errors[] = 'Email inválido';
}

if (empty($phone) || !validatePhone($phone)) {
    $errors[] = 'Telefone inválido';
}

if (empty($project_type)) {
    $errors[] = 'Tipo de projeto é obrigatório';
}

if (empty($description) || strlen($description) < 10) {
    $errors[] = 'Descrição deve ter pelo menos 10 caracteres';
}

// Se houver erros, retornar
if (!empty($errors)) {
    jsonResponse([
        'success' => false,
        'message' => 'Dados inválidos',
        'errors' => $errors
    ], 400);
}

try {
    $db = Database::getInstance();
    
    // Dados para inserção
    $quoteData = [
        'name' => $name,
        'email' => $email,
        'phone' => formatPhone($phone),
        'project_type' => $project_type,
        'description' => $description,
        'budget_range' => $budget_range
    ];
    
    // Inserir no banco de dados
    if ($db->addQuoteRequest($quoteData)) {
        // Log da atividade
        logActivity("Nova solicitação de orçamento recebida de: $name ($email)");
        
        // Enviar email de notificação (opcional)
        $emailSubject = "Nova Solicitação de Orçamento - BRAGA WORK";
        $emailMessage = "
        <h2>Nova Solicitação de Orçamento</h2>
        <p><strong>Nome:</strong> $name</p>
        <p><strong>Email:</strong> $email</p>
        <p><strong>Telefone:</strong> " . formatPhone($phone) . "</p>
        <p><strong>Tipo de Projeto:</strong> $project_type</p>
        <p><strong>Orçamento:</strong> $budget_range</p>
        <p><strong>Descrição:</strong></p>
        <p>$description</p>
        <hr>
        <p>Acesse o painel administrativo para mais detalhes.</p>
        ";
        
        // Tentar enviar email (não bloqueia se falhar)
        try {
            sendEmail(ADMIN_EMAIL, $emailSubject, $emailMessage);
        } catch (Exception $e) {
            logActivity("Erro ao enviar email de notificação: " . $e->getMessage(), 'WARNING');
        }
        
        jsonResponse([
            'success' => true,
            'message' => 'Solicitação enviada com sucesso! Entraremos em contato em breve.'
        ]);
        
    } else {
        throw new Exception('Erro ao salvar no banco de dados');
    }
    
} catch (Exception $e) {
    logActivity("Erro ao processar solicitação de orçamento: " . $e->getMessage(), 'ERROR');
    
    jsonResponse([
        'success' => false,
        'message' => 'Erro interno do servidor. Tente novamente mais tarde.'
    ], 500);
}
?>
