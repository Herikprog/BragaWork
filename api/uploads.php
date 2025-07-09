<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../includes/config.php';
require_once '../includes/functions.php';

// Verificar se o usuário está logado
if (!isLoggedIn()) {
    http_response_code(401);
    echo json_encode(['error' => 'Não autorizado']);
    exit;
}

try {
    $uploadsDir = '../uploads/';
    $files = [];
    
    if (is_dir($uploadsDir)) {
        $handle = opendir($uploadsDir);
        
        while (false !== ($entry = readdir($handle))) {
            if ($entry != '.' && $entry != '..') {
                $fullPath = $uploadsDir . $entry;
                
                if (is_file($fullPath)) {
                    $extension = strtolower(pathinfo($entry, PATHINFO_EXTENSION));
                    $size = filesize($fullPath);
                    $modified = filemtime($fullPath);
                    
                    // Determinar o tipo do arquivo
                    $type = 'other';
                    if (in_array($extension, ['jpg', 'jpeg', 'png', 'gif', 'webp'])) {
                        $type = 'image';
                    } elseif (in_array($extension, ['mp4', 'mov', 'avi', 'webm'])) {
                        $type = 'video';
                    }
                    
                    $files[] = [
                        'name' => $entry,
                        'path' => 'uploads/' . $entry,
                        'size' => $size,
                        'modified' => $modified,
                        'type' => $type,
                        'extension' => $extension
                    ];
                }
            }
        }
        
        closedir($handle);
    }
    
    // Ordenar por data de modificação (mais recente primeiro)
    usort($files, function($a, $b) {
        return $b['modified'] - $a['modified'];
    });
    
    echo json_encode([
        'success' => true,
        'files' => $files,
        'total' => count($files)
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erro ao listar arquivos: ' . $e->getMessage()]);
}
?>