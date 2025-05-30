const API = {
    baseUrl: 'http://localhost:5000/api',

    // APIs Internas
    async getMaps() {
        const response = await fetch(`${this.baseUrl}/maps`);
        if (!response.ok) throw new Error('Falha ao carregar mapas');
        return response.json();
    },

    async createMap(mapData) {
        const response = await fetch(`${this.baseUrl}/maps`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(mapData)
        });
        if (!response.ok) throw new Error('Falha ao criar mapa');
        return response.json();
    },

    async getMap(mapId) {
        const response = await fetch(`${this.baseUrl}/maps/${mapId}`);
        if (!response.ok) throw new Error('Falha ao carregar mapa');
        return response.json();
    },

    async getLayers(mapId) {
        const response = await fetch(`${this.baseUrl}/maps/${mapId}/layers`);
        if (!response.ok) throw new Error('Falha ao carregar camadas');
        return response.json();
    },

    async createLayer(mapId, layerData) {
        const response = await fetch(`${this.baseUrl}/maps/${mapId}/layers`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(layerData)
        });
        if (!response.ok) throw new Error('Falha ao criar camada');
        return response.json();
    },

    async updateLayer(mapId, layerId, layerData) {
        const response = await fetch(`${this.baseUrl}/maps/${mapId}/layers/${layerId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(layerData)
        });
        if (!response.ok) throw new Error('Falha ao atualizar camada');
        return response.json();
    },

    async deleteLayer(mapId, layerId) {
        const response = await fetch(`${this.baseUrl}/maps/${mapId}/layers/${layerId}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Falha ao deletar camada');
        return response.json();
    },

    // APIs Externas
    async getWeather(lat, lon) {
        const response = await fetch(`${this.baseUrl}/external/weather?lat=${lat}&lon=${lon}`);
        if (!response.ok) throw new Error('Falha ao obter dados meteorológicos');
        return response.json();
    },

    async getPlaces(lat, lon, radius = 1000) {
        const response = await fetch(`${this.baseUrl}/external/places?lat=${lat}&lon=${lon}&radius=${radius}`);
        if (!response.ok) throw new Error('Falha ao obter locais próximos');
        return response.json();
    },

    async getElevation(lat, lon) {
        const response = await fetch(`${this.baseUrl}/external/elevation?lat=${lat}&lon=${lon}`);
        if (!response.ok) throw new Error('Falha ao obter dados de elevação');
        return response.json();
    }
}; 