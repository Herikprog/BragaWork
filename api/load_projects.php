<?php
require_once '../includes/config.php';
require_once '../includes/database.php';
require_once '../includes/functions.php';

header('Content-Type: application/json');

try {
    $page = intval($_GET['page'] ?? 1);
    $limit = 6;
    $offset = ($page - 1) * $limit;
    
    $db = Database::getInstance();
    $pdo = $db->getConnection();
    
    // Get projects with pagination
    $stmt = $pdo->prepare("
        SELECT * FROM projects 
        WHERE featured = true 
        ORDER BY order_index ASC, created_at DESC 
        LIMIT :limit OFFSET :offset
    ");
    
    $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
    $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
    $stmt->execute();
    
    $projects = $stmt->fetchAll();
    
    // Check if there are more projects
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM projects WHERE featured = true");
    $stmt->execute();
    $totalProjects = $stmt->fetchColumn();
    
    $hasMore = ($offset + $limit) < $totalProjects;
    
    jsonResponse([
        'success' => true,
        'projects' => $projects,
        'hasMore' => $hasMore,
        'page' => $page
    ]);
    
} catch (Exception $e) {
    error_log("Erro ao carregar projetos: " . $e->getMessage());
    jsonResponse([
        'success' => false,
        'message' => 'Erro ao carregar projetos'
    ], 500);
}
?>