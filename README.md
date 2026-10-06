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
- Redux
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
- Jest Testing for both FE/BE packages

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
3. VS Code starts the services defined in `.devcontainer/docker-compose.yml`.

### Included container setup
The dev container starts three services:
- `web` and `api` — the application development containers
- `db` — PostgreSQL 16, with a persistent `pgdata` volume

The database is created as `dev_db` with the local development user `user` and password `password`. These are development-only credentials; do not use them for production or sensitive data. The app containers connect to PostgreSQL over the Compose network. Port `5432` is also published on localhost for database tools on your machine.

The PostgreSQL schema is defined in `.devcontainer/init-scripts/init.sql`. PostgreSQL runs scripts in that directory when it initializes a new, empty data volume. The sample rows are in `.devcontainer/init-scripts/seed.sql`; the Dev Container runs the seed command after `npm install` each time it is created. The seed is safe to rerun.

The setup also includes the GitHub CLI and NestJS CLI features, plus VS Code extensions for ESLint, Prettier, Jest, and database access.

### Automatic install step
After the container is created, the project installs dependencies and seeds the database:

```bash
npm install && npm --workspace services/api run db:seed
```

### Forwarded ports
The dev container forwards:
- `3000` for the web app
- `3001` for the API
- `5432` for the DB

### Useful commands inside the container

```bash
npm install
npm run dev
npm run build
npm run lint
# Rerun the sample-data seed at any time
npm --workspace services/api run db:seed
```

The database volume persists across container rebuilds. To rerun sample data manually, use the seed command above; rebuilding the container alone does not rerun PostgreSQL's first-time initialization scripts.

## Notes

This repo is set up as a scalable foundation for a legal client application, with a shared package architecture for reusable UI and types while keeping the web and API services decoupled but coordinated through the monorepo build tooling.
