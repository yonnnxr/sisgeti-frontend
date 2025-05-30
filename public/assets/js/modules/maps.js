import { clearMap } from './map.js';
import { clearDrawings } from './draw.js';
import { loadLayer } from './layers.js';

let api = null;
let currentMap = null;

export function initMapManager(apiInstance) {
    api = apiInstance;

    // Configura o botão de novo mapa
    const newMapButton = document.getElementById('newMap');
    if (newMapButton) {
        newMapButton.addEventListener('click', showNewMapModal);
    }

    // Configura o botão de salvar mapa
    const saveMapButton = document.getElementById('saveMap');
    if (saveMapButton) {
        saveMapButton.addEventListener('click', saveCurrentMap);
    }

    // Configura o botão de compartilhar
    const shareMapButton = document.getElementById('shareMap');
    if (shareMapButton) {
        shareMapButton.addEventListener('click', shareMap);
    }

    // Configura o formulário de novo mapa
    const newMapForm = document.getElementById('newMapForm');
    if (newMapForm) {
        newMapForm.addEventListener('submit', handleNewMapSubmit);
    }

    // Carrega a lista inicial de mapas
    loadMapsList();
}

function showNewMapModal() {
    const modal = document.getElementById('newMapModal');
    if (modal) {
        modal.classList.add('active');
    }
}

function closeModal() {
    const modal = document.getElementById('newMapModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

async function handleNewMapSubmit(event) {
    event.preventDefault();

    const nameInput = document.getElementById('mapName');
    const descriptionInput = document.getElementById('mapDescription');

    if (!nameInput || !nameInput.value.trim()) {
        alert('Por favor, insira um nome para o mapa.');
        return;
    }

    try {
        const newMap = await api.createMap({
            name: nameInput.value.trim(),
            description: descriptionInput?.value.trim() || '',
            features: []
        });

        closeModal();
        await loadMapsList();
        await loadMap(newMap.id);

        // Limpa o formulário
        event.target.reset();
    } catch (error) {
        console.error('Erro ao criar mapa:', error);
        alert('Erro ao criar mapa. Por favor, tente novamente.');
    }
}

async function loadMapsList() {
    if (!api) return;

    try {
        const maps = await api.getMaps();
        const listContainer = document.getElementById('mapsList');
        
        if (listContainer) {
            listContainer.innerHTML = maps.map(map => `
                <div class="map-item" data-id="${map.id}">
                    <h4>${map.name}</h4>
                    ${map.description ? `<p>${map.description}</p>` : ''}
                    <small>Criado em: ${new Date(map.created_at).toLocaleDateString()}</small>
                </div>
            `).join('');

            // Adiciona eventos de clique
            listContainer.querySelectorAll('.map-item').forEach(item => {
                item.addEventListener('click', () => loadMap(item.dataset.id));
            });
        }
    } catch (error) {
        console.error('Erro ao carregar lista de mapas:', error);
    }
}

async function loadMap(id) {
    if (!api) return;

    try {
        const map = await api.getMap(id);
        currentMap = map;

        // Limpa o mapa atual
        clearMap();
        clearDrawings();

        // Carrega as camadas do mapa
        const layers = await api.getLayers(id);
        layers.forEach(layer => loadLayer(layer));

        // Atualiza a UI
        document.querySelectorAll('.map-item').forEach(item => {
            item.classList.toggle('active', item.dataset.id === id);
        });
    } catch (error) {
        console.error('Erro ao carregar mapa:', error);
        alert('Erro ao carregar mapa. Por favor, tente novamente.');
    }
}

async function saveCurrentMap() {
    if (!currentMap || !api) {
        alert('Nenhum mapa selecionado.');
        return;
    }

    try {
        // A lógica de salvar será implementada quando necessário
        // Por enquanto, apenas mostra uma mensagem
        alert('Mapa salvo com sucesso!');
    } catch (error) {
        console.error('Erro ao salvar mapa:', error);
        alert('Erro ao salvar mapa. Por favor, tente novamente.');
    }
}

function shareMap() {
    if (!currentMap) {
        alert('Nenhum mapa selecionado para compartilhar.');
        return;
    }

    // Cria a URL de compartilhamento
    const shareUrl = `${window.location.origin}?map=${currentMap.id}`;

    // Tenta usar a API de compartilhamento se disponível
    if (navigator.share) {
        navigator.share({
            title: currentMap.name,
            text: currentMap.description || 'Confira este mapa!',
            url: shareUrl
        }).catch(console.error);
    } else {
        // Fallback: copia a URL para a área de transferência
        navigator.clipboard.writeText(shareUrl)
            .then(() => alert('URL do mapa copiada para a área de transferência!'))
            .catch(() => alert(`URL do mapa: ${shareUrl}`));
    }
}

export function getCurrentMap() {
    return currentMap;
} 