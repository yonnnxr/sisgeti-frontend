let drawControl = null;
let drawLayer = null;
let activeDrawTool = null;

export function initDrawTools(map) {
    // Cria uma nova camada para os desenhos
    drawLayer = new L.FeatureGroup();
    map.addLayer(drawLayer);

    // Configura as opções de desenho
    drawControl = new L.Control.Draw({
        draw: {
            polyline: {
                shapeOptions: {
                    color: '#2563eb',
                    weight: 3
                }
            },
            polygon: {
                shapeOptions: {
                    color: '#2563eb',
                    fillColor: '#3b82f6',
                    fillOpacity: 0.2
                },
                allowIntersection: false
            },
            circle: {
                shapeOptions: {
                    color: '#2563eb',
                    fillColor: '#3b82f6',
                    fillOpacity: 0.2
                }
            },
            marker: true,
            circlemarker: false,
            rectangle: false
        },
        edit: {
            featureGroup: drawLayer,
            remove: true
        }
    });

    // Adiciona o controle ao mapa
    map.addControl(drawControl);

    // Configura os eventos de desenho
    map.on(L.Draw.Event.CREATED, (event) => {
        const layer = event.layer;
        drawLayer.addLayer(layer);
        
        // Dispara evento personalizado
        const drawEvent = new CustomEvent('draw:created', {
            detail: {
                type: event.layerType,
                layer: layer
            }
        });
        document.dispatchEvent(drawEvent);
    });

    // Configura os botões da barra de ferramentas
    setupToolbarButtons(map);
}

function setupToolbarButtons(map) {
    const buttons = {
        markerTool: new L.Draw.Marker(map),
        polylineTool: new L.Draw.Polyline(map),
        polygonTool: new L.Draw.Polygon(map),
        circleTool: new L.Draw.Circle(map)
    };

    // Adiciona eventos aos botões
    Object.entries(buttons).forEach(([id, tool]) => {
        const button = document.getElementById(id);
        if (button) {
            button.addEventListener('click', () => {
                // Desativa a ferramenta atual se existir
                if (activeDrawTool) {
                    activeDrawTool.disable();
                    document.querySelector('.tool-button.active')?.classList.remove('active');
                }

                // Se clicar na mesma ferramenta, apenas desativa
                if (activeDrawTool === tool) {
                    activeDrawTool = null;
                    return;
                }

                // Ativa a nova ferramenta
                tool.enable();
                activeDrawTool = tool;
                button.classList.add('active');
            });
        }
    });
}

export function clearDrawings() {
    if (drawLayer) {
        drawLayer.clearLayers();
    }
}

export function getDrawLayer() {
    return drawLayer;
}

export function importGeoJSON(geojson) {
    if (drawLayer && geojson) {
        L.geoJSON(geojson, {
            style: (feature) => {
                return feature.properties.style || {};
            },
            pointToLayer: (feature, latlng) => {
                if (feature.properties.radius) {
                    return L.circle(latlng, feature.properties);
                }
                return L.marker(latlng);
            }
        }).eachLayer((layer) => {
            drawLayer.addLayer(layer);
        });
    }
}

export function exportGeoJSON() {
    if (drawLayer) {
        return drawLayer.toGeoJSON();
    }
    return null;
} 