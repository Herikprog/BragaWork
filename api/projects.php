<?php
require_once '../includes/config.php';
require_once '../includes/database.php';
require_once '../includes/functions.php';

header('Content-Type: application/json; charset=utf-8');

// Verificar se é uma requisição GET
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonResponse(['success' => false, 'message' => 'Método não permitido'], 405);
}

try {
    $db = Database::getInstance();
    
    // Parâmetros de paginação
    $page = isset($_GET['page']) ? max(1, intval($_GET['page'])) : 1;
    $limit = isset($_GET['limit']) ? max(1, min(50, intval($_GET['limit']))) : 6;
    $featured_only = isset($_GET['featured']) && $_GET['featured'] === 'true';
    
    // Calcular offset
    $offset = ($page - 1) * $limit;
    
    // Buscar projetos
    $sql = "SELECT * FROM projects";
    $params = [];
    
    if ($featured_only) {
        $sql .= " WHERE featured = 1";
    }
    
    $sql .= " ORDER BY order_index ASC, created_at DESC LIMIT :limit OFFSET :offset";
    
    $pdo = $db->getConnection();
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
    $stmt->bindParam(':offset', $offset, PDO::PARAM_INT);
    $stmt->execute();
    
    $projects = $stmt->fetchAll();
    
    // Contar total de projetos
    $countSql = "SELECT COUNT(*) FROM projects";
    if ($featured_only) {
        $countSql .= " WHERE featured = 1";
    }
    
    $countStmt = $pdo->prepare($countSql);
    $countStmt->execute();
    $totalProjects = $countStmt->fetchColumn();
    
    // Calcular informações de paginação
    $totalPages = ceil($totalProjects / $limit);
    $hasNextPage = $page < $totalPages;
    $hasPrevPage = $page > 1;
    
    jsonResponse([
        'success' => true,
        'projects' => $projects,
        'pagination' => [
            'current_page' => $page,
            'total_pages' => $totalPages,
            'total_projects' => $totalProjects,
            'limit' => $limit,
            'has_next_page' => $hasNextPage,
            'has_prev_page' => $hasPrevPage
        ]
    ]);
    
} catch (Exception $e) {
    logActivity("Erro ao buscar projetos: " . $e->getMessage(), 'ERROR');
    
    jsonResponse([
        'success' => false,
        'message' => 'Erro ao carregar projetos'
    ], 500);
}
?>
