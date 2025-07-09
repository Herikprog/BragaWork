<?php
require_once 'includes/config.php';
require_once 'includes/database.php';
require_once 'includes/functions.php';

$db = Database::getInstance();
$featured_projects = $db->getProjects(true, 6);
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo SITE_NAME; ?> - Criação de Sites Profissionais</title>
    <meta name="description" content="Desenvolvimento de sites modernos e profissionais. Criamos soluções digitais personalizadas para sua empresa.">
    
    <!-- CSS -->
    <link rel="stylesheet" href="assets/css/style.css">
    
    <!-- AOS Library -->
    <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet">
    
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
</head>
<body>
    <!-- Header -->
    <header class="header" id="header">
        <nav class="nav container">
            <div class="nav__logo">
                <h2>BRAGA WORK</h2>
            </div>
            
            <div class="nav__menu" id="nav-menu">
                <ul class="nav__list">
                    <li class="nav__item">
                        <a href="#home" class="nav__link active-link">Início</a>
                    </li>
                    <li class="nav__item">
                        <a href="#about" class="nav__link">Sobre</a>
                    </li>
                    <li class="nav__item">
                        <a href="#services" class="nav__link">Serviços</a>
                    </li>
                    <li class="nav__item">
                        <a href="#portfolio" class="nav__link">Portfólio</a>
                    </li>
                    <li class="nav__item">
                        <a href="#contact" class="nav__link">Contato</a>
                    </li>
                </ul>
                
                <div class="nav__close" id="nav-close">
                    <i class="fas fa-times"></i>
                </div>
            </div>
            
            <div class="nav__toggle" id="nav-toggle">
                <i class="fas fa-bars"></i>
            </div>
        </nav>
    </header>

    <main class="main">
        <!-- Home Section -->
        <section class="home section" id="home">
            <div class="home__container container grid">
                <div class="home__content" data-aos="fade-right">
                    <span class="home__subtitle">Desenvolvimento Web Profissional</span>
                    <h1 class="home__title">
                        Criamos Sites <span class="highlight">Modernos</span> e <span class="highlight">Funcionais</span>
                    </h1>
                    <p class="home__description">
                        Transformamos suas ideias em realidade digital. Desenvolvemos sites responsivos, 
                        rápidos e otimizados para converter visitantes em clientes.
                    </p>
                    
                    <div class="home__buttons">
                        <a href="#contact" class="button button--primary">
                            <i class="fas fa-rocket"></i>
                            Solicitar Orçamento
                        </a>
                        <a href="#portfolio" class="button button--secondary">
                            <i class="fas fa-eye"></i>
                            Ver Portfólio
                        </a>
                    </div>
                </div>
                
                <div class="home__img" data-aos="fade-left" data-aos-delay="200">
                    <div class="home__blob">
                        <svg viewBox="0 0 200 187" xmlns="http://www.w3.org/2000/svg">
                            <mask id="mask0" mask-type="alpha">
                                <path d="M190.312 36.4879C206.582 62.1187 201.309 102.826 182.328 134.186C163.346 165.547 130.807 187.559 100.226 186.353C69.6454 185.297 41.0228 161.023 21.7403 129.362C2.45775 97.8511 -7.48481 59.1033 6.67581 34.5279C20.9871 10.1032 59.7028 -0.149132 97.9666 0.00163737C136.23 0.303176 174.193 10.857 190.312 36.4879Z"/>
                            </mask>
                            <g mask="url(#mask0)">
                                <path d="M190.312 36.4879C206.582 62.1187 201.309 102.826 182.328 134.186C163.346 165.547 130.807 187.559 100.226 186.353C69.6454 185.297 41.0228 161.023 21.7403 129.362C2.45775 97.8511 -7.48481 59.1033 6.67581 34.5279C20.9871 10.1032 59.7028 -0.149132 97.9666 0.00163737C136.23 0.303176 174.193 10.857 190.312 36.4879Z"/>
                                <image class="home__blob-img" x="12" y="18" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2300AEEF'%3E%3Cpath d='M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z'/%3E%3C/svg%3E"/>
                            </g>
                        </svg>
                    </div>
                </div>
            </div>
            
            <!-- Floating Elements -->
            <div class="home__scroll">
                <a href="#about" class="home__scroll-button">
                    <i class="fas fa-mouse"></i>
                    <span class="home__scroll-name">Rolar para baixo</span>
                    <i class="fas fa-arrow-down home__scroll-arrow"></i>
                </a>
            </div>
        </section>

        <!-- About Section -->
        <section class="about section" id="about">
            <div class="about__container container grid">
                <div class="about__img" data-aos="fade-right">
                    <svg viewBox="0 0 200 187" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <linearGradient id="aboutGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" style="stop-color:#00AEEF;stop-opacity:1" />
                                <stop offset="100%" style="stop-color:#8BC53F;stop-opacity:1" />
                            </linearGradient>
                        </defs>
                        <path fill="url(#aboutGradient)" d="M40.5,-48.2C54.2,-36.1,68.1,-23.7,70.8,-8.7C73.5,6.3,65,23.9,53.6,38.8C42.2,53.7,27.9,65.9,11.2,68.9C-5.5,71.9,-24.6,65.7,-39.8,53.2C-55,40.7,-66.3,21.9,-68.2,2.2C-70.1,-17.5,-62.6,-38.1,-49.8,-50.4C-37,-62.7,-18.5,-66.7,-1.6,-64.8C15.3,-62.9,26.8,-60.3,40.5,-48.2Z"/>
                    </svg>
                </div>
                
                <div class="about__data" data-aos="fade-left">
                    <h2 class="section__title about__title">Sobre a BRAGA WORK</h2>
                    <p class="about__description">
                        Somos especializados em desenvolvimento web com foco em resultados. 
                        Nossa missão é criar soluções digitais que impulsionem o crescimento 
                        do seu negócio através de sites modernos, responsivos e otimizados.
                    </p>
                    
                    <div class="about__info">
                        <div class="about__info-item">
                            <span class="about__info-number">50+</span>
                            <span class="about__info-name">Projetos<br>Concluídos</span>
                        </div>
                        
                        <div class="about__info-item">
                            <span class="about__info-number">98%</span>
                            <span class="about__info-name">Clientes<br>Satisfeitos</span>
                        </div>
                        
                        <div class="about__info-item">
                            <span class="about__info-number">24/7</span>
                            <span class="about__info-name">Suporte<br>Técnico</span>
                        </div>
                    </div>
                    
                    <div class="about__buttons">
                        <a href="#contact" class="button button--primary">
                            <i class="fas fa-download"></i>
                            Fale Conosco
                        </a>
                    </div>
                </div>
            </div>
        </section>

        <!-- Services Section -->
        <section class="services section" id="services">
            <h2 class="section__title" data-aos="fade-up">Nossos Serviços</h2>
            <span class="section__subtitle" data-aos="fade-up" data-aos-delay="100">O que oferecemos</span>
            
            <div class="services__container container grid">
                <div class="services__content" data-aos="fade-up" data-aos-delay="200">
                    <div class="services__icon">
                        <i class="fas fa-laptop-code"></i>
                    </div>
                    <h3 class="services__title">Desenvolvimento<br>Frontend</h3>
                    <p class="services__description">
                        Criamos interfaces modernas e responsivas usando as mais recentes 
                        tecnologias web para garantir a melhor experiência do usuário.
                    </p>
                </div>
                
                <div class="services__content" data-aos="fade-up" data-aos-delay="300">
                    <div class="services__icon">
                        <i class="fas fa-server"></i>
                    </div>
                    <h3 class="services__title">Desenvolvimento<br>Backend</h3>
                    <p class="services__description">
                        Desenvolvemos sistemas robustos e seguros para gerenciar dados, 
                        usuários e funcionalidades complexas do seu site.
                    </p>
                </div>
                
                <div class="services__content" data-aos="fade-up" data-aos-delay="400">
                    <div class="services__icon">
                        <i class="fas fa-shopping-cart"></i>
                    </div>
                    <h3 class="services__title">E-commerce<br>Completo</h3>
                    <p class="services__description">
                        Lojas virtuais completas com sistema de pagamento, gestão de 
                        produtos e relatórios de vendas integrados.
                    </p>
                </div>
                
                <div class="services__content" data-aos="fade-up" data-aos-delay="500">
                    <div class="services__icon">
                        <i class="fas fa-mobile-alt"></i>
                    </div>
                    <h3 class="services__title">Design<br>Responsivo</h3>
                    <p class="services__description">
                        Sites que se adaptam perfeitamente a qualquer dispositivo, 
                        garantindo uma experiência consistente em todas as telas.
                    </p>
                </div>
                
                <div class="services__content" data-aos="fade-up" data-aos-delay="600">
                    <div class="services__icon">
                        <i class="fas fa-search"></i>
                    </div>
                    <h3 class="services__title">Otimização<br>SEO</h3>
                    <p class="services__description">
                        Otimizamos seu site para mecanismos de busca, aumentando 
                        a visibilidade e atraindo mais visitantes qualificados.
                    </p>
                </div>
                
                <div class="services__content" data-aos="fade-up" data-aos-delay="700">
                    <div class="services__icon">
                        <i class="fas fa-tools"></i>
                    </div>
                    <h3 class="services__title">Manutenção<br>e Suporte</h3>
                    <p class="services__description">
                        Oferecemos suporte contínuo e manutenção para manter seu 
                        site sempre atualizado e funcionando perfeitamente.
                    </p>
                </div>
            </div>
        </section>

        <!-- Portfolio Section -->
        <section class="portfolio section" id="portfolio">
            <h2 class="section__title" data-aos="fade-up">Portfólio</h2>
            <span class="section__subtitle" data-aos="fade-up" data-aos-delay="100">Nossos trabalhos mais recentes</span>
            
            <div class="portfolio__container container">
                <div class="portfolio__grid" id="portfolio-grid">
                    <?php foreach ($featured_projects as $project): ?>
                    <div class="portfolio__item" data-aos="fade-up" data-aos-delay="200">
                        <div class="portfolio__img-container">
                            <?php if ($project['video_url']): ?>
                                <video class="portfolio__video" loop muted playsinline>
                                    <source src="<?php echo htmlspecialchars($project['video_url']); ?>" type="video/mp4">
                                </video>
                                <div class="portfolio__play-btn">
                                    <i class="fas fa-play"></i>
                                </div>
                            <?php else: ?>
                                <img src="<?php echo htmlspecialchars($project['image_url']); ?>" 
                                     alt="<?php echo htmlspecialchars($project['title']); ?>" 
                                     class="portfolio__img">
                            <?php endif; ?>
                            
                            <div class="portfolio__overlay">
                                <div class="portfolio__content">
                                    <h3 class="portfolio__title"><?php echo htmlspecialchars($project['title']); ?></h3>
                                    <p class="portfolio__description"><?php echo htmlspecialchars($project['description']); ?></p>
                                    <?php if ($project['project_url']): ?>
                                    <a href="<?php echo htmlspecialchars($project['project_url']); ?>" 
                                       target="_blank" class="portfolio__button">
                                        <i class="fas fa-external-link-alt"></i>
                                        Ver Projeto
                                    </a>
                                    <?php endif; ?>
                                </div>
                            </div>
                        </div>
                    </div>
                    <?php endforeach; ?>
                </div>
                
                <div class="portfolio__button-container" data-aos="fade-up" data-aos-delay="400">
                    <button class="button button--secondary" id="load-more-projects">
                        <i class="fas fa-plus"></i>
                        Carregar Mais Projetos
                    </button>
                </div>
            </div>
        </section>

        <!-- Contact Section -->
        <section class="contact section" id="contact">
            <h2 class="section__title" data-aos="fade-up">Solicitar Orçamento</h2>
            <span class="section__subtitle" data-aos="fade-up" data-aos-delay="100">Vamos conversar sobre seu projeto</span>
            
            <div class="contact__container container grid">
                <div class="contact__content" data-aos="fade-right">
                    <div class="contact__info">
                        <div class="contact__card">
                            <i class="fas fa-phone contact__card-icon"></i>
                            <h3 class="contact__card-title">Telefone</h3>
                            <span class="contact__card-data">(11) 99999-9999</span>
                        </div>
                        
                        <div class="contact__card">
                            <i class="fas fa-envelope contact__card-icon"></i>
                            <h3 class="contact__card-title">Email</h3>
                            <span class="contact__card-data">contato@bragawork.com.br</span>
                        </div>
                        
                        <div class="contact__card">
                            <i class="fas fa-map-marker-alt contact__card-icon"></i>
                            <h3 class="contact__card-title">Localização</h3>
                            <span class="contact__card-data">São Paulo, SP - Brasil</span>
                        </div>
                    </div>
                </div>
                
                <div class="contact__content" data-aos="fade-left" data-aos-delay="200">
                    <form class="contact__form" id="quote-form">
                        <div class="contact__form-div">
                            <label class="contact__form-tag">Nome Completo</label>
                            <input type="text" name="name" class="contact__form-input" required>
                        </div>
                        
                        <div class="contact__form-div">
                            <label class="contact__form-tag">Email</label>
                            <input type="email" name="email" class="contact__form-input" required>
                        </div>
                        
                        <div class="contact__form-div">
                            <label class="contact__form-tag">Telefone</label>
                            <input type="tel" name="phone" class="contact__form-input" placeholder="000 000 000" required>
                        </div>
                        
                        <div class="contact__form-div">
                            <label class="contact__form-tag">Tipo de Projeto</label>
                            <select name="project_type" class="contact__form-input" required>
                                <option value="">Selecione uma opção</option>
                                <option value="site-institucional">Site Institucional</option>
                                <option value="e-commerce">E-commerce</option>
                                <option value="landing-page">Landing Page</option>
                                <option value="sistema-web">Sistema Web</option>
                                <option value="blog">Blog</option>
                                <option value="outro">Outro</option>
                            </select>
                        </div>
                        
                        <div class="contact__form-div">
                            <label class="contact__form-tag">Orçamento Previsto</label>
                            <select name="budget_range" class="contact__form-input">
                                <option value="">Selecione uma faixa</option>
                                <option value="ate-2000">Até R$ 2.000</option>
                                <option value="2000-5000">R$ 2.000 - R$ 5.000</option>
                                <option value="5000-10000">R$ 5.000 - R$ 10.000</option>
                                <option value="acima-10000">Acima de R$ 10.000</option>
                            </select>
                        </div>
                        
                        <div class="contact__form-div contact__form-area">
                            <label class="contact__form-tag">Descrição do Projeto</label>
                            <textarea name="description" class="contact__form-input" required></textarea>
                        </div>
                        
                        <input type="hidden" name="csrf_token" value="<?php echo generateCSRFToken(); ?>">
                        
                        <button type="submit" class="button button--primary">
                            <i class="fas fa-paper-plane"></i>
                            Enviar Solicitação
                        </button>
                    </form>
                </div>
            </div>
        </section>
    </main>

    <!-- Footer -->
    <footer class="footer">
        <div class="footer__bg">
            <div class="footer__container container grid">
                <div>
                    <h1 class="footer__title">BRAGA WORK</h1>
                    <span class="footer__subtitle">Desenvolvimento Web Profissional</span>
                </div>
                
                <ul class="footer__links">
                    <li>
                        <a href="#services" class="footer__link">Serviços</a>
                    </li>
                    <li>
                        <a href="#portfolio" class="footer__link">Portfólio</a>
                    </li>
                    <li>
                        <a href="#contact" class="footer__link">Contato</a>
                    </li>
                </ul>
                
                <div class="footer__socials">
                    <a href="#" target="_blank" class="footer__social">
                        <i class="fab fa-facebook-f"></i>
                    </a>
                    <a href="#" target="_blank" class="footer__social">
                        <i class="fab fa-instagram"></i>
                    </a>
                    <a href="#" target="_blank" class="footer__social">
                        <i class="fab fa-linkedin-in"></i>
                    </a>
                </div>
            </div>
            
            <p class="footer__copy">&#169; 2025 BRAGA WORK. Todos os direitos reservados.</p>
        </div>
    </footer>
    
    <!-- Scroll Up -->
    <a href="#" class="scrollup" id="scroll-up">
        <i class="fas fa-arrow-up scrollup__icon"></i>
    </a>

    <!-- JavaScript -->
    <script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>
    <script src="assets/js/main.js"></script>
</body>
</html>
