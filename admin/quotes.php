<?php
require_once '../includes/config.php';
require_once '../includes/database.php';
require_once '../includes/functions.php';

requireLogin();

$db = Database::getInstance();
$success_message = '';
$error_message = '';

// Processar ações
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!verifyCSRFToken($_POST['csrf_token'] ?? '')) {
        $error_message = 'Token de segurança inválido';
    } else {
        $action = $_POST['action'] ?? '';
        
        switch ($action) {
            case 'update_status':
                $id = intval($_POST['quote_id']);
                $status = sanitizeInput($_POST['status']);
                $notes = sanitizeInput($_POST['admin_notes'] ?? '');
                
                if ($db->updateQuoteStatus($id, $status, $notes)) {
                    $success_message = 'Status atualizado com sucesso!';
                    logActivity("Status do orçamento #$id atualizado para: $status");
                } else {
                    $error_message = 'Erro ao atualizar status';
                }
                break;
                
            case 'delete':
                $id = intval($_POST['quote_id']);
                if ($db->deleteQuoteRequest($id)) {
                    $success_message = 'Orçamento excluído com sucesso!';
                    logActivity("Orçamento excluído ID: $id");
                } else {
                    $error_message = 'Erro ao excluir orçamento';
                }
                break;
        }
    }
}

// Filtros
$status_filter = $_GET['status'] ?? '';
$quotes = $status_filter ? $db->getQuoteRequests($status_filter) : $db->getQuoteRequests();

// Estatísticas
$stats = [
    'total' => count($db->getQuoteRequests()),
    'novo' => count($db->getQuoteRequests('novo')),
    'em_analise' => count($db->getQuoteRequests('em_analise')),
    'respondido' => count($db->getQuoteRequests('respondido')),
    'finalizado' => count($db->getQuoteRequests('finalizado'))
];
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gerenciar Orçamentos - <?php echo SITE_NAME; ?></title>
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
        
        .page-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2rem;
        }
        
        .page-title {
            font-size: var(--h2-font-size);
            color: var(--white-color);
        }
        
        .alert {
            padding: 1rem;
            border-radius: 0.5rem;
            margin-bottom: 1rem;
            border: 1px solid;
        }
        
        .alert-success {
            background: rgba(139, 197, 63, 0.1);
            color: var(--secondary-color);
            border-color: rgba(139, 197, 63, 0.3);
        }
        
        .alert-error {
            background: rgba(255, 107, 107, 0.1);
            color: #ff6b6b;
            border-color: rgba(255, 107, 107, 0.3);
        }
        
        .stats-row {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 1rem;
            margin-bottom: 2rem;
        }
        
        .stat-item {
            background: linear-gradient(145deg, #1a2332, #0f1a26);
            padding: 1rem;
            border-radius: 0.5rem;
            text-align: center;
            border: 1px solid rgba(0, 174, 239, 0.1);
            cursor: pointer;
            transition: all var(--transition-fast);
        }
        
        .stat-item:hover,
        .stat-item.active {
            border-color: var(--primary-color);
            transform: translateY(-2px);
        }
        
        .stat-number {
            font-size: 1.5rem;
            font-weight: var(--font-bold);
            color: var(--primary-color);
        }
        
        .stat-label {
            font-size: var(--small-font-size);
            color: var(--gray-color);
            text-transform: capitalize;
        }
        
        .quotes-container {
            background: linear-gradient(145deg, #1a2332, #0f1a26);
            border-radius: 1rem;
            border: 1px solid rgba(0, 174, 239, 0.1);
            overflow: hidden;
        }
        
        .quote-item {
            padding: 1.5rem;
            border-bottom: 1px solid rgba(108, 117, 125, 0.2);
            transition: background-color var(--transition-fast);
        }
        
        .quote-item:last-child {
            border-bottom: none;
        }
        
        .quote-item:hover {
            background: rgba(0, 174, 239, 0.05);
        }
        
        .quote-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 1rem;
            flex-wrap: wrap;
            gap: 1rem;
        }
        
        .quote-info h4 {
            color: var(--white-color);
            margin-bottom: 0.25rem;
            font-size: var(--h3-font-size);
        }
        
        .quote-meta {
            display: flex;
            gap: 1rem;
            margin-bottom: 0.5rem;
            flex-wrap: wrap;
        }
        
        .quote-meta span {
            color: var(--gray-color);
            font-size: var(--small-font-size);
            display: flex;
            align-items: center;
            gap: 0.25rem;
        }
        
        .quote-status {
            padding: 0.5rem 1rem;
            border-radius: 1rem;
            font-size: var(--small-font-size);
            font-weight: var(--font-medium);
            text-transform: capitalize;
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
        
        .quote-content {
            margin-bottom: 1rem;
        }
        
        .quote-description {
            background: rgba(13, 27, 42, 0.5);
            padding: 1rem;
            border-radius: 0.5rem;
            color: var(--gray-color);
            line-height: 1.6;
            margin-bottom: 1rem;
        }
        
        .quote-details {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
            margin-bottom: 1rem;
        }
        
        .detail-item {
            display: flex;
            flex-direction: column;
        }
        
        .detail-label {
            color: var(--primary-color);
            font-size: var(--small-font-size);
            font-weight: var(--font-medium);
            margin-bottom: 0.25rem;
        }
        
        .detail-value {
            color: var(--white-color);
        }
        
        .quote-actions {
            display: flex;
            gap: 0.5rem;
            flex-wrap: wrap;
        }
        
        .btn-small {
            padding: 0.5rem 1rem;
            font-size: var(--small-font-size);
            border-radius: 0.25rem;
            border: none;
            cursor: pointer;
            transition: all var(--transition-fast);
        }
        
        .btn-view {
            background: rgba(0, 174, 239, 0.2);
            color: var(--primary-color);
        }
        
        .btn-edit {
            background: rgba(255, 193, 7, 0.2);
            color: #ffc107;
        }
        
        .btn-delete {
            background: rgba(255, 107, 107, 0.2);
            color: #ff6b6b;
        }
        
        .modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            z-index: var(--z-modal);
            align-items: center;
            justify-content: center;
            padding: 1rem;
        }
        
        .modal.active {
            display: flex;
        }
        
        .modal-content {
            background: linear-gradient(145deg, #1a2332, #0f1a26);
            border-radius: 1rem;
            border: 1px solid rgba(0, 174, 239, 0.1);
            max-width: 600px;
            width: 100%;
            max-height: 90vh;
            overflow-y: auto;
        }
        
        .modal-header {
            padding: 1.5rem;
            border-bottom: 1px solid rgba(108, 117, 125, 0.2);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .modal-title {
            font-size: var(--h3-font-size);
            color: var(--white-color);
        }
        
        .modal-close {
            background: none;
            border: none;
            color: var(--gray-color);
            font-size: 1.5rem;
            cursor: pointer;
        }
        
        .modal-body {
            padding: 1.5rem;
        }
        
        .form-group {
            margin-bottom: 1rem;
        }
        
        .form-label {
            display: block;
            color: var(--white-color);
            margin-bottom: 0.5rem;
            font-weight: var(--font-medium);
        }
        
        .form-control {
            width: 100%;
            padding: 0.75rem;
            background: var(--dark-color);
            border: 1px solid rgba(108, 117, 125, 0.3);
            border-radius: 0.5rem;
            color: var(--white-color);
            font-size: var(--normal-font-size);
        }
        
        .form-control:focus {
            outline: none;
            border-color: var(--primary-color);
        }
        
        .form-actions {
            display: flex;
            gap: 1rem;
            justify-content: flex-end;
            padding-top: 1rem;
            border-top: 1px solid rgba(108, 117, 125, 0.2);
        }
        
        .empty-state {
            text-align: center;
            padding: 3rem;
            color: var(--gray-color);
        }
        
        .empty-state i {
            font-size: 3rem;
            margin-bottom: 1rem;
            color: var(--primary-color);
        }
        
        @media screen and (max-width: 768px) {
            .admin-nav {
                flex-direction: column;
                gap: 1rem;
            }
            
            .admin-menu {
                gap: 1rem;
            }
            
            .page-header {
                flex-direction: column;
                gap: 1rem;
                align-items: stretch;
            }
            
            .quote-header {
                flex-direction: column;
            }
            
            .quote-meta {
                flex-direction: column;
                gap: 0.5rem;
            }
            
            .quote-details {
                grid-template-columns: 1fr;
            }
            
            .quote-actions {
                justify-content: center;
            }
        }
    </style>
</head>
<body>
    <header class="admin-header">
        <nav class="admin-nav">
            <div class="admin-logo">BRAGA WORK</div>
            
            <div class="admin-menu">
                <a href="dashboard.php">
                    <i class="fas fa-tachometer-alt"></i>
                    Dashboard
                </a>
                <a href="projects.php">
                    <i class="fas fa-folder"></i>
                    Projetos
                </a>
                <a href="quotes.php" class="active">
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
        <div class="page-header">
            <h1 class="page-title">Gerenciar Orçamentos</h1>
        </div>
        
        <?php if ($success_message): ?>
            <div class="alert alert-success">
                <i class="fas fa-check-circle"></i>
                <?php echo htmlspecialchars($success_message); ?>
            </div>
        <?php endif; ?>
        
        <?php if ($error_message): ?>
            <div class="alert alert-error">
                <i class="fas fa-exclamation-circle"></i>
                <?php echo htmlspecialchars($error_message); ?>
            </div>
        <?php endif; ?>
        
        <!-- Estatísticas -->
        <div class="stats-row">
            <div class="stat-item <?php echo empty($status_filter) ? 'active' : ''; ?>" onclick="filterByStatus('')">
                <div class="stat-number"><?php echo $stats['total']; ?></div>
                <div class="stat-label">Total</div>
            </div>
            <div class="stat-item <?php echo $status_filter === 'novo' ? 'active' : ''; ?>" onclick="filterByStatus('novo')">
                <div class="stat-number"><?php echo $stats['novo']; ?></div>
                <div class="stat-label">Novos</div>
            </div>
            <div class="stat-item <?php echo $status_filter === 'em_analise' ? 'active' : ''; ?>" onclick="filterByStatus('em_analise')">
                <div class="stat-number"><?php echo $stats['em_analise']; ?></div>
                <div class="stat-label">Em Análise</div>
            </div>
            <div class="stat-item <?php echo $status_filter === 'respondido' ? 'active' : ''; ?>" onclick="filterByStatus('respondido')">
                <div class="stat-number"><?php echo $stats['respondido']; ?></div>
                <div class="stat-label">Respondidos</div>
            </div>
            <div class="stat-item <?php echo $status_filter === 'finalizado' ? 'active' : ''; ?>" onclick="filterByStatus('finalizado')">
                <div class="stat-number"><?php echo $stats['finalizado']; ?></div>
                <div class="stat-label">Finalizados</div>
            </div>
        </div>
        
        <!-- Lista de Orçamentos -->
        <div class="quotes-container">
            <?php if (empty($quotes)): ?>
                <div class="empty-state">
                    <i class="fas fa-envelope-open"></i>
                    <h3>Nenhum orçamento encontrado</h3>
                    <p>
                        <?php if ($status_filter): ?>
                            Não há orçamentos com o status "<?php echo ucfirst(str_replace('_', ' ', $status_filter)); ?>".
                        <?php else: ?>
                            Aguardando as primeiras solicitações de orçamento.
                        <?php endif; ?>
                    </p>
                </div>
            <?php else: ?>
                <?php foreach ($quotes as $quote): ?>
                    <div class="quote-item">
                        <div class="quote-header">
                            <div class="quote-info">
                                <h4><?php echo htmlspecialchars($quote['name']); ?></h4>
                                <div class="quote-meta">
                                    <span>
                                        <i class="fas fa-envelope"></i>
                                        <?php echo htmlspecialchars($quote['email']); ?>
                                    </span>
                                    <span>
                                        <i class="fas fa-phone"></i>
                                        <?php echo htmlspecialchars($quote['phone']); ?>
                                    </span>
                                    <span>
                                        <i class="fas fa-calendar"></i>
                                        <?php echo date('d/m/Y H:i', strtotime($quote['created_at'])); ?>
                                    </span>
                                </div>
                            </div>
                            <div class="quote-status status-<?php echo $quote['status']; ?>">
                                <?php echo ucfirst(str_replace('_', ' ', $quote['status'])); ?>
                            </div>
                        </div>
                        
                        <div class="quote-content">
                            <div class="quote-details">
                                <div class="detail-item">
                                    <span class="detail-label">Tipo de Projeto</span>
                                    <span class="detail-value"><?php echo htmlspecialchars($quote['project_type']); ?></span>
                                </div>
                                <?php if ($quote['budget_range']): ?>
                                    <div class="detail-item">
                                        <span class="detail-label">Orçamento</span>
                                        <span class="detail-value"><?php echo htmlspecialchars($quote['budget_range']); ?></span>
                                    </div>
                                <?php endif; ?>
                            </div>
                            
                            <div class="quote-description">
                                <?php echo nl2br(htmlspecialchars($quote['description'])); ?>
                            </div>
                            
                            <?php if ($quote['admin_notes']): ?>
                                <div class="quote-description" style="border-left: 3px solid var(--primary-color);">
                                    <strong>Observações Administrativas:</strong><br>
                                    <?php echo nl2br(htmlspecialchars($quote['admin_notes'])); ?>
                                </div>
                            <?php endif; ?>
                        </div>
                        
                        <div class="quote-actions">
                            <button class="btn-small btn-view" onclick="viewQuote(<?php echo htmlspecialchars(json_encode($quote)); ?>)">
                                <i class="fas fa-eye"></i>
                                Ver Detalhes
                            </button>
                            <button class="btn-small btn-edit" onclick="updateStatus(<?php echo $quote['id']; ?>, '<?php echo $quote['status']; ?>', '<?php echo htmlspecialchars($quote['admin_notes']); ?>')">
                                <i class="fas fa-edit"></i>
                                Atualizar Status
                            </button>
                            <button class="btn-small btn-delete" onclick="deleteQuote(<?php echo $quote['id']; ?>, '<?php echo htmlspecialchars($quote['name']); ?>')">
                                <i class="fas fa-trash"></i>
                                Excluir
                            </button>
                        </div>
                    </div>
                <?php endforeach; ?>
            <?php endif; ?>
        </div>
    </main>

    <!-- Modal de Visualização -->
    <div class="modal" id="view-modal">
        <div class="modal-content">
            <div class="modal-header">
                <h3 class="modal-title">Detalhes do Orçamento</h3>
                <button class="modal-close" onclick="closeModal('view-modal')">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body" id="quote-details">
                <!-- Conteúdo será preenchido dinamicamente -->
            </div>
        </div>
    </div>

    <!-- Modal de Atualização de Status -->
    <div class="modal" id="status-modal">
        <div class="modal-content">
            <div class="modal-header">
                <h3 class="modal-title">Atualizar Status</h3>
                <button class="modal-close" onclick="closeModal('status-modal')">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <form id="status-form" method="POST">
                    <input type="hidden" name="csrf_token" value="<?php echo generateCSRFToken(); ?>">
                    <input type="hidden" name="action" value="update_status">
                    <input type="hidden" name="quote_id" id="status-quote-id">
                    
                    <div class="form-group">
                        <label class="form-label">Status</label>
                        <select name="status" id="quote-status" class="form-control" required>
                            <option value="novo">Novo</option>
                            <option value="em_analise">Em Análise</option>
                            <option value="respondido">Respondido</option>
                            <option value="finalizado">Finalizado</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Observações Administrativas</label>
                        <textarea name="admin_notes" id="admin-notes" class="form-control" rows="4" placeholder="Adicione observações internas..."></textarea>
                    </div>
                    
                    <div class="form-actions">
                        <button type="button" class="button button--secondary" onclick="closeModal('status-modal')">
                            Cancelar
                        </button>
                        <button type="submit" class="button button--primary">
                            <i class="fas fa-save"></i>
                            Atualizar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <script src="../assets/js/admin.js"></script>
    <script>
        function filterByStatus(status) {
            const url = new URL(window.location);
            if (status) {
                url.searchParams.set('status', status);
            } else {
                url.searchParams.delete('status');
            }
            window.location.href = url.toString();
        }
        
        function viewQuote(quote) {
            const modal = document.getElementById('view-modal');
            const detailsDiv = document.getElementById('quote-details');
            
            const budgetRow = quote.budget_range ? 
                `<div class="detail-item">
                    <span class="detail-label">Orçamento Previsto</span>
                    <span class="detail-value">${quote.budget_range}</span>
                </div>` : '';
            
            const notesRow = quote.admin_notes ? 
                `<div style="margin-top: 1rem;">
                    <span class="detail-label">Observações Administrativas</span>
                    <div style="background: rgba(13, 27, 42, 0.5); padding: 1rem; border-radius: 0.5rem; margin-top: 0.5rem; color: var(--gray-color);">
                        ${quote.admin_notes.replace(/\n/g, '<br>')}
                    </div>
                </div>` : '';
            
            detailsDiv.innerHTML = `
                <div class="quote-details">
                    <div class="detail-item">
                        <span class="detail-label">Nome</span>
                        <span class="detail-value">${quote.name}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Email</span>
                        <span class="detail-value">${quote.email}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Telefone</span>
                        <span class="detail-value">${quote.phone}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Tipo de Projeto</span>
                        <span class="detail-value">${quote.project_type}</span>
                    </div>
                    ${budgetRow}
                    <div class="detail-item">
                        <span class="detail-label">Data da Solicitação</span>
                        <span class="detail-value">${new Date(quote.created_at).toLocaleString('pt-BR')}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Status</span>
                        <span class="detail-value">
                            <span class="quote-status status-${quote.status}">
                                ${quote.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </span>
                        </span>
                    </div>
                </div>
                
                <div style="margin-top: 1rem;">
                    <span class="detail-label">Descrição do Projeto</span>
                    <div style="background: rgba(13, 27, 42, 0.5); padding: 1rem; border-radius: 0.5rem; margin-top: 0.5rem; color: var(--gray-color); line-height: 1.6;">
                        ${quote.description.replace(/\n/g, '<br>')}
                    </div>
                </div>
                
                ${notesRow}
            `;
            
            modal.classList.add('active');
        }
        
        function updateStatus(id, currentStatus, currentNotes) {
            const modal = document.getElementById('status-modal');
            document.getElementById('status-quote-id').value = id;
            document.getElementById('quote-status').value = currentStatus;
            document.getElementById('admin-notes').value = currentNotes || '';
            modal.classList.add('active');
        }
        
        function deleteQuote(id, name) {
            if (confirm(`Tem certeza que deseja excluir o orçamento de "${name}"?`)) {
                const form = document.createElement('form');
                form.method = 'POST';
                form.innerHTML = `
                    <input type="hidden" name="csrf_token" value="<?php echo generateCSRFToken(); ?>">
                    <input type="hidden" name="action" value="delete">
                    <input type="hidden" name="quote_id" value="${id}">
                `;
                document.body.appendChild(form);
                form.submit();
            }
        }
        
        function closeModal(modalId) {
            document.getElementById(modalId).classList.remove('active');
        }
        
        // Fechar modais ao clicar fora
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', function(e) {
                if (e.target === this) {
                    closeModal(this.id);
                }
            });
        });
    </script>
</body>
</html>
