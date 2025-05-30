let map = null;

export function initMap(containerId) {
    return new Promise((resolve, reject) => {
        try {
            // Inicializa o mapa Leaflet
            map = L.map(containerId, {
                center: [-23.5505, -46.6333], // São Paulo
                zoom: 13,
                zoomControl: false
            });

            // Adiciona controles de zoom em uma posição personalizada
            L.control.zoom({
                position: 'topright'
            }).addTo(map);

            // Adiciona o layer do OpenStreetMap
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            // Adiciona escala
            L.control.scale({
                imperial: false,
                position: 'bottomright'
            }).addTo(map);

            resolve(map);
        } catch (error) {
            reject(error);
        }
    });
}

export function getMap() {
    if (!map) {
        throw new Error('Mapa não inicializado');
    }
    return map;
}

export function setMapView(lat, lng, zoom = 13) {
    if (map) {
        map.setView([lat, lng], zoom);
    }
}

export function addMapLayer(layer) {
    if (map) {
        layer.addTo(map);
    }
}

export function removeMapLayer(layer) {
    if (map) {
        map.removeLayer(layer);
    }
}

export function clearMap() {
    if (map) {
        map.eachLayer((layer) => {
            if (layer instanceof L.TileLayer) return;
            map.removeLayer(layer);
        });
    }
} 