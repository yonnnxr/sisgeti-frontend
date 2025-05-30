class MapManager {
    constructor() {
        this.map = null;
        this.drawControl = null;
        this.drawnItems = null;
        this.currentMapId = null;
        this.selectedLayer = null;
        this.weatherLayer = null;
        this.placesLayer = null;
        
        this.initMap();
        this.initDrawControls();
        this.bindEvents();
    }

    initMap() {
        this.map = L.map('map').setView([-15.7801, -47.9292], 5);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.map);

        this.drawnItems = new L.FeatureGroup();
        this.map.addLayer(this.drawnItems);

        // Camadas para dados externos
        this.weatherLayer = L.layerGroup().addTo(this.map);
        this.placesLayer = L.layerGroup().addTo(this.map);
    }

    initDrawControls() {
        this.drawControl = new L.Control.Draw({
            draw: {
                marker: true,
                circle: true,
                polygon: {
                    allowIntersection: false,
                    drawError: {
                        color: '#e1e100',
                        message: '<strong>Ops!</strong> Você não pode desenhar polígonos que se cruzam!'
                    },
                    shapeOptions: {
                        color: '#2196f3'
                    }
                },
                polyline: {
                    shapeOptions: {
                        color: '#2196f3'
                    }
                },
                rectangle: false,
                circlemarker: false
            },
            edit: {
                featureGroup: this.drawnItems,
                remove: true
            }
        });
        this.map.addControl(this.drawControl);
    }

    bindEvents() {
        this.map.on('draw:created', (e) => this.handleDrawCreated(e));
        this.map.on('draw:edited', (e) => this.handleDrawEdited(e));
        this.map.on('draw:deleted', (e) => this.handleDrawDeleted(e));
        this.map.on('click', (e) => this.handleMapClick(e));
        
        document.getElementById('getLocation').addEventListener('click', () => this.getCurrentLocation());
        document.getElementById('shareMap').addEventListener('click', () => this.shareMap());
        document.getElementById('saveMap').addEventListener('click', () => this.saveMap());
    }

    async handleMapClick(e) {
        const { lat, lng } = e.latlng;
        
        try {
            // Obter dados meteorológicos
            const weather = await API.getWeather(lat, lng);
            this.displayWeather(weather, lat, lng);

            // Obter locais próximos
            const places = await API.getPlaces(lat, lng);
            this.displayPlaces(places);

            // Obter elevação
            const elevation = await API.getElevation(lat, lng);
            this.displayElevation(elevation, lat, lng);
        } catch (error) {
            console.error('Erro ao obter dados externos:', error);
            UI.showError('Erro ao obter dados externos');
        }
    }

    displayWeather(weather, lat, lng) {
        this.weatherLayer.clearLayers();
        
        if (weather.main && weather.weather) {
            const temp = Math.round(weather.main.temp);
            const description = weather.weather[0].description;
            const icon = weather.weather[0].icon;
            
            const marker = L.marker([lat, lng], {
                icon: L.divIcon({
                    html: `
                        <div class="weather-icon">
                            <img src="http://openweathermap.org/img/w/${icon}.png">
                            <span>${temp}°C</span>
                        </div>
                    `,
                    className: 'weather-marker'
                })
            });
            
            marker.bindPopup(`
                <div class="weather-popup">
                    <h3>Condições Meteorológicas</h3>
                    <p>Temperatura: ${temp}°C</p>
                    <p>Condição: ${description}</p>
                    <p>Umidade: ${weather.main.humidity}%</p>
                    <p>Vento: ${weather.wind.speed} m/s</p>
                </div>
            `);
            
            this.weatherLayer.addLayer(marker);
        }
    }

    displayPlaces(places) {
        this.placesLayer.clearLayers();
        
        if (places.elements) {
            places.elements.forEach(place => {
                if (place.tags && place.tags.name) {
                    const marker = L.marker([place.lat, place.lon], {
                        icon: L.divIcon({
                            html: `<i class="fas fa-map-pin"></i>`,
                            className: 'place-marker'
                        })
                    });
                    
                    marker.bindPopup(`
                        <div class="place-popup">
                            <h3>${place.tags.name}</h3>
                            <p>Tipo: ${place.tags.amenity}</p>
                            ${place.tags.description ? `<p>${place.tags.description}</p>` : ''}
                        </div>
                    `);
                    
                    this.placesLayer.addLayer(marker);
                }
            });
        }
    }

    displayElevation(elevation, lat, lng) {
        if (elevation.results && elevation.results[0]) {
            const height = elevation.results[0].elevation;
            
            L.popup()
                .setLatLng([lat, lng])
                .setContent(`<div class="elevation-popup">Elevação: ${Math.round(height)}m</div>`)
                .openOn(this.map);
        }
    }

    // ... (manter os métodos existentes: handleDrawCreated, handleDrawEdited, handleDrawDeleted,
    //      getCurrentLocation, shareMap, saveMap, loadMap)
} 