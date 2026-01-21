# RCI Platform - Safety & Condition Management System

A robust, enterprise-grade management system for **RCI** (*Registro de Condições Inseguras* - Unsafe Condition Reports), refactored with a focus on **Clean Architecture**, **SOLID principles**, and **High Performance**.

## 📋 Project Overview

This project is a modern web application designed to centralize and optimize the management of occupational safety reports. Originally a legacy system, it was completely refactored to emphasize **long-term maintainability**, **testability**, and **decoupling** from external dependencies.

## 🏛️ Architectural Design

The project strictly follows **Clean Architecture** principles. This ensures that the core business logic remains isolated from infrastructure details like APIs, persistence, or UI frameworks.

### Why Clean Architecture?
- **Independence of Frameworks:** The business rules (Use Cases) don't depend on React. They could easily be ported to another UI library or even a CLI.
- **Testability:** Business rules can be tested without the UI, Database, Web Server, or any other external element.
- **Independence of UI:** The UI can change easily, without changing the rest of the system.
- **Independence of Database:** You can swap the data source without touching the business rules.

### SOLID Implementation in Practice
- **(S) Single Responsibility Principle:** Every component has one job. UI focuses on rendering; Hooks focus on state orchestration; Servers focus on use-case execution.
- **(O) Open/Closed Principle:** The system is open for extension but closed for modification. For example, adding a new export format only requires a new implementation of a specific adapter, without changing the existing logic.
- **(D) Dependency Inversion Principle:** We depend on abstractions, not concretions. The application layer interacts with interfaces (e.g., `IExcelAdapter`), allowing us to swap underlying libraries without side effects.

---

## 🛠️ Tech Stack

- **Core:** [React 18](https://reactjs.org/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **State Management:** [Zustand](https://github.com/pmndrs/zustand) (with optimized persistence and hydration strategies)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Routing:** [React Router 6](https://reactrouter.com/) (implementing **Lazy Loading** and **Custom Route Guards**)
- **Infrastructure:** [Docker](https://www.docker.com/) + [Nginx](https://www.nginx.com/) (Optimized for static content delivery)

---

## 📁 Project Structure

```bash
src/
├── adapters/          # Implementation of external tools (DIP layer)
├── api/               # HTTP client configuration and interceptors
├── components/        # Atomic UI components (Stateless and reusable)
├── hooks/             # UI State orchestration and business logic integration
├── presentation/      # View layer: Pages, Layouts, and UI-specific logic
├── schemas/           # Domain Contracts: Zod schemas, Types, and Interfaces
├── servers/           # Application layer: Use Cases and Domain logic (Singletons)
├── stores/            # Global state management
└── utils/             # Cross-cutting concerns: Date parsing, Calculations
```

---

## 🚀 Execution & Development

### Setup

1. **Installation:**
```bash
git clone <your-repository-url>
cd rci-v2-project
npm install
```

2. **Environment Configuration:**
Configure your `.env` following the standard template:
```env
VITE_API_URL=https://your-api-domain.com
```

### Key Commands

| Command | Description |
| :--- | :--- |
| `npm run dev` | Spin up development environment with HMR |
| `npm run build` | Production-ready build generation |
| `npm run lint` | Static analysis for code quality |

---

## 🐳 Containerization & Deployment

The application is fully containerized and production-ready, featuring a multi-stage Docker build to minimize image size and maximize security.

**Run with Docker:**
```bash
docker build -t rci-platform .
docker run -p 8080:80 rci-platform
```

---

## 💡 Developer Guidelines (Best Practices)

To maintain the architectural integrity of this project:
1.  **Strict Typing:** `any` is strictly prohibited. Leverage the domain schemas in `src/schemas`.
2.  **Layer Separation:** Business logic belongs in `servers` or `hooks`. Infrastructure and data-fetching belong in their respective layers.
3.  **Component Design:** Follow the **Atomic Design** philosophy. If a component handles more than its own rendering state, move the logic to a custom hook.

---

## 👨‍💻 Author

Developed as a showcase of modern frontend engineering and software architecture.

---
© 2026. This project is for educational/portfolio purposes.
