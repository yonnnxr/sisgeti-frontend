export class UserApiManager {
    constructor(api) {
        this.api = api;
        this.apis = new Map();
    }

    async loadUserApis() {
        try {
            const userApis = await this.api.getUserApis();
            this.apis.clear();
            userApis.forEach(api => {
                this.apis.set(api.id, api);
            });
            return userApis;
        } catch (error) {
            console.error('Erro ao carregar APIs:', error);
            throw error;
        }
    }

    async addApi(apiData) {
        try {
            const newApi = await this.api.createUserApi(apiData);
            this.apis.set(newApi.id, newApi);
            return newApi;
        } catch (error) {
            console.error('Erro ao adicionar API:', error);
            throw error;
        }
    }

    async updateApi(id, apiData) {
        try {
            const updatedApi = await this.api.updateUserApi(id, apiData);
            this.apis.set(updatedApi.id, updatedApi);
            return updatedApi;
        } catch (error) {
            console.error('Erro ao atualizar API:', error);
            throw error;
        }
    }

    async deleteApi(id) {
        try {
            await this.api.deleteUserApi(id);
            this.apis.delete(id);
        } catch (error) {
            console.error('Erro ao excluir API:', error);
            throw error;
        }
    }

    getApi(id) {
        return this.apis.get(id);
    }

    getAllApis() {
        return Array.from(this.apis.values());
    }
} 