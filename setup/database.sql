-- Criação das tabelas para BRAGA WORK (PostgreSQL)

-- Tabela de usuários administrativos
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de projetos/portfólio
CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    video_url VARCHAR(500),
    project_url VARCHAR(500),
    featured BOOLEAN DEFAULT FALSE,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de solicitações de orçamento
CREATE TABLE IF NOT EXISTS quote_requests (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    project_type VARCHAR(100),
    description TEXT NOT NULL,
    budget_range VARCHAR(50),
    status VARCHAR(20) DEFAULT 'novo' CHECK (status IN ('novo', 'em_analise', 'respondido', 'finalizado')),
    admin_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criar função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para atualizar updated_at na tabela projects
CREATE TRIGGER update_projects_updated_at 
    BEFORE UPDATE ON projects 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger para atualizar updated_at na tabela quote_requests
CREATE TRIGGER update_quote_requests_updated_at 
    BEFORE UPDATE ON quote_requests 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Inserir usuário administrativo padrão (senha: admin123)
INSERT INTO users (username, password, email) VALUES 
('admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin@bragawork.com.br')
ON CONFLICT (username) DO NOTHING;

-- Inserir alguns projetos de exemplo
INSERT INTO projects (title, description, image_url, featured, order_index) VALUES 
('E-commerce Moderno', 'Loja virtual completa com sistema de pagamento integrado', 'https://via.placeholder.com/600x400/00AEEF/FFFFFF?text=E-commerce', TRUE, 1),
('Landing Page Corporativa', 'Página de conversão para empresa de consultoria', 'https://via.placeholder.com/600x400/8BC53F/FFFFFF?text=Landing+Page', TRUE, 2),
('Sistema de Gestão', 'Plataforma web para gerenciamento empresarial', 'https://via.placeholder.com/600x400/00AEEF/FFFFFF?text=Sistema+Web', FALSE, 3)
ON CONFLICT DO NOTHING;
