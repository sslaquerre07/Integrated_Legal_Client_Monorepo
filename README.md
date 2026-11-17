# Integrated Legal Client Monorepo

This repository is a TypeScript monorepo for the integrated legal client platform. It is organized around a shared package model with a Next.js frontend, a TypeScript API, and reusable shared libraries.

### What is built in this monorepo

The root-level build command uses Turbo to run the workspace build tasks. At the moment, the build pipeline includes four build targets:

1. `services/api` — TypeScript API type check (`tsc`) and SWC compilation
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

# GCP Information (Get this information from Google Cloud Console)
GCP_PROJECT_ID="our-project-id"
STORAGE_BUCKET_NAME="our-storage-bucket-name"

### Open the project in the container
1. Open the repository in VS Code.
2. Use the command palette and select:
   - "Dev Containers: Reopen in Container"
3. VS Code starts the services defined in `.devcontainer/docker-compose.yml`.

### Included container setup
The dev container starts three services:
- `web` and `api` — the application development containers
- `db` — PostgreSQL 16, with a persistent `pgdata` volume

#### Database in the Dev Container
The `db` service runs PostgreSQL 16 and stores its data in the persistent `pgdata` volume. The API schema is managed by TypeORM migrations; when the Dev Container is created, `postCreateCommand` installs dependencies and applies pending migrations after the database is healthy.

When new migrations are added, apply them in the Dev Container with:

```bash
npm --workspace services/api run migration:run
```

Sample rows are not loaded automatically. To load them manually, open Docker Desktop, select the running `db` container, and open its **Exec** tab. Run:

```bash
psql -U user -h localhost -d dev_db -f /seed.sql
```

If the initial migration fails because `nodes` already exists from the previous setup, reset the local database from the `db` container's **Exec** tab:

```bash
dropdb -U user -h localhost dev_db
createdb -U user -h localhost dev_db
```

Enter the database password (`password`) if prompted. **This permanently deletes all data in the local database.** Then run `npm --workspace services/api run migration:run` in the Dev Container terminal to recreate the schema. Afterward, you can optionally run the `psql` seed command above.

#### Google Cloud Setup
In order for your local environment to be able to communicate to Google Cloud Services such as our Storage Bucket, you will need to authenticate yourself with Google Cloud CLI with the following commands:
```bash
# Sign in to the Google Cloud CLI and select a project
gcloud init
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
```

## Notes

This repo is set up as a scalable foundation for a legal client application, with a shared package architecture for reusable UI and types while keeping the web and API services decoupled but coordinated through the monorepo build tooling.
