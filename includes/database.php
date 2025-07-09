<?php
require_once 'config.php';

class Database {
    private $pdo;
    private static $instance = null;
    
    private function __construct() {
        try {
            $dsn = "pgsql:host=" . DB_HOST . ";port=" . DB_PORT . ";dbname=" . DB_NAME;
            $options = [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ];
            
            $this->pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
        } catch (PDOException $e) {
            die("Erro de conexão com o banco de dados: " . $e->getMessage());
        }
    }
    
    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    public function getConnection() {
        return $this->pdo;
    }
    
    // Métodos para projetos
    public function getProjects($featured_only = false, $limit = null) {
        $sql = "SELECT * FROM projects";
        $params = [];
        
        if ($featured_only) {
            $sql .= " WHERE featured = true";
        }
        
        $sql .= " ORDER BY order_index ASC, created_at DESC";
        
        if ($limit) {
            $sql .= " LIMIT :limit";
            $params['limit'] = $limit;
        }
        
        $stmt = $this->pdo->prepare($sql);
        
        if ($limit) {
            $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
        }
        
        $stmt->execute();
        return $stmt->fetchAll();
    }
    
    public function getProject($id) {
        $stmt = $this->pdo->prepare("SELECT * FROM projects WHERE id = ?");
        $stmt->execute([$id]);
        return $stmt->fetch();
    }
    
    public function addProject($data) {
        $sql = "INSERT INTO projects (title, description, image_url, video_url, project_url, featured, order_index) 
                VALUES (?, ?, ?, ?, ?, ?, ?)";
        $stmt = $this->pdo->prepare($sql);
        return $stmt->execute([
            $data['title'],
            $data['description'],
            $data['image_url'],
            $data['video_url'],
            $data['project_url'],
            $data['featured'] ? true : false,
            $data['order_index']
        ]);
    }
    
    public function updateProject($id, $data) {
        $sql = "UPDATE projects SET title = ?, description = ?, image_url = ?, video_url = ?, 
                project_url = ?, featured = ?, order_index = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?";
        $stmt = $this->pdo->prepare($sql);
        return $stmt->execute([
            $data['title'],
            $data['description'],
            $data['image_url'],
            $data['video_url'],
            $data['project_url'],
            $data['featured'] ? true : false,
            $data['order_index'],
            $id
        ]);
    }
    
    public function deleteProject($id) {
        $stmt = $this->pdo->prepare("DELETE FROM projects WHERE id = ?");
        return $stmt->execute([$id]);
    }
    
    // Métodos para orçamentos
    public function getQuoteRequests($status = null) {
        $sql = "SELECT * FROM quote_requests";
        $params = [];
        
        if ($status) {
            $sql .= " WHERE status = ?";
            $params[] = $status;
        }
        
        $sql .= " ORDER BY created_at DESC";
        
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }
    
    public function getQuoteRequest($id) {
        $stmt = $this->pdo->prepare("SELECT * FROM quote_requests WHERE id = ?");
        $stmt->execute([$id]);
        return $stmt->fetch();
    }
    
    public function addQuoteRequest($data) {
        $sql = "INSERT INTO quote_requests (name, email, phone, project_type, description, budget_range) 
                VALUES (?, ?, ?, ?, ?, ?)";
        $stmt = $this->pdo->prepare($sql);
        return $stmt->execute([
            $data['name'],
            $data['email'],
            $data['phone'],
            $data['project_type'],
            $data['description'],
            $data['budget_range']
        ]);
    }
    
    public function updateQuoteStatus($id, $status, $notes = null) {
        $sql = "UPDATE quote_requests SET status = ?, admin_notes = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?";
        $stmt = $this->pdo->prepare($sql);
        return $stmt->execute([$status, $notes, $id]);
    }
    
    public function deleteQuoteRequest($id) {
        $stmt = $this->pdo->prepare("DELETE FROM quote_requests WHERE id = ?");
        return $stmt->execute([$id]);
    }
    
    // Métodos para usuários
    public function getUserByUsername($username) {
        $stmt = $this->pdo->prepare("SELECT * FROM admin_users WHERE username = ?");
        $stmt->execute([$username]);
        return $stmt->fetch();
    }
    
    public function verifyPassword($password, $hash) {
        return password_verify($password, $hash);
    }
}
?>
