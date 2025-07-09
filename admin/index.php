<?php
require_once '../includes/config.php';
require_once '../includes/functions.php';

// Redirecionar para login se não estiver autenticado
if (!isLoggedIn()) {
    header('Location: /admin/login.php');
    exit;
}

// Redirecionar para dashboard
header('Location: /admin/dashboard.php');
exit;
?>
