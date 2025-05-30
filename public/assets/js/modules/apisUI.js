import { UserApiManager } from './userApis.js';

let apiManager = null;

export function initApisUI(api) {
    apiManager = new UserApiManager(api);

    // Configura os botões
    setupButtons();
    
    // Configura os formulários
    setupForms();
    
    // Carrega a lista inicial de APIs
    loadApisList();
}

function setupButtons() {
    // Botão de gerenciar APIs
    const manageApisBtn = document.getElementById('manageApis');
    if (manageApisBtn) {
        manageApisBtn.addEventListener('click', showApisModal);
    }

    // Botão de adicionar API
    const addApiBtn = document.getElementById('addApi');
    if (addApiBtn) {
        addApiBtn.addEventListener('click', showApiFormModal);
    }

    // Botão de testar API
    const testApiBtn = document.getElementById('testApi');
    if (testApiBtn) {
        testApiBtn.addEventListener('click', handleTestApi);
    }
}

function setupForms() {
    // Formulário de API
    const apiForm = document.getElementById('apiForm');
    if (apiForm) {
        apiForm.addEventListener('submit', handleApiFormSubmit);
    }

    // Select de tipo de API
    const apiTypeSelect = document.getElementById('apiType');
    if (apiTypeSelect) {
        apiTypeSelect.addEventListener('change', handleApiTypeChange);
    }

    // Botão de adicionar endpoint
    const addEndpointBtn = document.getElementById('addEndpoint');
    if (addEndpointBtn) {
        addEndpointBtn.addEventListener('click', addEndpointField);
    }
}

async function loadApisList() {
    try {
        const apis = await apiManager.loadUserApis();
        renderApisList(apis);
    } catch (error) {
        console.error('Erro ao carregar APIs:', error);
        showError('Erro ao carregar lista de APIs');
    }
}

function renderApisList(apis) {
    const apisList = document.getElementById('apisList');
    if (!apisList) return;

    apisList.innerHTML = apis.map(api => `
        <div class="api-item" data-id="${api.id}">
            <div class="api-item-header">
                <h3 class="api-item-title">${api.name}</h3>
                <div class="api-item-actions">
                    <button class="btn-secondary edit-api" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-secondary test-api" title="Testar">
                        <i class="fas fa-vial"></i>
                    </button>
                    <button class="btn-secondary delete-api" title="Excluir">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="api-item-info">
                <p>Tipo: ${api.type}</p>
                <p>URL Base: ${api.baseUrl}</p>
                <span class="api-item-status ${api.active ? 'active' : 'inactive'}">
                    <i class="fas fa-circle"></i>
                    ${api.active ? 'Ativa' : 'Inativa'}
                </span>
            </div>
        </div>
    `).join('');

    // Adiciona eventos aos botões
    apisList.querySelectorAll('.edit-api').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const apiId = e.target.closest('.api-item').dataset.id;
            editApi(apiId);
        });
    });

    apisList.querySelectorAll('.test-api').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const apiId = e.target.closest('.api-item').dataset.id;
            testApi(apiId);
        });
    });

    apisList.querySelectorAll('.delete-api').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const apiId = e.target.closest('.api-item').dataset.id;
            deleteApi(apiId);
        });
    });
}

function showApisModal() {
    const modal = document.getElementById('apisModal');
    if (modal) {
        modal.classList.add('active');
    }
}

function closeApisModal() {
    const modal = document.getElementById('apisModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

function showApiFormModal(api = null) {
    const modal = document.getElementById('apiFormModal');
    const form = document.getElementById('apiForm');
    const title = document.getElementById('apiFormTitle');

    if (modal && form) {
        // Limpa o formulário
        form.reset();
        
        if (api) {
            // Modo edição
            title.textContent = 'Editar API';
            fillApiForm(api);
            form.dataset.mode = 'edit';
            form.dataset.apiId = api.id;
        } else {
            // Modo criação
            title.textContent = 'Nova API';
            form.dataset.mode = 'create';
            delete form.dataset.apiId;
        }

        modal.classList.add('active');
    }
}

function closeApiFormModal() {
    const modal = document.getElementById('apiFormModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

function fillApiForm(api) {
    const form = document.getElementById('apiForm');
    if (!form) return;

    form.elements.name.value = api.name;
    form.elements.baseUrl.value = api.baseUrl;
    form.elements.apiKey.value = api.apiKey || '';
    form.elements.type.value = api.type;

    handleApiTypeChange({ target: form.elements.type });

    if (api.type === 'custom' && api.endpoints) {
        const endpointsList = document.querySelector('.endpoints-list');
        endpointsList.innerHTML = '';
        api.endpoints.forEach(endpoint => addEndpointField(endpoint));
    }
}

function handleApiTypeChange(event) {
    const customEndpoints = document.getElementById('customEndpoints');
    if (customEndpoints) {
        customEndpoints.classList.toggle('hidden', event.target.value !== 'custom');
    }
}

function addEndpointField(endpoint = null) {
    const endpointsList = document.querySelector('.endpoints-list');
    if (!endpointsList) return;

    const endpointItem = document.createElement('div');
    endpointItem.className = 'endpoint-item';
    endpointItem.innerHTML = `
        <div class="endpoint-header">
            <h4>Endpoint</h4>
            <button type="button" class="remove-endpoint" title="Remover">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div class="form-group">
            <label>Nome:</label>
            <input type="text" name="endpoint-name[]" required value="${endpoint?.name || ''}">
        </div>
        <div class="form-group">
            <label>Path:</label>
            <input type="text" name="endpoint-path[]" required value="${endpoint?.path || ''}">
        </div>
        <div class="form-group">
            <label>Método:</label>
            <select name="endpoint-method[]">
                <option value="GET" ${endpoint?.method === 'GET' ? 'selected' : ''}>GET</option>
                <option value="POST" ${endpoint?.method === 'POST' ? 'selected' : ''}>POST</option>
                <option value="PUT" ${endpoint?.method === 'PUT' ? 'selected' : ''}>PUT</option>
                <option value="DELETE" ${endpoint?.method === 'DELETE' ? 'selected' : ''}>DELETE</option>
            </select>
        </div>
    `;

    endpointsList.appendChild(endpointItem);

    // Adiciona evento para remover endpoint
    endpointItem.querySelector('.remove-endpoint').addEventListener('click', () => {
        endpointItem.remove();
    });
}

async function handleApiFormSubmit(event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);
    
    const apiData = {
        name: formData.get('name'),
        baseUrl: formData.get('baseUrl'),
        apiKey: formData.get('apiKey'),
        type: formData.get('type'),
        endpoints: []
    };

    // Coleta endpoints se for API personalizada
    if (apiData.type === 'custom') {
        const names = formData.getAll('endpoint-name[]');
        const paths = formData.getAll('endpoint-path[]');
        const methods = formData.getAll('endpoint-method[]');

        for (let i = 0; i < names.length; i++) {
            apiData.endpoints.push({
                name: names[i],
                path: paths[i],
                method: methods[i]
            });
        }
    }

    try {
        if (form.dataset.mode === 'edit') {
            await apiManager.updateApi(form.dataset.apiId, apiData);
        } else {
            await apiManager.addApi(apiData);
        }

        await loadApisList();
        closeApiFormModal();
    } catch (error) {
        console.error('Erro ao salvar API:', error);
        showError('Erro ao salvar API');
    }
}

async function handleTestApi() {
    const form = document.getElementById('apiForm');
    if (!form || !form.dataset.apiId) {
        showError('Selecione uma API para testar');
        return;
    }

    try {
        await apiManager.testApi(form.dataset.apiId);
        showSuccess('API testada com sucesso!');
    } catch (error) {
        console.error('Erro ao testar API:', error);
        showError('Erro ao testar API');
    }
}

async function editApi(id) {
    const api = apiManager.getApi(id);
    if (api) {
        showApiFormModal(api);
    }
}

async function testApi(id) {
    try {
        await apiManager.testApi(id);
        showSuccess('API testada com sucesso!');
    } catch (error) {
        console.error('Erro ao testar API:', error);
        showError('Erro ao testar API');
    }
}

async function deleteApi(id) {
    if (!confirm('Tem certeza que deseja excluir esta API?')) {
        return;
    }

    try {
        await apiManager.deleteApi(id);
        await loadApisList();
        showSuccess('API excluída com sucesso!');
    } catch (error) {
        console.error('Erro ao excluir API:', error);
        showError('Erro ao excluir API');
    }
}

function showError(message) {
    // Usa o sistema de mensagens de erro existente
    const event = new CustomEvent('error', { detail: message });
    document.dispatchEvent(event);
}

function showSuccess(message) {
    // Usa o sistema de mensagens existente
    const event = new CustomEvent('success', { detail: message });
    document.dispatchEvent(event);
} 