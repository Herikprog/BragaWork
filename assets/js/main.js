/*===== MENU SHOW/HIDE =====*/
const navMenu = document.getElementById('nav-menu'),
      navToggle = document.getElementById('nav-toggle'),
      navClose = document.getElementById('nav-close')

/*===== MENU SHOW =====*/
/* Validate if constant exists */
if(navToggle){
    navToggle.addEventListener('click', () =>{
        navMenu.classList.add('show-menu')
    })
}

/*===== MENU HIDDEN =====*/
/* Validate if constant exists */
if(navClose){
    navClose.addEventListener('click', () =>{
        navMenu.classList.remove('show-menu')
    })
}

/*===== REMOVE MENU MOBILE =====*/
const navLink = document.querySelectorAll('.nav__link')

function linkAction(){
    const navMenu = document.getElementById('nav-menu')
    navMenu.classList.remove('show-menu')
}
navLink.forEach(n => n.addEventListener('click', linkAction))

/*===== ACCORDION SKILLS =====*/
const skillsContent = document.getElementsByClassName('skills__content'),
      skillsHeader = document.querySelectorAll('.skills__header')

function toggleSkills(){
    let itemClass = this.parentNode.className

    for(i = 0; i < skillsContent.length; i++){
        skillsContent[i].className = 'skills__content skills__close'
    }
    if(itemClass === 'skills__content skills__close'){
        this.parentNode.className = 'skills__content skills__open'
    }
}

skillsHeader.forEach((el) =>{
    el.addEventListener('click', toggleSkills)
})

/*===== QUALIFICATION TABS =====*/
const tabs = document.querySelectorAll('[data-target]'),
      tabContents = document.querySelectorAll('[data-content]')

tabs.forEach(tab =>{
    tab.addEventListener('click', () =>{
        const target = document.querySelector(tab.dataset.target)

        tabContents.forEach(tabContent =>{
            tabContent.classList.remove('qualification__active')
        })
        target.classList.add('qualification__active')

        tabs.forEach(tab =>{
            tab.classList.remove('qualification__active')
        })
        tab.classList.add('qualification__active')
    })
})

/*===== SERVICES MODAL =====*/
const modalViews = document.querySelectorAll('.services__modal'),
      modalBtns = document.querySelectorAll('.services__button'),
      modalCloses = document.querySelectorAll('.services__modal-close')

let modal = function(modalClick){
    modalViews[modalClick].classList.add('active-modal')
}

modalBtns.forEach((modalBtn, i) => {
    modalBtn.addEventListener('click', () =>{
        modal(i)
    })
})

modalCloses.forEach((modalClose) => {
    modalClose.addEventListener('click', () =>{
        modalViews.forEach((modalView) =>{
            modalView.classList.remove('active-modal')
        })
    })
})

/*===== PORTFOLIO SWIPER =====*/
// Removido temporariamente - usando grid ao invés de Swiper
// let swiperPortfolio = new Swiper(".portfolio__container", {
//     cssMode: true,
//     loop: true,
//     navigation: {
//         nextEl: ".swiper-button-next",
//         prevEl: ".swiper-button-prev",
//     },
//     pagination: {
//         el: ".swiper-pagination",
//         clickable: true,
//     },
// });

/*===== TESTIMONIAL =====*/
// Removido temporariamente - não está sendo usado
// let swiperTestimonial = new Swiper(".testimonial__container", {
//     loop: true,
//     grabCursor: true,
//     spaceBetween: 48,
//     pagination: {
//         el: ".swiper-pagination",
//         clickable: true,
//         dynamicBullets: true,
//     },
//     breakpoints:{
//         568:{
//             slidesPerView: 2,
//         }
//     }
// });

/*===== SCROLL SECTIONS ACTIVE LINK =====*/
const sections = document.querySelectorAll('section[id]')

function scrollActive(){
    const scrollY = window.pageYOffset

    sections.forEach(current =>{
        const sectionHeight = current.offsetHeight
        const sectionTop = current.offsetTop - 50;
        sectionId = current.getAttribute('id')

        if(scrollY > sectionTop && scrollY <= sectionTop + sectionHeight){
            document.querySelector('.nav__menu a[href*=' + sectionId + ']').classList.add('active-link')
        }else{
            document.querySelector('.nav__menu a[href*=' + sectionId + ']').classList.remove('active-link')
        }
    })
}
window.addEventListener('scroll', scrollActive)

/*===== CHANGE BACKGROUND HEADER =====*/ 
function scrollHeader(){
    const nav = document.getElementById('header')
    if(this.scrollY >= 80) nav.classList.add('scroll-header'); else nav.classList.remove('scroll-header')
}
window.addEventListener('scroll', scrollHeader)

/*===== SHOW SCROLL UP =====*/ 
function scrollUp(){
    const scrollUp = document.getElementById('scroll-up');
    if(this.scrollY >= 560) scrollUp.classList.add('show-scroll'); else scrollUp.classList.remove('show-scroll')
}
window.addEventListener('scroll', scrollUp)

/*===== DARK LIGHT THEME =====*/ 
const themeButton = document.getElementById('theme-button')
const darkTheme = 'dark-theme'
const iconTheme = 'uil-sun'

const selectedTheme = localStorage.getItem('selected-theme')
const selectedIcon = localStorage.getItem('selected-icon')

const getCurrentTheme = () => document.body.classList.contains(darkTheme) ? 'dark' : 'light'
const getCurrentIcon = () => themeButton.classList.contains(iconTheme) ? 'uil-moon' : 'uil-sun'

if (selectedTheme) {
  document.body.classList[selectedTheme === 'dark' ? 'add' : 'remove'](darkTheme)
  themeButton.classList[selectedIcon === 'uil-moon' ? 'add' : 'remove'](iconTheme)
}

if(themeButton){
    themeButton.addEventListener('click', () => {
        document.body.classList.toggle(darkTheme)
        themeButton.classList.toggle(iconTheme)
        localStorage.setItem('selected-theme', getCurrentTheme())
        localStorage.setItem('selected-icon', getCurrentIcon())
    })
}

/*===== BRAGA WORK CUSTOM FUNCTIONS =====*/

// Initialize AOS (Animate On Scroll)
document.addEventListener('DOMContentLoaded', function() {
    // Check if AOS is loaded
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            easing: 'ease-out-cubic',
            once: true,
            offset: 100
        });
    }
});

// Portfolio Video Play/Pause
document.addEventListener('DOMContentLoaded', function() {
    const portfolioItems = document.querySelectorAll('.portfolio__item');
    
    portfolioItems.forEach(item => {
        const video = item.querySelector('.portfolio__video');
        const playBtn = item.querySelector('.portfolio__play-btn');
        
        if (video && playBtn) {
            playBtn.addEventListener('click', function() {
                if (video.paused) {
                    video.play();
                    playBtn.style.opacity = '0';
                } else {
                    video.pause();
                    playBtn.style.opacity = '1';
                }
            });
            
            // Show play button when video ends
            video.addEventListener('ended', function() {
                playBtn.style.opacity = '1';
            });
            
            // Hide play button on mouseleave if video is playing
            item.addEventListener('mouseleave', function() {
                if (!video.paused) {
                    playBtn.style.opacity = '0';
                }
            });
        }
    });
});

// Load More Projects
document.addEventListener('DOMContentLoaded', function() {
    const loadMoreBtn = document.getElementById('load-more-projects');
    const portfolioGrid = document.getElementById('portfolio-grid');
    let currentPage = 1;
    let loading = false;
    
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            if (loading) return;
            
            loading = true;
            loadMoreBtn.classList.add('loading');
            loadMoreBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Carregando...';
            
            // Fetch more projects
            fetch(`api/projects.php?page=${currentPage + 1}&limit=6`)
                .then(response => response.json())
                .then(data => {
                    if (data.success && data.projects.length > 0) {
                        data.projects.forEach(project => {
                            const projectElement = createProjectElement(project);
                            portfolioGrid.appendChild(projectElement);
                        });
                        
                        currentPage++;
                        
                        // Re-initialize AOS for new elements
                        AOS.refresh();
                        
                        // Hide button if no more projects
                        if (data.projects.length < 6) {
                            loadMoreBtn.style.display = 'none';
                        }
                    } else {
                        loadMoreBtn.style.display = 'none';
                    }
                })
                .catch(error => {
                    console.error('Erro ao carregar projetos:', error);
                    showNotification('Erro ao carregar mais projetos', 'error');
                })
                .finally(() => {
                    loading = false;
                    loadMoreBtn.classList.remove('loading');
                    loadMoreBtn.innerHTML = '<i class="fas fa-plus"></i> Carregar Mais Projetos';
                });
        });
    }
});

// Create project element
function createProjectElement(project) {
    const div = document.createElement('div');
    div.className = 'portfolio__item';
    div.setAttribute('data-aos', 'fade-up');
    
    const mediaContent = project.video_url ? 
        `<video class="portfolio__video" loop muted playsinline>
            <source src="${project.video_url}" type="video/mp4">
        </video>
        <div class="portfolio__play-btn">
            <i class="fas fa-play"></i>
        </div>` :
        `<img src="${project.image_url}" alt="${project.title}" class="portfolio__img">`;
    
    const projectUrl = project.project_url ? 
        `<a href="${project.project_url}" target="_blank" class="portfolio__button">
            <i class="fas fa-external-link-alt"></i>
            Ver Projeto
        </a>` : '';
    
    div.innerHTML = `
        <div class="portfolio__img-container">
            ${mediaContent}
            <div class="portfolio__overlay">
                <div class="portfolio__content">
                    <h3 class="portfolio__title">${project.title}</h3>
                    <p class="portfolio__description">${project.description}</p>
                    ${projectUrl}
                </div>
            </div>
        </div>
    `;
    
    return div;
}

// Quote Form Submission
document.addEventListener('DOMContentLoaded', function() {
    const quoteForm = document.getElementById('quote-form');
    
    if (quoteForm) {
        quoteForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(quoteForm);
            const submitBtn = quoteForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            
            // Disable button and show loading
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
            
            // Validate form
            if (!validateQuoteForm(formData)) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
                return;
            }
            
            // Submit form
            fetch('process_quote.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showNotification('Solicitação enviada com sucesso! Entraremos em contato em breve.', 'success');
                    quoteForm.reset();
                } else {
                    showNotification(data.message || 'Erro ao enviar solicitação. Tente novamente.', 'error');
                }
            })
            .catch(error => {
                console.error('Erro:', error);
                showNotification('Erro de conexão. Tente novamente.', 'error');
            })
            .finally(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            });
        });
    }
});

// Form validation
function validateQuoteForm(formData) {
    const name = formData.get('name').trim();
    const email = formData.get('email').trim();
    const phone = formData.get('phone').trim();
    const projectType = formData.get('project_type');
    const description = formData.get('description').trim();
    
    // Clear previous errors
    clearFormErrors();
    
    let isValid = true;
    
    if (!name || name.length < 2) {
        showFieldError('name', 'Nome deve ter pelo menos 2 caracteres');
        isValid = false;
    }
    
    if (!email || !isValidEmail(email)) {
        showFieldError('email', 'Email inválido');
        isValid = false;
    }
    
    if (!phone || !isValidPhone(phone)) {
        showFieldError('phone', 'Telefone inválido');
        isValid = false;
    }
    
    if (!projectType) {
        showFieldError('project_type', 'Selecione o tipo de projeto');
        isValid = false;
    }
    
    if (!description || description.length < 10) {
        showFieldError('description', 'Descrição deve ter pelo menos 10 caracteres');
        isValid = false;
    }
    
    return isValid;
}

// Validation helpers
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    // European format: 000 000 000 (9 digits with spaces)
    const phoneRegex = /^\d{3}\s\d{3}\s\d{3}$/;
    return phoneRegex.test(phone);
}

function showFieldError(fieldName, message) {
    const field = document.querySelector(`[name="${fieldName}"]`);
    if (field) {
        field.classList.add('error');
        
        // Create error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        errorDiv.style.color = '#ff6b6b';
        errorDiv.style.fontSize = '0.75rem';
        errorDiv.style.marginTop = '0.25rem';
        
        field.parentNode.appendChild(errorDiv);
    }
}

function clearFormErrors() {
    // Remove error classes
    document.querySelectorAll('.error').forEach(el => {
        el.classList.remove('error');
    });
    
    // Remove error messages
    document.querySelectorAll('.field-error').forEach(el => {
        el.remove();
    });
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.innerHTML = `
        <div class="notification__content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification__close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#8BC53F' : type === 'error' ? '#ff6b6b' : '#00AEEF'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 4px 16px rgba(0,0,0,0.2);
        z-index: 1001;
        display: flex;
        align-items: center;
        gap: 1rem;
        min-width: 300px;
        animation: slideInRight 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification__close');
    closeBtn.addEventListener('click', () => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Add notification animations to CSS
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification__content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        flex: 1;
    }
    
    .notification__close {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        padding: 0.25rem;
        border-radius: 0.25rem;
        transition: background-color 0.2s;
    }
    
    .notification__close:hover {
        background-color: rgba(255,255,255,0.2);
    }
`;
document.head.appendChild(notificationStyles);

// Phone number formatting (European format)
document.addEventListener('DOMContentLoaded', function() {
    const phoneInput = document.querySelector('input[name="phone"]');
    
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length <= 9) {
                if (value.length <= 3) {
                    value = value.replace(/(\d{0,3})/, '$1');
                } else if (value.length <= 6) {
                    value = value.replace(/(\d{3})(\d{0,3})/, '$1 $2');
                } else {
                    value = value.replace(/(\d{3})(\d{3})(\d{0,3})/, '$1 $2 $3');
                }
            }
            
            e.target.value = value;
        });
    }
});

// Smooth scrolling for anchor links
document.addEventListener('DOMContentLoaded', function() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Header scroll effect
document.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    const scrollTop = window.pageYOffset;
    
    if (scrollTop > 100) {
        header.style.background = 'rgba(13, 27, 42, 0.95)';
        header.style.backdropFilter = 'blur(10px)';
    } else {
        header.style.background = 'var(--dark-color)';
        header.style.backdropFilter = 'none';
    }
});

// Parallax effect for hero section
document.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.home__blob');
    
    parallaxElements.forEach(element => {
        const speed = 0.5;
        element.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// Lazy loading for images
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
});

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debouncing to scroll events
const debouncedScrollActive = debounce(scrollActive, 10);
const debouncedScrollHeader = debounce(scrollHeader, 10);
const debouncedScrollUp = debounce(scrollUp, 10);

window.removeEventListener('scroll', scrollActive);
window.removeEventListener('scroll', scrollHeader);
window.removeEventListener('scroll', scrollUp);

window.addEventListener('scroll', debouncedScrollActive);
window.addEventListener('scroll', debouncedScrollHeader);
window.addEventListener('scroll', debouncedScrollUp);
