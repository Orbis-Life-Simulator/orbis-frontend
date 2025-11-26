# Orbis - Frontend (Simulador de Vida com IA)

Este repositório contém o código-fonte da interface gráfica para o projeto "Orbis".

A aplicação é uma Single Page Application (SPA) construída com **React** e **Vite**, focada em performance para renderizar a simulação em tempo real, visualizar gráficos de dados complexos e interagir com a IA generativa do backend.

## Tecnologias

- **Core:** React 18, Vite.
- **Estilização:** Styled Components.
- **Renderização Gráfica (Simulação):** React Konva (Canvas 2D) para alta performance com muitos agentes.
- **Visualização de Dados:** Chart.js e React-Chartjs-2.
- **Roteamento:** React Router DOM.
- **Comunicação:** Axios (HTTP) e WebSockets (API nativa) para atualizações em tempo real.

## Funcionalidades

- **Autenticação:** Login e Registro de usuários com persistência de token JWT.
- **Gerenciamento de Mundos:** Criação e seleção de ambientes de simulação.
- **Visualização da Simulação:**
  - Renderização de agentes, recursos e territórios usando SVGs e Canvas.
  - Controle de tempo (Iniciar/Pausar).
  - Log de eventos em tempo real.
- **Modo Storyteller (Criador):** Interface para enviar comandos em linguagem natural que são interpretados pelo Google Gemini no backend.
- **Painel de Análise:**
  - Disparo de jobs de análise assíncronos (Pandas/Spark).
  - Visualização de gráficos (K/D Ratio, Sobrevivência).
  - Heatmap geoespacial de conflitos.

## Como Rodar o Projeto Localmente

### 1. Pré-requisitos

- **Node.js** (versão 16 ou superior).
- **NPM** ou **Yarn**.
- O **Backend do Orbis** deve estar rodando localmente (padrão: porta 8000).

### 2. Instalação

Clone o repositório e instale as dependências:

```bash
# Entre na pasta
cd orbis-frontend

# Instale as dependências
npm install
```

### 3. Configuração de Ambiente

O projeto assume por padrão que o backend está rodando em `localhost:8000`.

Se precisar alterar o endereço da API, verifique os seguintes arquivos:

1. **Requisições HTTP:** `src/services/api.js`
2. **WebSockets:** `src/pages/SimulationView/index.jsx` (constante `WEBSOCKET_URL`)

*(Opcional)* Você pode criar um arquivo `.env` na raiz para gerenciar isso via variáveis de ambiente do Vite:

```env
VITE_API_URL=http://127.0.0.1:8000/api
VITE_WS_URL=ws://127.0.0.1:8000
```

### 4. Executando a Aplicação

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

O terminal exibirá o link local, geralmente `http://127.0.0.1:5173/` `localhost:5173`.

## Guia de Uso

1. **Login/Registro:** Crie uma conta ou faça login.
2. **Criar Mundo:** No painel inicial, clique em "+ CRIAR NOVO MUNDO", escolha as espécies e a população inicial.
3. **Simulação:**
    - Clique no card do mundo para entrar.
    - Clique em **INICIAR** para ver os agentes ganharem vida.
    - Use o botão **STORYTELLER** no topo para invocar eventos divinos (ex: "Inicie uma praga").
4. **Análise de Dados:**
    - Navegue para a aba **ANÁLISE**.
    - Se os dados não existirem, clique em **"Atualizar Análise"**.
    - O frontend solicitará ao backend o processamento dos dados e fará o *polling* automático até que os gráficos estejam prontos.

## Estrutura de Pastas

```
src/
├── assets/          # Imagens SVG (personagens, recursos)
├── components/      # Componentes reutilizáveis (Character, EventLogPanel, etc.)
├── context/         # Context API (AuthContext.jsx)
├── hooks/           # Custom Hooks (useImageLoader.jsx)
├── pages/           # Páginas principais (Login, SimulationView, Analysis, etc.)
├── services/        # Configuração do Axios (api.js)
└── styles/          # Estilos globais
```

---
**Nota:** Certifique-se de que o Backend (FastAPI) e, se necessário, o banco de dados MongoDB estejam ativos antes de iniciar o frontend.
