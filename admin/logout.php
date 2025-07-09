<?php
require_once '../includes/config.php';
require_once '../includes/functions.php';

if (isLoggedIn()) {
    $username = $_SESSION['admin_username'] ?? 'unknown';
    logActivity("Logout administrativo: $username");
}

// Destruir sessão
session_unset();
session_destroy();

// Redirecionar para login
header('Location: login.php');
exit;
?>
