# Integrated Legal Client API

The API is a NestJS service for the Integrated Legal Client monorepo. It manages
the file/folder node hierarchy and stores uploaded file content in Google Cloud
Storage.

## Getting Started

Run commands from the repository root unless noted otherwise.

```bash
npm install
npm --workspace services/api run dev
npm --workspace services/api run build
```

The API listens on `http://localhost:3001`. Swagger documentation is available at
`http://localhost:3001/api`.

You can also run the workspace locally:

```bash
cd services/api
npm run dev
npm run build
```

## Environment Variables

Database access uses either `DATABASE_URL` or the individual database variables
shown below.

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | Optional PostgreSQL connection URL |
| `DB_HOST` | PostgreSQL host or Cloud SQL connection name |
| `DB_PORT` | PostgreSQL port; defaults to `5432` |
| `DB_USER` | PostgreSQL username |
| `DB_PASSWORD` | PostgreSQL password |
| `DB_NAME` | PostgreSQL database name |
| `DB_SCHEMA` | PostgreSQL schema; defaults to `public` |
| `GCP_PROJECT_ID` | Google Cloud project used by Cloud Storage |
| `STORAGE_BUCKET_NAME` | Google Cloud Storage bucket used for uploaded files |

The Dev Container provides the local database with:

- Host: `db`
- Port: `5432`
- Database: `dev_db`
- Username: `user`
- Password: `password`

The service requires both `GCP_PROJECT_ID` and `STORAGE_BUCKET_NAME` at startup.

## Data Model

### Nodes

The `nodes` table represents both folders and files.

- `id`: UUID primary key
- `name`: display name
- `is_folder`: whether the node is a folder
- `parent_id`: optional UUID of the parent node

Nodes use a self-referencing parent/children relationship. Deleting a parent
node cascades to its descendants. The API prevents deleting folders that contain
child nodes.

### Versions

The `versions` table represents versions of file nodes.

- `node_version`: UUID primary key
- `node_id`: required foreign key referencing `nodes.id`
- `is_current`: whether this is the file's current version
- `file_type`: MIME or file type
- `created_at`: version creation timestamp

Deleting a node also deletes its associated versions through the database foreign
key.

## Database Migrations

Migration commands are available from the repository root.

Generate a migration from entity changes:

```bash
npm --workspace services/api run migration:generate -- src/migrations/CreateVersions
```

Run pending migrations:

```bash
npm --workspace services/api run migration:run
```

Revert the most recent migration:

```bash
npm --workspace services/api run migration:revert
```

Migration files are stored in `src/migrations`, and `src/data-source.ts` defines
the TypeORM entities and migration paths.

## Validation and Quality

```bash
npm --workspace services/api run lint
npm --workspace services/api run test
npm --workspace services/api run build
```
