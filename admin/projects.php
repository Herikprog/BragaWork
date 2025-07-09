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
            case 'add':
                $data = [
                    'title' => sanitizeInput($_POST['title']),
                    'description' => sanitizeInput($_POST['description']),
                    'image_url' => sanitizeInput($_POST['image_url']),
                    'video_url' => sanitizeInput($_POST['video_url']),
                    'project_url' => sanitizeInput($_POST['project_url']),
                    'featured' => isset($_POST['featured']),
                    'order_index' => intval($_POST['order_index'])
                ];
                
                if ($db->addProject($data)) {
                    $success_message = 'Projeto adicionado com sucesso!';
                    logActivity("Projeto adicionado: " . $data['title']);
                } else {
                    $error_message = 'Erro ao adicionar projeto';
                }
                break;
                
            case 'edit':
                $id = intval($_POST['project_id']);
                $data = [
                    'title' => sanitizeInput($_POST['title']),
                    'description' => sanitizeInput($_POST['description']),
                    'image_url' => sanitizeInput($_POST['image_url']),
                    'video_url' => sanitizeInput($_POST['video_url']),
                    'project_url' => sanitizeInput($_POST['project_url']),
                    'featured' => isset($_POST['featured']),
                    'order_index' => intval($_POST['order_index'])
                ];
                
                if ($db->updateProject($id, $data)) {
                    $success_message = 'Projeto atualizado com sucesso!';
                    logActivity("Projeto atualizado: " . $data['title']);
                } else {
                    $error_message = 'Erro ao atualizar projeto';
                }
                break;
                
            case 'delete':
                $id = intval($_POST['project_id']);
                if ($db->deleteProject($id)) {
                    $success_message = 'Projeto excluído com sucesso!';
                    logActivity("Projeto excluído ID: $id");
                } else {
                    $error_message = 'Erro ao excluir projeto';
                }
                break;
        }
    }
}

$projects = $db->getProjects();
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gerenciar Projetos - <?php echo SITE_NAME; ?></title>
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
        
        .projects-grid {
            display: grid;
            gap: 1.5rem;
            margin-bottom: 2rem;
        }
        
        .project-card {
            background: linear-gradient(145deg, #1a2332, #0f1a26);
            border-radius: 1rem;
            border: 1px solid rgba(0, 174, 239, 0.1);
            overflow: hidden;
        }
        
        .project-card-header {
            padding: 1.5rem;
            border-bottom: 1px solid rgba(108, 117, 125, 0.2);
        }
        
        .project-card-body {
            padding: 1.5rem;
        }
        
        .project-title {
            font-size: var(--h3-font-size);
            color: var(--white-color);
            margin-bottom: 0.5rem;
        }
        
        .project-meta {
            display: flex;
            gap: 1rem;
            margin-bottom: 1rem;
            flex-wrap: wrap;
        }
        
        .project-badge {
            padding: 0.25rem 0.75rem;
            border-radius: 1rem;
            font-size: var(--smaller-font-size);
            font-weight: var(--font-medium);
        }
        
        .badge-featured {
            background: rgba(0, 174, 239, 0.2);
            color: var(--primary-color);
        }
        
        .badge-order {
            background: rgba(108, 117, 125, 0.2);
            color: var(--gray-color);
        }
        
        .project-description {
            color: var(--gray-color);
            margin-bottom: 1rem;
            line-height: 1.6;
        }
        
        .project-links {
            display: flex;
            gap: 0.5rem;
            margin-bottom: 1rem;
            flex-wrap: wrap;
        }
        
        .project-link {
            color: var(--primary-color);
            font-size: var(--small-font-size);
            text-decoration: none;
            display: flex;
            align-items: center;
            gap: 0.25rem;
        }
        
        .project-actions {
            display: flex;
            gap: 0.5rem;
            justify-content: flex-end;
        }
        
        .btn-small {
            padding: 0.5rem 1rem;
            font-size: var(--small-font-size);
            border-radius: 0.25rem;
        }
        
        .btn-edit {
            background: rgba(255, 193, 7, 0.2);
            color: #ffc107;
            border: 1px solid rgba(255, 193, 7, 0.3);
        }
        
        .btn-delete {
            background: rgba(255, 107, 107, 0.2);
            color: #ff6b6b;
            border: 1px solid rgba(255, 107, 107, 0.3);
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
        
        .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
            margin-bottom: 1rem;
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
        
        .form-check {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .form-check input {
            accent-color: var(--primary-color);
        }
        
        .form-actions {
            display: flex;
            gap: 1rem;
            justify-content: flex-end;
            padding-top: 1rem;
            border-top: 1px solid rgba(108, 117, 125, 0.2);
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
            
            .form-row {
                grid-template-columns: 1fr;
            }
            
            .project-meta {
                flex-direction: column;
                gap: 0.5rem;
            }
            
            .project-actions {
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
                <a href="projects.php" class="active">
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
        <div class="page-header">
            <h1 class="page-title">Gerenciar Projetos</h1>
            <button class="button button--primary" onclick="openModal('add')">
                <i class="fas fa-plus"></i>
                Adicionar Projeto
            </button>
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
        
        <div class="projects-grid">
            <?php if (empty($projects)): ?>
                <div style="text-align: center; padding: 3rem; color: var(--gray-color);">
                    <i class="fas fa-folder-open" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                    <p>Nenhum projeto encontrado.</p>
                    <button class="button button--secondary" onclick="openModal('add')">
                        Adicionar Primeiro Projeto
                    </button>
                </div>
            <?php else: ?>
                <?php foreach ($projects as $project): ?>
                    <div class="project-card">
                        <div class="project-card-header">
                            <h3 class="project-title"><?php echo htmlspecialchars($project['title']); ?></h3>
                            <div class="project-meta">
                                <?php if ($project['featured']): ?>
                                    <span class="project-badge badge-featured">Destaque</span>
                                <?php endif; ?>
                                <span class="project-badge badge-order">Ordem: <?php echo $project['order_index']; ?></span>
                            </div>
                        </div>
                        
                        <div class="project-card-body">
                            <p class="project-description"><?php echo htmlspecialchars($project['description']); ?></p>
                            
                            <div class="project-links">
                                <?php if ($project['image_url']): ?>
                                    <a href="<?php echo htmlspecialchars($project['image_url']); ?>" target="_blank" class="project-link">
                                        <i class="fas fa-image"></i>
                                        Imagem
                                    </a>
                                <?php endif; ?>
                                
                                <?php if ($project['video_url']): ?>
                                    <a href="<?php echo htmlspecialchars($project['video_url']); ?>" target="_blank" class="project-link">
                                        <i class="fas fa-video"></i>
                                        Vídeo
                                    </a>
                                <?php endif; ?>
                                
                                <?php if ($project['project_url']): ?>
                                    <a href="<?php echo htmlspecialchars($project['project_url']); ?>" target="_blank" class="project-link">
                                        <i class="fas fa-external-link-alt"></i>
                                        Site
                                    </a>
                                <?php endif; ?>
                            </div>
                            
                            <div class="project-actions">
                                <button class="btn-small btn-edit" onclick="editProject(<?php echo htmlspecialchars(json_encode($project)); ?>)">
                                    <i class="fas fa-edit"></i>
                                    Editar
                                </button>
                                <button class="btn-small btn-delete" onclick="deleteProject(<?php echo $project['id']; ?>, '<?php echo htmlspecialchars($project['title']); ?>')">
                                    <i class="fas fa-trash"></i>
                                    Excluir
                                </button>
                            </div>
                        </div>
                    </div>
                <?php endforeach; ?>
            <?php endif; ?>
        </div>
    </main>

    <!-- Modal -->
    <div class="modal" id="project-modal">
        <div class="modal-content">
            <div class="modal-header">
                <h3 class="modal-title" id="modal-title">Adicionar Projeto</h3>
                <button class="modal-close" onclick="closeModal()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <div class="modal-body">
                <form id="project-form" method="POST">
                    <input type="hidden" name="csrf_token" value="<?php echo generateCSRFToken(); ?>">
                    <input type="hidden" name="action" id="form-action" value="add">
                    <input type="hidden" name="project_id" id="project-id">
                    
                    <div class="form-group">
                        <label class="form-label">Título do Projeto</label>
                        <input type="text" name="title" id="project-title" class="form-control" required>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Descrição</label>
                        <textarea name="description" id="project-description" class="form-control" rows="3" required></textarea>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">URL da Imagem</label>
                            <input type="url" name="image_url" id="project-image" class="form-control">
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">URL do Vídeo</label>
                            <input type="text" name="video_url" id="project-video" class="form-control" placeholder="uploads/video.mp4">
                            <small style="color: var(--gray-color); font-size: var(--smaller-font-size); margin-top: 0.5rem; display: block;">
                                Para vídeos locais, use: uploads/nome-do-arquivo.mp4
                            </small>
                            <button type="button" class="button button--secondary" style="margin-top: 0.5rem;" onclick="browseUploads('video')">
                                <i class="fas fa-folder-open"></i>
                                Procurar na pasta uploads
                            </button>
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">URL do Projeto</label>
                            <input type="url" name="project_url" id="project-url" class="form-control">
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Ordem</label>
                            <input type="number" name="order_index" id="project-order" class="form-control" value="0" min="0">
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <div class="form-check">
                            <input type="checkbox" name="featured" id="project-featured">
                            <label class="form-label" for="project-featured">Projeto em Destaque</label>
                        </div>
                    </div>
                    
                    <div class="form-actions">
                        <button type="button" class="button button--secondary" onclick="closeModal()">
                            Cancelar
                        </button>
                        <button type="submit" class="button button--primary">
                            <i class="fas fa-save"></i>
                            Salvar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <script src="../assets/js/admin.js"></script>
    <script>
        function openModal(action) {
            const modal = document.getElementById('project-modal');
            const form = document.getElementById('project-form');
            const modalTitle = document.getElementById('modal-title');
            const formAction = document.getElementById('form-action');
            
            form.reset();
            formAction.value = action;
            
            if (action === 'add') {
                modalTitle.textContent = 'Adicionar Projeto';
            }
            
            modal.classList.add('active');
        }

        function browseUploads(type) {
            // Criar modal para exibir arquivos
            const modal = document.createElement('div');
            modal.className = 'modal active';
            modal.id = 'uploads-modal';
            modal.innerHTML = `
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 class="modal-title">Selecionar Arquivo</h3>
                        <button class="modal-close" onclick="closeUploadsModal()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div id="uploads-loading" style="text-align: center; padding: 2rem;">
                            <i class="fas fa-spinner fa-spin" style="font-size: 2rem; color: var(--primary-color);"></i>
                            <p style="margin-top: 1rem;">Carregando arquivos...</p>
                        </div>
                        <div id="uploads-list" style="display: none;"></div>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            
            // Carregar arquivos
            fetch('../api/uploads.php')
                .then(response => response.json())
                .then(data => {
                    const loading = document.getElementById('uploads-loading');
                    const listContainer = document.getElementById('uploads-list');
                    
                    loading.style.display = 'none';
                    listContainer.style.display = 'block';
                    
                    if (data.success && data.files.length > 0) {
                        // Filtrar arquivos por tipo se especificado
                        let filteredFiles = data.files;
                        if (type === 'video') {
                            filteredFiles = data.files.filter(file => file.type === 'video');
                        } else if (type === 'image') {
                            filteredFiles = data.files.filter(file => file.type === 'image');
                        }
                        
                        if (filteredFiles.length === 0) {
                            listContainer.innerHTML = '<p style="text-align: center; color: var(--gray-color);">Nenhum arquivo encontrado na pasta uploads.</p>';
                            return;
                        }
                        
                        const filesList = filteredFiles.map(file => {
                            const icon = file.type === 'video' ? 'fa-video' : 
                                       file.type === 'image' ? 'fa-image' : 'fa-file';
                            const size = formatFileSize(file.size);
                            const date = new Date(file.modified * 1000).toLocaleDateString();
                            
                            return `
                                <div class="file-item" style="display: flex; align-items: center; padding: 1rem; border: 1px solid rgba(108, 117, 125, 0.2); border-radius: 0.5rem; margin-bottom: 0.5rem; cursor: pointer;" onclick="selectFile('${file.path}')">
                                    <i class="fas ${icon}" style="font-size: 1.5rem; color: var(--primary-color); margin-right: 1rem;"></i>
                                    <div style="flex: 1;">
                                        <div style="font-weight: var(--font-medium); color: var(--white-color);">${file.name}</div>
                                        <div style="font-size: var(--smaller-font-size); color: var(--gray-color);">${size} • ${date}</div>
                                    </div>
                                </div>
                            `;
                        }).join('');
                        
                        listContainer.innerHTML = filesList;
                    } else {
                        listContainer.innerHTML = '<p style="text-align: center; color: var(--gray-color);">Nenhum arquivo encontrado na pasta uploads.</p>';
                    }
                })
                .catch(error => {
                    console.error('Erro ao carregar arquivos:', error);
                    const loading = document.getElementById('uploads-loading');
                    const listContainer = document.getElementById('uploads-list');
                    
                    loading.style.display = 'none';
                    listContainer.style.display = 'block';
                    listContainer.innerHTML = '<p style="text-align: center; color: #ff6b6b;">Erro ao carregar arquivos.</p>';
                });
        }
        
        function selectFile(path) {
            const videoInput = document.getElementById('project-video');
            videoInput.value = path;
            closeUploadsModal();
        }
        
        function closeUploadsModal() {
            const modal = document.getElementById('uploads-modal');
            if (modal) {
                modal.remove();
            }
        }
        
        function formatFileSize(bytes) {
            if (bytes === 0) return '0 Bytes';
            const k = 1024;
            const sizes = ['Bytes', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        }
        
        function closeModal() {
            const modal = document.getElementById('project-modal');
            modal.classList.remove('active');
        }
        
        function editProject(project) {
            const modal = document.getElementById('project-modal');
            const modalTitle = document.getElementById('modal-title');
            const formAction = document.getElementById('form-action');
            
            modalTitle.textContent = 'Editar Projeto';
            formAction.value = 'edit';
            
            document.getElementById('project-id').value = project.id;
            document.getElementById('project-title').value = project.title;
            document.getElementById('project-description').value = project.description;
            document.getElementById('project-image').value = project.image_url || '';
            document.getElementById('project-video').value = project.video_url || '';
            document.getElementById('project-url').value = project.project_url || '';
            document.getElementById('project-order').value = project.order_index;
            document.getElementById('project-featured').checked = project.featured == 1;
            
            modal.classList.add('active');
        }
        
        function deleteProject(id, title) {
            if (confirm(`Tem certeza que deseja excluir o projeto "${title}"?`)) {
                const form = document.createElement('form');
                form.method = 'POST';
                form.innerHTML = `
                    <input type="hidden" name="csrf_token" value="<?php echo generateCSRFToken(); ?>">
                    <input type="hidden" name="action" value="delete">
                    <input type="hidden" name="project_id" value="${id}">
                `;
                document.body.appendChild(form);
                form.submit();
            }
        }
        
        // Fechar modal ao clicar fora
        document.getElementById('project-modal').addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal();
            }
        });
    </script>
</body>
</html>
