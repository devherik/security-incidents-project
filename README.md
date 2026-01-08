# RCI v2 - Pedreira Um Valemix

Sistema de gestão de RCIs (Relatórios de Controle Interno) desenvolvido para a **Pedreira Um Valemix**.

## 📋 Sobre o Projeto

Este projeto é uma aplicação web construída com **React**, **TypeScript** e **Vite**, seguindo os princípios de **Clean Architecture** para garantir escalabilidade, manutenibilidade e testabilidade do código.

## 🛠️ Tecnologias Utilizadas

- **React 18** - Biblioteca para construção de interfaces
- **TypeScript** - Tipagem estática para JavaScript
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Framework CSS utilitário
- **Zustand** - Gerenciamento de estado
- **Docker** - Containerização da aplicação
- **Nginx** - Servidor web para produção

## 📁 Estrutura do Projeto

O projeto segue a arquitetura limpa (Clean Architecture):

```
src/
├── adapters/          # Adaptadores para serviços externos (ex: Excel)
├── animations/        # Componentes de animação reutilizáveis
├── api/               # Cliente HTTP e configurações de API
├── assets/            # Recursos estáticos (ícones, logos)
├── components/        # Componentes de UI reutilizáveis
├── hooks/             # Custom hooks do React
├── infrastructure/    # Repositórios e implementações de infraestrutura
├── presentation/      # Páginas e views da aplicação
├── schemas/           # Schemas de validação e tipos
├── servers/           # Serviços de comunicação com backend
├── stores/            # Stores Zustand para gerenciamento de estado
└── utils/             # Funções utilitárias
```

## 🚀 Como Executar

### Pré-requisitos

- Node.js (versão 18 ou superior)
- npm ou yarn

### Instalação

```bash
# Clone o repositório
git clone <url-do-repositorio>

# Acesse a pasta do projeto
cd rci-v2-project

# Instale as dependências
npm install
```

### Desenvolvimento

```bash
# Inicie o servidor de desenvolvimento
npm run dev
```

O projeto estará disponível em `http://localhost:5173`

### Build de Produção

```bash
# Gere o build de produção
npm run build

# Visualize o build localmente
npm run preview
```

### Docker

```bash
# Build da imagem
docker build -t rci-v2 .

# Execute o container
docker run -p 80:80 rci-v2
```

## 📝 Scripts Disponíveis

| Comando           | Descrição                              |
| ----------------- | -------------------------------------- |
| `npm run dev`     | Inicia o servidor de desenvolvimento   |
| `npm run build`   | Gera o build de produção               |
| `npm run preview` | Visualiza o build de produção          |
| `npm run lint`    | Executa o linter (ESLint)              |

## 🔧 Configuração do Ambiente

Crie um arquivo `.env` na raiz do projeto com as variáveis de ambiente necessárias:

```env
VITE_API_URL=<url-da-api>
```

## 👥 Equipe de Desenvolvimento

Desenvolvido pela equipe de TI da **Pedreira Um Valemix**.

## 📄 Licença

Este projeto é propriedade da **Pedreira Um Valemix**. Todos os direitos reservados.
