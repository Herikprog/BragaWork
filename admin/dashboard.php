<?php
require_once '../includes/config.php';
require_once '../includes/database.php';
require_once '../includes/functions.php';

requireLogin();

$db = Database::getInstance();

// Estatísticas do dashboard
$totalProjects = count($db->getProjects());
$totalQuotes = count($db->getQuoteRequests());
$newQuotes = count($db->getQuoteRequests('novo'));
$recentQuotes = array_slice($db->getQuoteRequests(), 0, 5);
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard - <?php echo SITE_NAME; ?></title>
    <link rel="stylesheet" href="../assets/css/style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
        .admin-header {
            background: linear-gradient(145deg, #1a2332, #0f1a26);
            padding: 1rem 0;
            border-bottom: 1px solid rgba(0, 174, 239, 0.1);
            margin-bottom: 2rem;
        }
        
        .admin-nav {
            display: flex;
            justify-content: space-between;
            align-items: center;
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 1rem;
        }
        
        .admin-logo {
            font-size: 1.5rem;
            font-weight: var(--font-bold);
            background: var(--gradient-primary);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        
        .admin-menu {
            display: flex;
            gap: 2rem;
            align-items: center;
        }
        
        .admin-menu a {
            color: var(--gray-color);
            text-decoration: none;
            transition: color var(--transition-fast);
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .admin-menu a:hover,
        .admin-menu a.active {
            color: var(--primary-color);
        }
        
        .admin-user {
            display: flex;
            align-items: center;
            gap: 1rem;
            color: var(--gray-color);
        }
        
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1.5rem;
            margin-bottom: 3rem;
        }
        
        .stat-card {
            background: linear-gradient(145deg, #1a2332, #0f1a26);
            padding: 2rem;
            border-radius: 1rem;
            border: 1px solid rgba(0, 174, 239, 0.1);
            transition: all var(--transition-fast);
        }
        
        .stat-card:hover {
            border-color: var(--primary-color);
            transform: translateY(-2px);
        }
        
        .stat-icon {
            font-size: 2.5rem;
            color: var(--primary-color);
            margin-bottom: 1rem;
        }
        
        .stat-number {
            font-size: 2rem;
            font-weight: var(--font-bold);
            color: var(--white-color);
            margin-bottom: 0.5rem;
        }
        
        .stat-label {
            color: var(--gray-color);
            font-size: var(--small-font-size);
        }
        
        .recent-section {
            background: linear-gradient(145deg, #1a2332, #0f1a26);
            padding: 2rem;
            border-radius: 1rem;
            border: 1px solid rgba(0, 174, 239, 0.1);
        }
        
        .section-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1.5rem;
        }
        
        .section-title {
            font-size: var(--h3-font-size);
            color: var(--white-color);
        }
        
        .quote-item {
            padding: 1rem;
            border-bottom: 1px solid rgba(108, 117, 125, 0.2);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .quote-item:last-child {
            border-bottom: none;
        }
        
        .quote-info h4 {
            color: var(--white-color);
            margin-bottom: 0.25rem;
        }
        
        .quote-info p {
            color: var(--gray-color);
            font-size: var(--small-font-size);
            margin: 0;
        }
        
        .quote-status {
            padding: 0.25rem 0.75rem;
            border-radius: 1rem;
            font-size: var(--smaller-font-size);
            font-weight: var(--font-medium);
        }
        
        .status-novo {
            background: rgba(0, 174, 239, 0.2);
            color: var(--primary-color);
        }
        
        .status-em_analise {
            background: rgba(255, 193, 7, 0.2);
            color: #ffc107;
        }
        
        .status-respondido {
            background: rgba(139, 197, 63, 0.2);
            color: var(--secondary-color);
        }
        
        .status-finalizado {
            background: rgba(108, 117, 125, 0.2);
            color: var(--gray-color);
        }
        
        @media screen and (max-width: 768px) {
            .admin-nav {
                flex-direction: column;
                gap: 1rem;
            }
            
            .admin-menu {
                gap: 1rem;
            }
            
            .quote-item {
                flex-direction: column;
                align-items: flex-start;
                gap: 0.5rem;
            }
        }
    </style>
</head>
<body>
    <header class="admin-header">
        <nav class="admin-nav">
            <div class="admin-logo">BRAGA WORK</div>
            
            <div class="admin-menu">
                <a href="dashboard.php" class="active">
                    <i class="fas fa-tachometer-alt"></i>
                    Dashboard
                </a>
                <a href="projects.php">
                    <i class="fas fa-folder"></i>
                    Projetos
                </a>
                <a href="quotes.php">
                    <i class="fas fa-envelope"></i>
                    Orçamentos
                </a>
            </div>
            
            <div class="admin-user">
                <span>Bem-vindo, <?php echo htmlspecialchars($_SESSION['admin_username']); ?></span>
                <a href="logout.php" title="Sair">
                    <i class="fas fa-sign-out-alt"></i>
                </a>
            </div>
        </nav>
    </header>

    <main class="container">
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-icon">
                    <i class="fas fa-folder"></i>
                </div>
                <div class="stat-number"><?php echo $totalProjects; ?></div>
                <div class="stat-label">Projetos Total</div>
            </div>
            
            <div class="stat-card">
                <div class="stat-icon">
                    <i class="fas fa-envelope"></i>
                </div>
                <div class="stat-number"><?php echo $totalQuotes; ?></div>
                <div class="stat-label">Orçamentos Total</div>
            </div>
            
            <div class="stat-card">
                <div class="stat-icon">
                    <i class="fas fa-clock"></i>
                </div>
                <div class="stat-number"><?php echo $newQuotes; ?></div>
                <div class="stat-label">Novos Orçamentos</div>
            </div>
            
            <div class="stat-card">
                <div class="stat-icon">
                    <i class="fas fa-chart-line"></i>
                </div>
                <div class="stat-number"><?php echo date('d/m'); ?></div>
                <div class="stat-label">Hoje</div>
            </div>
        </div>
        
        <div class="recent-section">
            <div class="section-header">
                <h3 class="section-title">Orçamentos Recentes</h3>
                <a href="quotes.php" class="button button--secondary">
                    Ver Todos
                </a>
            </div>
            
            <?php if (empty($recentQuotes)): ?>
                <p style="color: var(--gray-color); text-align: center; padding: 2rem;">
                    Nenhum orçamento encontrado.
                </p>
            <?php else: ?>
                <?php foreach ($recentQuotes as $quote): ?>
                    <div class="quote-item">
                        <div class="quote-info">
                            <h4><?php echo htmlspecialchars($quote['name']); ?></h4>
                            <p><?php echo htmlspecialchars($quote['email']); ?></p>
                            <p><?php echo htmlspecialchars($quote['project_type']); ?></p>
                            <p><?php echo date('d/m/Y H:i', strtotime($quote['created_at'])); ?></p>
                        </div>
                        <div class="quote-status status-<?php echo $quote['status']; ?>">
                            <?php echo ucfirst(str_replace('_', ' ', $quote['status'])); ?>
                        </div>
                    </div>
                <?php endforeach; ?>
            <?php endif; ?>
        </div>
    </main>

    <script src="../assets/js/admin.js"></script>
</body>
</html>
