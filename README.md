# PoetryVerse Monorepo

## Repo Organization

- `apps/web`: Next.js frontend (`http://localhost:3000`)
- `apps/api`: Express API (`http://localhost:3001`)
- `packages/database`: shared Prisma + PostgreSQL client

## Local Development Setup

### Prerequisites

- Node.js `>=18`
- npm
- PostgreSQL running locally

```bash
npm install
```

Create env files:

```bash
cp .env.example .env
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
cp packages/database/.env.example packages/database/.env
```

Fill in the missing env var values by following the instructions in each respective `.env` file. Please add the values directly; do not enclose them with double quotes (e.g. do `NEXT_AUTH_SECRET=secret-here` rather than `NEXT_AUTH_SECRET="secret-here"`).

Initialize Prisma:

```bash
npm run db:generate --workspace=packages/database
npm run db:push --workspace=packages/database
```

Seed the database:

```bash
npm run db:seed --workspace=packages/database
```

## Run

In separate terminals:

```bash
npm run dev:api
npm run dev
```

## Useful Commands

```bash
npm run build
npm run build:api
npm run build:web
npm run db:migrate --workspace=packages/database
npm run db:studio --workspace=packages/database
```

## Building and Running Docker Images

Notes:

- Make sure your environment files are configured correctly (`.env` files mentioned above for a development environment, or `.env.production` files for a production environment).

To build and run the docker images, you can run the docker compose file, or build and run them individually with the Dockerfiles.

### Using Docker Compose:

- We have the following docker compose files:
  - `docker-compose.yml` (default configuration)
  - `docker-compose.override.yml` (overrides docker-compose with local development customizations)
  - `docker-compose.prod.yml` (for production environment)
- When Docker Compose is run, these 4 containers will be started:
  - `poetryverse-db`
  - `poetryverse-api`
  - `poetryverse-web`
  - `poetryverse-migrate-{suffix}`
    - This one exits after applying Prisma migrations.

#### To use Compose in Development:

Run this command from root to build and run the containers: `docker compose up --watch`

- This will run the configurations of the `docker-compose.yml` and the `docker-compose.override.yml`.
- `docker-compose.override.yml` sets the Compose project name to `poetryverse-dev`, which keeps development Docker resources (containers, networks, volumes) isolated from production resources.

- `--watch` is used to automatically sync source file changes to the running services.

If you want to seed data in development, run this manually (from repo root):

```bash
docker compose run --rm migrate npm run db:seed --workspace=packages/database
```

#### To use Compose in Production:

If running this application in a production environment, create and configure the production env files:

```bash
cp .env.production.example .env.production
cp apps/api/.env.production.example apps/api/.env.production
cp apps/web/.env.production.example apps/web/.env.production
```

Then, run this command from root: `docker compose --env-file .env.production -f docker-compose.yml -f docker-compose.prod.yml up` .

- This runs the configurations of the `docker-compose.yml` and the `docker-compose.prod.yml`.
- `docker-compose.prod.yml` sets the Compose project name to `poetryverse-prod`, which keeps production Docker resources isolated from development resources.

If you need to seed data in production, run this manually (from repo root):

```bash
docker compose  --env-file .env.production -f docker-compose.yml -f docker-compose.prod.yml run --rm migrate npm run db:seed --workspace=packages/database
```

### Stopping the Containers:

To stop development containers, run `docker compose down`.

To stop production containers, run `docker compose --env-file .env.production -f docker-compose.yml -f docker-compose.prod.yml down`.

If you would like to remove the database volume for a given environment as well, add `-v` to the matching `down` command.

### Using the Dockerfiles:

Notes:

- Before running these commands, please ensure you have stopped any running PoetryVerse services to avoid port conflicts.

- In the `DATABASE_URL`, you must replace `localhost` with `host.docker.internal`. This is because `host.docker.internal` tells the docker container to use the host OS instead of localhost from within the container itself.

#### Follow these steps to build and run the backend docker image:

From root:

`docker build -f apps/api/Dockerfile.api -t seng513-api .`

`docker run --rm -p 3001:3001 -e DATABASE_URL="your-postgres-url" --env-file apps/api/.env seng513-api`

#### Follow these steps to build and run the frontend docker image:

From root:

`docker build -f apps/web/Dockerfile.web -t seng513-web .`

`docker run --rm -p 3000:3000 -e DATABASE_URL="your-postgres-url" --env-file ./apps/web/.env seng513-web`

## Recommended Extensions

ESLint

- Analyze all files with `npm run lint`

GitLens

Path Intellisense

Prettier - Code formatter

- Format all files with `npx prettier . --write`

Tailwind CSS IntelliSense

## Recommended VSCode Settings

Create a `.vscode/settings.json` file with the following configuration:

```json
{
  "editor.tabSize": 2,
  "editor.formatOnPaste": true,
  "editor.formatOnSave": true,
  "editor.formatOnSaveMode": "file",
  "files.insertFinalNewline": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "workbench.editor.customLabels.patterns": {
    "**/page.tsx": "${dirname}/${filename}.${extname}"
  },
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "always"
  },
  "files.associations": {
    "*.css": "tailwindcss",
    "*.scss": "tailwindcss"
  }
}
```

Restart VSCode to apply the new configuration.
