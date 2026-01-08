# RCI v2 - Pedreira Um Valemix

Sistema de gestão de RCIs (Registro de Condições Inseguras) desenvolvido para a **Pedreira Um Valemix**.

## 📋 Sobre o Projeto

Este projeto é uma aplicação web moderna construída para centralizar e otimizar a gestão de RCIs. A arquitetura foi desenhada para ser robusta e escalável, utilizando as melhores práticas de engenharia de software.

## 🏛️ Desenho Arquitetônico

O projeto implementa os princípios da **Clean Architecture** (Arquitetura Limpa), separando as preocupações em camadas bem definidas para garantir que as regras de negócio sejam independentes de frameworks, interfaces de usuário ou bancos de dados.

### Princípios SOLID Aplicados
- **(S) SRP:** Componentes e hooks com responsabilidades únicas.
- **(O) OCP:** Sistemas de adaptadores extensíveis sem modificação do core.
- **(D) DIP:** Inversão de dependência através de interfaces (ex: `IExcelAdapter`), permitindo a troca de implementações de terceiros sem afetar a lógica de negócio.

---

## 🛠️ Stack Tecnológica

- **Core:** [React 18](https://reactjs.org/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Estado Global:** [Zustand](https://github.com/pmndrs/zustand) (com persistência e hidratação)
- **Estilização:** [Tailwind CSS](https://tailwindcss.com/)
- **Roteamento:** [React Router 6](https://reactrouter.com/) (com Lazy Loading e Protected Routes)
- **Infraestrutura:** [Docker](https://www.docker.com/) + [Nginx](https://www.nginx.com/)

---

## 📁 Estrutura de Pastas

```bash
src/
├── adapters/          # Camada de Adaptação (DIP): Interfaces e implementações externas (Excel/XLSX)
├── api/               # Configuração do cliente HTTP (Axios/Fetch) e interceptores
├── components/        # UI Atoms & Molecules (Componentes reutilizáveis e agnósticos à página)
├── hooks/             # Lógica de interface encapsulada (Custom Hooks)
├── infrastructure/    # Implementação de detalhes técnicos e repositórios de dados
├── presentation/      # Camada de Visão (Páginas, Layouts e lógica específica de View)
├── schemas/           # Definições de Contrato: Tipos, Interfaces de API e Schemas de validação
├── servers/           # Casos de Uso/Serviços: Orquestração da lógica de comunicação (Singletons)
├── stores/            # Gerenciamento de estado global e persistente
└── utils/             # Funções puras e utilidades transversais (Datas, Cálculos)
```

---

## 🚀 Guia do Desenvolvedor

### Configuração Inicial

1. **Clone e Instalação:**
```bash
git clone <url-do-repositorio>
cd rci-v2-project
npm install
```

2. **Variáveis de Ambiente:**
Crie um arquivo `.env` baseado no exemplo abaixo:
```env
VITE_API_URL=https://api.valemix.com.br
VITE_APP_AUTH0_CLIENT_ID=...
```

### Comandos Frequentes

| Comando | Descrição |
| :--- | :--- |
| `npm run dev` | Inicia ambiente de desenvolvimento com HMR |
| `npm run build` | Compila o projeto para produção (diretório `build/`) |
| `npm run preview` | Serve o build localmente para validação |
| `npm run lint` | Analisa o código em busca de erros de padrão/estilo |

---

## 🐳 Docker e Produção

A aplicação está preparada para rodar em containers, utilizando o Nginx para servir os arquivos estáticos de forma otimizada.

**Build e Execução Local:**
```bash
docker build -t rci-pedreira .
docker run -p 8080:80 rci-pedreira
```

---

## 🤝 Contribuição

Ao desenvolver novas funcionalidades:
1.  **Tipagem:** Nunca use `any`. Use os schemas definidos em `src/schemas`.
2.  **Arquitetura:** Mantenha a lógica de negócio nos `servers` e a lógica de UI nos `hooks`. Repositórios e chamadas de rede ficam na `infrastructure/api`.
3.  **Clean Code:** Siga os princípios SOLID. Se um componente crescer demais, extraia subcomponentes ou hooks.

---

## 👥 Mantenedores

Este projeto é desenvolvido e mantido pela equipe de TI da **Pedreira Um Valemix**.

## 📄 Propriedade

© 2026 Pedreira Um Valemix. Todos os direitos reservados. Uso restrito a colaboradores autorizados.
