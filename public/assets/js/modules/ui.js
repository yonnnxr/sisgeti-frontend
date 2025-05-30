export function initUIControls() {
    // Adiciona classe para indicar que o JavaScript está carregado
    document.body.classList.add('js-loaded');

    // Configura o menu responsivo
    setupResponsiveMenu();

    // Configura os tooltips
    setupTooltips();

    // Configura o tema
    setupTheme();

    // Configura o tratamento de erros global
    setupErrorHandling();
}

function setupResponsiveMenu() {
    // Adiciona botão de menu para mobile
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
        const menuButton = document.createElement('button');
        menuButton.className = 'menu-button';
        menuButton.innerHTML = '<i class="fas fa-bars"></i>';
        menuButton.setAttribute('aria-label', 'Menu');
        
        document.querySelector('.main-content')?.prepend(menuButton);

        // Configura o evento de clique
        menuButton.addEventListener('click', () => {
            sidebar.classList.toggle('active');
            menuButton.classList.toggle('active');
        });

        // Fecha o menu ao clicar fora
        document.addEventListener('click', (event) => {
            if (!sidebar.contains(event.target) && 
                !menuButton.contains(event.target) && 
                sidebar.classList.contains('active')) {
                sidebar.classList.remove('active');
                menuButton.classList.remove('active');
            }
        });
    }
}

function setupTooltips() {
    // Adiciona tooltips a todos os botões da barra de ferramentas
    document.querySelectorAll('.tool-button').forEach(button => {
        const title = button.getAttribute('title');
        if (title) {
            button.addEventListener('mouseenter', (event) => {
                showTooltip(event.target, title);
            });

            button.addEventListener('mouseleave', () => {
                hideTooltip();
            });
        }
    });
}

function showTooltip(element, text) {
    // Remove tooltip existente
    hideTooltip();

    // Cria novo tooltip
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = text;
    document.body.appendChild(tooltip);

    // Posiciona o tooltip
    const rect = element.getBoundingClientRect();
    tooltip.style.top = `${rect.bottom + 5}px`;
    tooltip.style.left = `${rect.left + (rect.width - tooltip.offsetWidth) / 2}px`;
}

function hideTooltip() {
    const tooltip = document.querySelector('.tooltip');
    if (tooltip) {
        tooltip.remove();
    }
}

function setupTheme() {
    // Verifica se há preferência salva
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
        // Usa preferência do sistema
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    }

    // Observa mudanças na preferência do sistema
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
        if (!localStorage.getItem('theme')) {
            document.documentElement.setAttribute('data-theme', event.matches ? 'dark' : 'light');
        }
    });
}

function setupErrorHandling() {
    window.addEventListener('error', (event) => {
        console.error('Erro global:', event.error);
        showErrorMessage('Ocorreu um erro inesperado. Por favor, recarregue a página.');
    });

    window.addEventListener('unhandledrejection', (event) => {
        console.error('Promessa não tratada:', event.reason);
        showErrorMessage('Ocorreu um erro na comunicação com o servidor.');
    });
}

function showErrorMessage(message) {
    // Remove mensagem de erro existente
    hideErrorMessage();

    // Cria nova mensagem de erro
    const errorContainer = document.createElement('div');
    errorContainer.className = 'error-message';
    errorContainer.innerHTML = `
        <div class="error-content">
            <i class="fas fa-exclamation-circle"></i>
            <span>${message}</span>
            <button class="close-button">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;

    // Adiciona ao DOM
    document.body.appendChild(errorContainer);

    // Configura o botão de fechar
    errorContainer.querySelector('.close-button').addEventListener('click', () => {
        hideErrorMessage();
    });

    // Remove automaticamente após 5 segundos
    setTimeout(() => {
        hideErrorMessage();
    }, 5000);
}

function hideErrorMessage() {
    const errorMessage = document.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
} 