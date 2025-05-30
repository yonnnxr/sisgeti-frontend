export class API {
    constructor(config) {
        this.baseURL = config.baseURL || '/api';
        this.timeout = config.timeout || 5000;
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        try {
            const response = await fetch(url, {
                ...options,
                signal: controller.signal,
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                }
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`Erro na requisição: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            if (error.name === 'AbortError') {
                throw new Error('Tempo limite da requisição excedido');
            }
            throw error;
        }
    }

    // Endpoints de APIs do Usuário
    async getUserApis() {
        return this.request('/user/apis');
    }

    async createUserApi(data) {
        return this.request('/user/apis', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    async updateUserApi(id, data) {
        return this.request(`/user/apis/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    async deleteUserApi(id) {
        return this.request(`/user/apis/${id}`, {
            method: 'DELETE'
        });
    }

    async testUserApi(id) {
        return this.request(`/user/apis/${id}/test`, {
            method: 'POST'
        });
    }

    // Endpoints de Mapas
    async getMaps() {
        return this.request('/maps');
    }

    async createMap(data) {
        return this.request('/maps', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    async getMap(id) {
        return this.request(`/maps/${id}`);
    }

    // Endpoints de Camadas
    async getLayers(mapId) {
        return this.request(`/maps/${mapId}/layers`);
    }

    async createLayer(mapId, data) {
        return this.request(`/maps/${mapId}/layers`, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    // Endpoints de Dados Externos
    async getLocationData(lat, lon, radius = 1000) {
        const params = new URLSearchParams({
            lat: lat.toString(),
            lon: lon.toString(),
            radius: radius.toString()
        });
        return this.request(`/external/data?${params}`);
    }

    async getWeather(lat, lon) {
        const params = new URLSearchParams({
            lat: lat.toString(),
            lon: lon.toString()
        });
        return this.request(`/external/weather?${params}`);
    }

    async getPlaces(lat, lon, radius = 1000) {
        const params = new URLSearchParams({
            lat: lat.toString(),
            lon: lon.toString(),
            radius: radius.toString()
        });
        return this.request(`/external/places?${params}`);
    }

    async getElevation(lat, lon) {
        const params = new URLSearchParams({
            lat: lat.toString(),
            lon: lon.toString()
        });
        return this.request(`/external/elevation?${params}`);
    }
} 