import { setMapView } from './map.js';

let locationMarker = null;
let locationCircle = null;
let watchId = null;

export function initLocationTools(map) {
    // Configura o botão de localização
    const locationButton = document.getElementById('getLocation');
    if (locationButton) {
        locationButton.addEventListener('click', () => {
            if (!watchId) {
                startLocationTracking(map);
                locationButton.classList.add('active');
            } else {
                stopLocationTracking(map);
                locationButton.classList.remove('active');
            }
        });
    }
}

function startLocationTracking(map) {
    if ('geolocation' in navigator) {
        // Primeiro obtém a localização imediatamente
        navigator.geolocation.getCurrentPosition(
            (position) => updateLocation(map, position),
            handleLocationError,
            { enableHighAccuracy: true }
        );

        // Então inicia o monitoramento contínuo
        watchId = navigator.geolocation.watchPosition(
            (position) => updateLocation(map, position),
            handleLocationError,
            { enableHighAccuracy: true }
        );
    } else {
        alert('Geolocalização não está disponível no seu navegador.');
    }
}

function stopLocationTracking(map) {
    if (watchId) {
        navigator.geolocation.clearWatch(watchId);
        watchId = null;
    }

    if (locationMarker) {
        map.removeLayer(locationMarker);
        locationMarker = null;
    }

    if (locationCircle) {
        map.removeLayer(locationCircle);
        locationCircle = null;
    }
}

function updateLocation(map, position) {
    const { latitude, longitude, accuracy } = position.coords;

    // Remove marcadores anteriores
    if (locationMarker) map.removeLayer(locationMarker);
    if (locationCircle) map.removeLayer(locationCircle);

    // Cria o marcador de localização
    locationMarker = L.marker([latitude, longitude], {
        icon: L.divIcon({
            className: 'location-marker',
            html: '<div class="location-marker-inner"></div>',
            iconSize: [20, 20]
        })
    }).addTo(map);

    // Cria o círculo de precisão
    locationCircle = L.circle([latitude, longitude], {
        radius: accuracy,
        color: '#2563eb',
        fillColor: '#3b82f6',
        fillOpacity: 0.1,
        weight: 1
    }).addTo(map);

    // Centraliza o mapa na localização
    setMapView(latitude, longitude, map.getZoom());

    // Dispara evento personalizado
    const locationEvent = new CustomEvent('location:updated', {
        detail: {
            latitude,
            longitude,
            accuracy
        }
    });
    document.dispatchEvent(locationEvent);
}

function handleLocationError(error) {
    let message;
    switch (error.code) {
        case error.PERMISSION_DENIED:
            message = 'Acesso à localização foi negado.';
            break;
        case error.POSITION_UNAVAILABLE:
            message = 'Informação de localização não está disponível.';
            break;
        case error.TIMEOUT:
            message = 'Tempo limite para obter localização excedido.';
            break;
        default:
            message = 'Ocorreu um erro ao obter a localização.';
    }
    alert(message);
}

export function getCurrentLocation() {
    return new Promise((resolve, reject) => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        accuracy: position.coords.accuracy
                    });
                },
                (error) => reject(error),
                { enableHighAccuracy: true }
            );
        } else {
            reject(new Error('Geolocalização não disponível'));
        }
    });
} 