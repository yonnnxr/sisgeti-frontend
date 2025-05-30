export const config = {
    // Configurações do mapa
    map: {
        defaultCenter: [-23.5505, -46.6333], // São Paulo
        defaultZoom: 13,
        minZoom: 3,
        maxZoom: 18,
        tileLayer: {
            url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }
    },

    // Configurações de APIs
    api: {
        baseURL: '/api',
        timeout: 5000,
        endpoints: {
            maps: '/maps',
            layers: '/maps/{mapId}/layers',
            weather: '/external/weather',
            places: '/external/places',
            elevation: '/external/elevation'
        }
    },

    // Configurações de UI
    ui: {
        sidebar: {
            width: 300, // pixels
            breakpoint: 768 // pixels
        },
        theme: {
            light: {
                primary: '#2563eb',
                secondary: '#475569',
                background: '#f8fafc',
                surface: '#ffffff',
                text: '#1e293b',
                border: '#e2e8f0',
                hover: '#3b82f6'
            },
            dark: {
                primary: '#3b82f6',
                secondary: '#94a3b8',
                background: '#0f172a',
                surface: '#1e293b',
                text: '#f8fafc',
                border: '#334155',
                hover: '#60a5fa'
            }
        }
    },

    // Configurações de desenho
    draw: {
        styles: {
            default: {
                color: '#2563eb',
                weight: 3,
                fillColor: '#3b82f6',
                fillOpacity: 0.2
            },
            highlight: {
                color: '#f59e0b',
                weight: 3,
                fillColor: '#fbbf24',
                fillOpacity: 0.3
            }
        }
    },

    // Configurações de localização
    location: {
        enableHighAccuracy: true,
        maximumAge: 30000, // 30 segundos
        timeout: 10000 // 10 segundos
    },

    // Configurações de cache
    cache: {
        maps: {
            enabled: true,
            duration: 300000 // 5 minutos
        },
        layers: {
            enabled: true,
            duration: 300000 // 5 minutos
        }
    },

    // Configurações de erro
    error: {
        messages: {
            default: 'Ocorreu um erro inesperado. Por favor, tente novamente.',
            network: 'Erro de conexão. Verifique sua internet.',
            server: 'Erro no servidor. Tente novamente mais tarde.',
            timeout: 'Tempo limite excedido. Tente novamente.',
            location: 'Erro ao obter localização. Verifique suas permissões.'
        },
        displayDuration: 5000 // 5 segundos
    }
}; 