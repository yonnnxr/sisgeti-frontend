import { getCurrentMap } from './maps.js';
import { saveLayer } from './layers.js';

export function initPropertyPanel() {
    // Configura o botão de fechar
    const closeButton = document.getElementById('closeProperties');
    if (closeButton) {
        closeButton.addEventListener('click', closePanel);
    }

    // Configura o formulário
    const form = document.getElementById('propertyForm');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }

    // Configura o botão de redefinir
    const resetButton = document.getElementById('resetProperties');
    if (resetButton) {
        resetButton.addEventListener('click', resetForm);
    }

    // Configura o seletor de estilo
    const styleSelect = document.getElementById('layerStyle');
    if (styleSelect) {
        styleSelect.addEventListener('change', toggleCustomStyleOptions);
    }
}

function closePanel() {
    const panel = document.getElementById('propertyPanel');
    if (panel) {
        panel.classList.remove('active');
    }
}

function toggleCustomStyleOptions(event) {
    const customOptions = document.getElementById('customStyleOptions');
    if (customOptions) {
        customOptions.classList.toggle('hidden', event.target.value !== 'custom');
    }
}

async function handleFormSubmit(event) {
    event.preventDefault();

    const currentMap = getCurrentMap();
    if (!currentMap) {
        alert('Nenhum mapa selecionado.');
        return;
    }

    const form = event.target;
    const name = form.elements.name.value.trim();
    const description = form.elements.description.value.trim();
    const styleType = form.elements.style.value;

    let style = {};
    if (styleType === 'custom') {
        style = {
            color: form.elements.color.value,
            opacity: parseFloat(form.elements.opacity.value)
        };
    } else if (styleType === 'highlight') {
        style = {
            color: '#f59e0b',
            fillColor: '#fbbf24',
            fillOpacity: 0.3,
            weight: 3
        };
    }

    try {
        await saveLayer(currentMap.id, name, description, style);
        closePanel();
        form.reset();
    } catch (error) {
        console.error('Erro ao salvar camada:', error);
        alert('Erro ao salvar camada. Por favor, tente novamente.');
    }
}

function resetForm() {
    const form = document.getElementById('propertyForm');
    if (form) {
        form.reset();
        
        // Reseta também as opções de estilo personalizado
        const customOptions = document.getElementById('customStyleOptions');
        if (customOptions) {
            customOptions.classList.add('hidden');
        }
    }
} 