<?php
require_once '../includes/config.php';
require_once '../includes/database.php';
require_once '../includes/functions.php';

// Se já estiver logado, redirecionar
if (isLoggedIn()) {
    header('Location: dashboard.php');
    exit;
}

$error_message = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = sanitizeInput($_POST['username'] ?? '');
    $password = $_POST['password'] ?? '';
    
    if (!empty($username) && !empty($password)) {
        try {
            $db = Database::getInstance();
            $user = $db->getUserByUsername($username);
            
            if ($user && $db->verifyPassword($password, $user['password_hash'])) {
                $_SESSION['admin_logged_in'] = true;
                $_SESSION['admin_user_id'] = $user['id'];
                $_SESSION['admin_username'] = $user['username'];
                $_SESSION['last_activity'] = time();
                
                logActivity("Login administrativo bem-sucedido para: $username");
                header('Location: dashboard.php');
                exit;
            } else {
                $error_message = 'Credenciais inválidas';
                logActivity("Tentativa de login falhada para: $username", 'WARNING');
            }
        } catch (Exception $e) {
            $error_message = 'Erro interno do servidor';
            logActivity("Erro no login: " . $e->getMessage(), 'ERROR');
        }
    } else {
        $error_message = 'Todos os campos são obrigatórios';
    }
}
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login Administrativo - <?php echo SITE_NAME; ?></title>
    <link rel="stylesheet" href="../assets/css/style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
        .login-container {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: var(--gradient-dark);
            padding: 2rem;
        }
        
        .login-box {
            background: linear-gradient(145deg, #1a2332, #0f1a26);
            border-radius: 1rem;
            padding: 3rem;
            box-shadow: var(--shadow-heavy);
            border: 1px solid rgba(0, 174, 239, 0.1);
            width: 100%;
            max-width: 400px;
        }
        
        .login-header {
            text-align: center;
            margin-bottom: 2rem;
        }
        
        .login-logo {
            font-size: 2rem;
            font-weight: var(--font-bold);
            background: var(--gradient-primary);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 0.5rem;
        }
        
        .login-subtitle {
            color: var(--gray-color);
            font-size: var(--small-font-size);
        }
        
        .login-form {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
        }
        
        .form-group {
            position: relative;
        }
        
        .form-group input {
            width: 100%;
            padding: 1rem;
            background: var(--dark-color);
            border: 2px solid rgba(108, 117, 125, 0.3);
            border-radius: 0.5rem;
            color: var(--white-color);
            font-size: var(--normal-font-size);
            transition: border-color var(--transition-fast);
        }
        
        .form-group input:focus {
            outline: none;
            border-color: var(--primary-color);
        }
        
        .form-group i {
            position: absolute;
            right: 1rem;
            top: 50%;
            transform: translateY(-50%);
            color: var(--gray-color);
        }
        
        .error-message {
            background: rgba(255, 107, 107, 0.1);
            color: #ff6b6b;
            padding: 0.75rem;
            border-radius: 0.5rem;
            border: 1px solid rgba(255, 107, 107, 0.3);
            font-size: var(--small-font-size);
            text-align: center;
        }
        
        .login-footer {
            text-align: center;
            margin-top: 2rem;
            padding-top: 2rem;
            border-top: 1px solid rgba(108, 117, 125, 0.2);
        }
        
        .back-link {
            color: var(--primary-color);
            text-decoration: none;
            font-size: var(--small-font-size);
            transition: color var(--transition-fast);
        }
        
        .back-link:hover {
            color: var(--secondary-color);
        }
    </style>
</head>
<body>
    <div class="login-container">
        <div class="login-box">
            <div class="login-header">
                <h1 class="login-logo">BRAGA WORK</h1>
                <p class="login-subtitle">Painel Administrativo</p>
            </div>
            
            <?php if ($error_message): ?>
                <div class="error-message">
                    <i class="fas fa-exclamation-triangle"></i>
                    <?php echo htmlspecialchars($error_message); ?>
                </div>
            <?php endif; ?>
            
            <form class="login-form" method="POST">
                <div class="form-group">
                    <input type="text" name="username" placeholder="Usuário" required>
                    <i class="fas fa-user"></i>
                </div>
                
                <div class="form-group">
                    <input type="password" name="password" placeholder="Senha" required>
                    <i class="fas fa-lock"></i>
                </div>
                
                <button type="submit" class="button button--primary">
                    <i class="fas fa-sign-in-alt"></i>
                    Entrar
                </button>
            </form>
            
            <div class="login-footer">
                <a href="../index.php" class="back-link">
                    <i class="fas fa-arrow-left"></i>
                    Voltar ao site
                </a>
            </div>
        </div>
    </div>
</body>
</html>
