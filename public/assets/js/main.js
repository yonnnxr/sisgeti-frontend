import { initMap, getMap } from './modules/map.js';
import { initDrawTools } from './modules/draw.js';
import { initLocationTools } from './modules/location.js';
import { initLayerManager } from './modules/layers.js';
import { initPropertyPanel } from './modules/properties.js';
import { initMapManager } from './modules/maps.js';
import { initUIControls } from './modules/ui.js';
import { initApisUI } from './modules/apisUI.js';
import { API } from './modules/api.js';

// Configuração da API
const api = new API({
    baseURL: '/api',
    timeout: 5000
});

// Inicialização do aplicativo
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Inicializa o mapa base
        await initMap('map');
        
        // Inicializa os módulos
        initDrawTools(getMap());
        initLocationTools(getMap());
        initLayerManager(getMap(), api);
        initPropertyPanel();
        initMapManager(api);
        initUIControls();
        initApisUI(api);
        
        console.log('Aplicativo inicializado com sucesso!');
    } catch (error) {
        console.error('Erro ao inicializar o aplicativo:', error);
    }
}); 