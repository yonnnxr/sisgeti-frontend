# Frontend do GeoMaps Pro

Interface web moderna e responsiva para visualização e gerenciamento de dados geolocalizados.

## Estrutura do Projeto

```
frontend/
├── public/
│   ├── assets/
│   │   ├── css/
│   │   │   ├── main.css
│   │   │   └── components.css
│   │   ├── js/
│   │   │   ├── main.js
│   │   │   ├── config.js
│   │   │   └── modules/
│   │   │       ├── api.js
│   │   │       ├── draw.js
│   │   │       ├── layers.js
│   │   │       ├── location.js
│   │   │       ├── map.js
│   │   │       ├── maps.js
│   │   │       ├── properties.js
│   │   │       └── ui.js
│   │   └── images/
│   │       └── favicon.png
│   └── index.html
└── README.md
```

## Tecnologias Utilizadas

- HTML5
- CSS3 (com variáveis CSS e media queries)
- JavaScript (ES6+)
- Leaflet.js para mapas interativos
- Font Awesome para ícones

## Funcionalidades

### Mapas
- Visualização de mapas usando OpenStreetMap
- Ferramentas de desenho (marcadores, linhas, polígonos, círculos)
- Gerenciamento de camadas
- Suporte a temas claro/escuro

### Dados Geolocalizados
- Informações meteorológicas em tempo real
- Pontos de interesse próximos
- Dados de elevação
- Localização do usuário em tempo real

### Interface
- Design responsivo
- Sidebar recolhível
- Barra de ferramentas intuitiva
- Painel de propriedades
- Modais e tooltips
- Mensagens de erro amigáveis

## Módulos

### api.js
Gerencia todas as comunicações com o backend através de uma classe API centralizada.

### draw.js
Implementa as ferramentas de desenho usando Leaflet.Draw, permitindo a criação e edição de formas geométricas.

### layers.js
Gerencia as camadas do mapa, incluindo camadas de dados externos (clima, locais, elevação).

### location.js
Lida com a geolocalização do usuário e rastreamento em tempo real.

### map.js
Configura e gerencia a instância principal do mapa Leaflet.

### maps.js
Gerencia os mapas salvos, incluindo criação, carregamento e compartilhamento.

### properties.js
Controla o painel de propriedades para edição de elementos do mapa.

### ui.js
Implementa controles de interface, como menu responsivo, tooltips e temas.

## Configuração

O arquivo `config.js` contém todas as configurações do frontend, incluindo:
- Configurações do mapa
- Endpoints da API
- Temas de cores
- Estilos de desenho
- Configurações de cache
- Mensagens de erro

## Desenvolvimento

1. Clone o repositório
2. Navegue até a pasta `frontend`
3. Abra `index.html` em um servidor web local

## Compatibilidade

- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+

## Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Licença

Este projeto está licenciado sob a MIT License. 