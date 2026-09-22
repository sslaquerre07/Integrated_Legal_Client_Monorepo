# Integrated Legal Client Monorepo

This repository is a TypeScript monorepo for the integrated legal client platform. It is organized around a shared package model with a Next.js frontend, a TypeScript API, and reusable shared libraries.

### What is built in this monorepo

The root-level build command uses Turbo to run the workspace build tasks. At the moment, the build pipeline includes four build targets:

1. `services/api` — TypeScript API build (`tsc`)
2. `services/web` — Next.js production build (`next build`)
3. `packages/components` — shared React component package type check (`tsc --noEmit`)
4. `packages/types` — shared type package type check (`tsc --noEmit`)

This keeps the frontend, backend, and shared packages aligned in one monorepo build flow.

## Tech Stack

### Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS
- Shared component library in `packages/components`

### Backend
- Node.js + TypeScript
- Express
- CORS support
- Shared API/domain types from `packages/types`

### Monorepo tooling
- npm workspaces
- Turbo repo
- TypeScript project references / shared config

### Planned additions
- Redux for frontend state management
- Jest testing for both frontend and backend packages

## Development Workflow

### Run the app in development mode

```bash
npm run dev
```

This starts the workspace tasks managed by Turbo.

### Build for production

```bash
npm run build
```

### Lint the repo

```bash
npm run lint
```

## Dev Container Setup

This repository includes a configured dev container at `.devcontainer/devcontainer.json`.

### Prerequisites
- Docker installed and running
- VS Code with the Dev Containers extension

### Open the project in the container
1. Open the repository in VS Code.
2. Use the command palette and select:
   - "Dev Containers: Reopen in Container"
3. VS Code will build the container using the configured TypeScript Node image.

### Included container setup
The dev container is configured with:
- Node.js + TypeScript image (`mcr.microsoft.com/devcontainers/typescript-node:5-24-trixie`)
- GitHub CLI feature
- NestJS CLI feature
- VS Code extensions for ESLint, Prettier, and Jest runner

### Automatic install step
After the container is created, the project runs:

```bash
npm install
```

### Forwarded ports
The dev container forwards:
- `3000` for the web app
- `3001` for the API

### Useful commands inside the container

```bash
npm install
npm run dev
npm run build
npm run lint
```

## Notes

This repo is set up as a scalable foundation for a legal client application, with a shared package architecture for reusable UI and types while keeping the web and API services decoupled but coordinated through the monorepo build tooling.
