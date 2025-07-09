/*===== ADMIN PANEL JAVASCRIPT =====*/

// Utility Functions
function showNotification(message, type = 'info', duration = 5000) {
    // Remove existing notification
    const existingNotification = document.querySelector('.admin-notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `admin-notification admin-notification--${type}`;
    notification.innerHTML = `
        <div class="admin-notification__content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="admin-notification__close">
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
        max-width: 500px;
    `;
    
    document.body.appendChild(notification);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.admin-notification__close');
    closeBtn.addEventListener('click', () => {
        removeNotification(notification);
    });
    
    // Auto remove after duration
    setTimeout(() => {
        if (notification.parentNode) {
            removeNotification(notification);
        }
    }, duration);
}

function removeNotification(notification) {
    notification.style.animation = 'slideOutRight 0.3s ease-out';
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 300);
}

// Add notification styles
function addNotificationStyles() {
    if (document.getElementById('admin-notification-styles')) return;
    
    const styles = document.createElement('style');
    styles.id = 'admin-notification-styles';
    styles.textContent = `
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
        
        .admin-notification__content {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            flex: 1;
        }
        
        .admin-notification__close {
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            padding: 0.25rem;
            border-radius: 0.25rem;
            transition: background-color 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .admin-notification__close:hover {
            background-color: rgba(255,255,255,0.2);
        }
    `;
    document.head.appendChild(styles);
}

// Initialize notification styles
document.addEventListener('DOMContentLoaded', addNotificationStyles);

// Form Validation
function validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    // Clear previous errors
    clearFormErrors(form);
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            showFieldError(field, 'Este campo é obrigatório');
            isValid = false;
        } else {
            // Specific validations
            if (field.type === 'email' && !isValidEmail(field.value)) {
                showFieldError(field, 'Email inválido');
                isValid = false;
            }
            
            if (field.type === 'url' && field.value && !isValidURL(field.value)) {
                showFieldError(field, 'URL inválida');
                isValid = false;
            }
        }
    });
    
    return isValid;
}

function showFieldError(field, message) {
    field.classList.add('error');
    
    // Create error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        color: #ff6b6b;
        font-size: 0.75rem;
        margin-top: 0.25rem;
        display: block;
    `;
    
    field.parentNode.appendChild(errorDiv);
}

function clearFormErrors(form) {
    // Remove error classes
    form.querySelectorAll('.error').forEach(el => {
        el.classList.remove('error');
    });
    
    // Remove error messages
    form.querySelectorAll('.field-error').forEach(el => {
        el.remove();
    });
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidURL(url) {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

// Data Table Enhancement
function enhanceDataTable(tableId) {
    const table = document.getElementById(tableId);
    if (!table) return;
    
    // Add sorting capability
    const headers = table.querySelectorAll('th[data-sort]');
    headers.forEach(header => {
        header.style.cursor = 'pointer';
        header.addEventListener('click', () => sortTable(table, header.dataset.sort));
    });
    
    // Add search functionality if search input exists
    const searchInput = document.querySelector(`[data-table="${tableId}"]`);
    if (searchInput) {
        searchInput.addEventListener('input', (e) => filterTable(table, e.target.value));
    }
}

function sortTable(table, column) {
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));
    const columnIndex = Array.from(table.querySelectorAll('th')).findIndex(th => th.dataset.sort === column);
    
    if (columnIndex === -1) return;
    
    const isAscending = table.dataset.sortOrder !== 'asc';
    table.dataset.sortOrder = isAscending ? 'asc' : 'desc';
    
    rows.sort((a, b) => {
        const aValue = a.cells[columnIndex].textContent.trim();
        const bValue = b.cells[columnIndex].textContent.trim();
        
        // Try to parse as numbers
        const aNum = parseFloat(aValue);
        const bNum = parseFloat(bValue);
        
        if (!isNaN(aNum) && !isNaN(bNum)) {
            return isAscending ? aNum - bNum : bNum - aNum;
        }
        
        // Sort as strings
        return isAscending ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    });
    
    // Reappend sorted rows
    rows.forEach(row => tbody.appendChild(row));
    
    // Update sort indicators
    table.querySelectorAll('th').forEach(th => {
        th.classList.remove('sort-asc', 'sort-desc');
    });
    
    const sortedHeader = table.querySelector(`th[data-sort="${column}"]`);
    sortedHeader.classList.add(isAscending ? 'sort-asc' : 'sort-desc');
}

function filterTable(table, searchTerm) {
    const tbody = table.querySelector('tbody');
    const rows = tbody.querySelectorAll('tr');
    const term = searchTerm.toLowerCase();
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(term) ? '' : 'none';
    });
}

// File Upload Enhancement
function enhanceFileUpload(inputId, previewId) {
    const input = document.getElementById(inputId);
    const preview = document.getElementById(previewId);
    
    if (!input) return;
    
    input.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        // Validate file size (10MB max)
        if (file.size > 10 * 1024 * 1024) {
            showNotification('Arquivo muito grande. Máximo 10MB.', 'error');
            input.value = '';
            return;
        }
        
        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/quicktime'];
        if (!allowedTypes.includes(file.type)) {
            showNotification('Tipo de arquivo não permitido.', 'error');
            input.value = '';
            return;
        }
        
        // Show preview for images
        if (preview && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                preview.innerHTML = `<img src="${e.target.result}" style="max-width: 200px; max-height: 200px; border-radius: 0.5rem;">`;
            };
            reader.readAsDataURL(file);
        }
    });
}

// Auto-save functionality
function enableAutoSave(formId, saveEndpoint) {
    const form = document.getElementById(formId);
    if (!form) return;
    
    let saveTimeout;
    const inputs = form.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            clearTimeout(saveTimeout);
            saveTimeout = setTimeout(() => {
                autoSaveForm(form, saveEndpoint);
            }, 2000); // Save after 2 seconds of inactivity
        });
    });
}

function autoSaveForm(form, endpoint) {
    const formData = new FormData(form);
    formData.append('auto_save', '1');
    
    fetch(endpoint, {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showNotification('Rascunho salvo automaticamente', 'success', 2000);
        }
    })
    .catch(error => {
        console.log('Auto-save failed:', error);
    });
}

// Keyboard Shortcuts
function initKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + S to save form
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            const activeForm = document.querySelector('form:focus-within');
            if (activeForm) {
                activeForm.dispatchEvent(new Event('submit'));
            }
        }
        
        // Escape to close modals
        if (e.key === 'Escape') {
            const activeModal = document.querySelector('.modal.active');
            if (activeModal) {
                activeModal.classList.remove('active');
            }
        }
        
        // Ctrl/Cmd + K for search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            const searchInput = document.querySelector('input[type="search"], input[placeholder*="search"], input[placeholder*="buscar"]');
            if (searchInput) {
                searchInput.focus();
            }
        }
    });
}

// Bulk Actions
function initBulkActions(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const checkboxes = container.querySelectorAll('input[type="checkbox"]');
    const bulkActions = container.querySelector('.bulk-actions');
    
    if (!bulkActions) return;
    
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateBulkActions);
    });
    
    function updateBulkActions() {
        const checkedBoxes = container.querySelectorAll('input[type="checkbox"]:checked');
        bulkActions.style.display = checkedBoxes.length > 0 ? 'block' : 'none';
        
        const selectedCount = container.querySelector('.selected-count');
        if (selectedCount) {
            selectedCount.textContent = checkedBoxes.length;
        }
    }
}

// Progress Indicators
function showProgress(message) {
    const progressDiv = document.createElement('div');
    progressDiv.id = 'admin-progress';
    progressDiv.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        color: white;
        font-size: 1.2rem;
    `;
    
    progressDiv.innerHTML = `
        <div style="text-align: center;">
            <div style="margin-bottom: 1rem;">
                <i class="fas fa-spinner fa-spin" style="font-size: 2rem;"></i>
            </div>
            <div>${message}</div>
        </div>
    `;
    
    document.body.appendChild(progressDiv);
}

function hideProgress() {
    const progressDiv = document.getElementById('admin-progress');
    if (progressDiv) {
        progressDiv.remove();
    }
}

// Data Export
function exportTableToCSV(tableId, filename) {
    const table = document.getElementById(tableId);
    if (!table) return;
    
    let csv = [];
    const rows = table.querySelectorAll('tr');
    
    rows.forEach(row => {
        const cols = row.querySelectorAll('td, th');
        const rowData = Array.from(cols).map(col => {
            return '"' + col.textContent.replace(/"/g, '""') + '"';
        });
        csv.push(rowData.join(','));
    });
    
    const csvContent = csv.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename || 'export.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Real-time Updates (using Server-Sent Events or WebSocket simulation)
function initRealTimeUpdates(endpoint) {
    if (!endpoint) return;
    
    // Check for updates every 30 seconds
    setInterval(() => {
        fetch(endpoint)
            .then(response => response.json())
            .then(data => {
                if (data.hasUpdates) {
                    showUpdateNotification();
                }
            })
            .catch(error => {
                console.log('Update check failed:', error);
            });
    }, 30000);
}

function showUpdateNotification() {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: var(--primary-color);
        color: white;
        padding: 1rem;
        border-radius: 0.5rem;
        box-shadow: 0 4px 16px rgba(0,0,0,0.2);
        z-index: 1000;
        cursor: pointer;
    `;
    
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.5rem;">
            <i class="fas fa-sync-alt"></i>
            <span>Novas atualizações disponíveis</span>
        </div>
    `;
    
    notification.addEventListener('click', () => {
        location.reload();
    });
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 10000);
}

// Initialize admin features
document.addEventListener('DOMContentLoaded', function() {
    // Initialize keyboard shortcuts
    initKeyboardShortcuts();
    
    // Enhance any data tables
    document.querySelectorAll('table[data-enhance]').forEach(table => {
        enhanceDataTable(table.id);
    });
    
    // Initialize bulk actions
    document.querySelectorAll('[data-bulk-actions]').forEach(container => {
        initBulkActions(container.id);
    });
    
    // Auto-focus first input in modals
    document.querySelectorAll('.modal').forEach(modal => {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    if (modal.classList.contains('active')) {
                        const firstInput = modal.querySelector('input, textarea, select');
                        if (firstInput) {
                            setTimeout(() => firstInput.focus(), 100);
                        }
                    }
                }
            });
        });
        
        observer.observe(modal, { attributes: true });
    });
    
    // Enhance forms with validation
    document.querySelectorAll('form[data-validate]').forEach(form => {
        form.addEventListener('submit', function(e) {
            if (!validateForm(form)) {
                e.preventDefault();
                showNotification('Por favor, corrija os erros no formulário', 'error');
            }
        });
    });
    
    // Add confirmation to delete buttons
    document.querySelectorAll('[data-confirm]').forEach(button => {
        button.addEventListener('click', function(e) {
            const message = this.dataset.confirm || 'Tem certeza?';
            if (!confirm(message)) {
                e.preventDefault();
            }
        });
    });
});

// Global error handler
window.addEventListener('error', function(e) {
    console.error('Admin panel error:', e.error);
    showNotification('Ocorreu um erro inesperado. Por favor, recarregue a página.', 'error');
});

// Export functions for global use
window.AdminJS = {
    showNotification,
    validateForm,
    enhanceDataTable,
    enhanceFileUpload,
    enableAutoSave,
    exportTableToCSV,
    showProgress,
    hideProgress,
    initRealTimeUpdates
};
