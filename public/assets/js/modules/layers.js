import { getDrawLayer, exportGeoJSON, importGeoJSON } from './draw.js';

let map = null;
let api = null;
let layers = new Map();

export function initLayerManager(mapInstance, apiInstance) {
    map = mapInstance;
    api = apiInstance;

    // Configura os controles de visualização
    setupViewControls();

    // Escuta eventos de criação de desenhos
    document.addEventListener('draw:created', handleDrawCreated);
}

function setupViewControls() {
    const controls = {
        weatherLayer: document.getElementById('weatherLayer'),
        placesLayer: document.getElementById('placesLayer'),
        elevationLayer: document.getElementById('elevationLayer')
    };

    // Adiciona eventos aos controles
    Object.entries(controls).forEach(([id, control]) => {
        if (control) {
            control.addEventListener('change', () => {
                toggleLayer(id, control.checked);
            });
        }
    });
}

async function toggleLayer(layerId, visible) {
    if (!map || !api) return;

    let layer = layers.get(layerId);
    
    if (visible && !layer) {
        try {
            // Obtém a localização atual do centro do mapa
            const center = map.getCenter();
            const radius = 1000; // 1km de raio

            // Cria a camada com base no tipo
            switch (layerId) {
                case 'weatherLayer':
                    layer = await createWeatherLayer(center.lat, center.lng);
                    break;
                case 'placesLayer':
                    layer = await createPlacesLayer(center.lat, center.lng, radius);
                    break;
                case 'elevationLayer':
                    layer = await createElevationLayer(center.lat, center.lng);
                    break;
            }

            if (layer) {
                layers.set(layerId, layer);
                map.addLayer(layer);
            }
        } catch (error) {
            console.error(`Erro ao criar camada ${layerId}:`, error);
            alert(`Erro ao carregar dados de ${layerId}`);
        }
    } else if (!visible && layer) {
        map.removeLayer(layer);
        layers.delete(layerId);
    }
}

async function createWeatherLayer(lat, lon) {
    const data = await api.getWeather(lat, lon);
    if (!data || data.error) return null;

    const icon = L.divIcon({
        className: 'weather-icon',
        html: `
            <div class="weather-info">
                <img src="https://openweathermap.org/img/w/${data.weather[0].icon}.png" alt="Clima">
                <span>${Math.round(data.main.temp)}°C</span>
            </div>
        `,
        iconSize: [60, 60]
    });

    return L.marker([lat, lon], { icon }).bindPopup(`
        <h3>Condições Meteorológicas</h3>
        <p>Temperatura: ${Math.round(data.main.temp)}°C</p>
        <p>Sensação: ${Math.round(data.main.feels_like)}°C</p>
        <p>Umidade: ${data.main.humidity}%</p>
        <p>Vento: ${data.wind.speed} m/s</p>
    `);
}

async function createPlacesLayer(lat, lon, radius) {
    const data = await api.getPlaces(lat, lon, radius);
    if (!data || data.error) return null;

    const placesLayer = L.layerGroup();

    data.elements.forEach(element => {
        if (element.tags && element.tags.amenity) {
            const pos = element.lat ? [element.lat, element.lon] : [element.center.lat, element.center.lon];
            
            L.marker(pos)
                .bindPopup(`
                    <h3>${element.tags.name || element.tags.amenity}</h3>
                    <p>Tipo: ${element.tags.amenity}</p>
                    ${element.tags.address ? `<p>Endereço: ${element.tags.address}</p>` : ''}
                `)
                .addTo(placesLayer);
        }
    });

    return placesLayer;
}

async function createElevationLayer(lat, lon) {
    const data = await api.getElevation(lat, lon);
    if (!data || data.error) return null;

    const elevation = data.results[0].elevation;
    
    return L.marker([lat, lon], {
        icon: L.divIcon({
            className: 'elevation-icon',
            html: `<div class="elevation-info">${Math.round(elevation)}m</div>`,
            iconSize: [60, 30]
        })
    }).bindPopup(`
        <h3>Elevação</h3>
        <p>Altitude: ${Math.round(elevation)} metros</p>
    `);
}

function handleDrawCreated(event) {
    const { type, layer } = event.detail;
    
    // Abre o painel de propriedades
    const propertyPanel = document.getElementById('propertyPanel');
    if (propertyPanel) {
        propertyPanel.classList.add('active');
        
        // Preenche o formulário com dados iniciais
        const form = document.getElementById('propertyForm');
        if (form) {
            form.elements.name.value = `${type} ${new Date().toLocaleTimeString()}`;
            form.dataset.layerId = layer._leaflet_id;
        }
    }
}

export function saveLayer(mapId, name, description, style) {
    const drawLayer = getDrawLayer();
    if (!drawLayer) return;

    const geojson = exportGeoJSON();
    if (!geojson) return;

    // Adiciona propriedades à feature
    geojson.features.forEach(feature => {
        feature.properties = {
            ...feature.properties,
            name,
            description,
            style
        };
    });

    return api.createLayer(mapId, {
        name,
        type: 'geojson',
        style,
        data: geojson
    });
}

export function loadLayer(layer) {
    if (layer.type === 'geojson') {
        importGeoJSON(layer.data);
    }
} 