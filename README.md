# PoetryVerse Monorepo

## What Is In This Repo

- `apps/web`: Next.js frontend (`http://localhost:3000`)
- `apps/api`: Express API (`http://localhost:3001`)
- `packages/database`: shared Prisma + PostgreSQL client

## Prerequisites

- Node.js `>=18`
- npm
- PostgreSQL running locally

## Setup

```bash
npm install
```

Create env files:

```bash
cp .env.example .env
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
```

Fill in the missing env var values by following the instructions in each respective `.env` file. Please add the values directly; do not enclose them with double quotes (e.g. do `NEXT_AUTH_SECRET=secret-here` rather than `NEXT_AUTH_SECRET="secret-here"`).

Initialize Prisma:

```bash
npm run db:generate --workspace=packages/database
npm run db:push --workspace=packages/database
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

- Make sure your `apps/api/.env` and `apps/web/.env` are configured correctly.
- When running the application with Docker, you must replace `localhost` in the `DATABASE_URL` with `host.docker.internal` in all `.env` files. This is because `host.docker.internal` tells the docker container to use the host OS instead of localhost from within the container itself. 

To build and run the docker images, you can run the docker compose file, or build and run them individually with the Dockerfiles.

### Using Docker Compose:
- We have the following docker compose files:
  - `docker-compose.yml` (default configuration)
  - `docker-compose.override.yml` (overrides docker-compose with local development customizations)
  - `docker-compose.prod.yaml` (for production environment)
- When Docker Compose is run, these 3 containers will be started: 
  - `poetryverse-db`
  - `poetryverse-api`
  - `poetryverse-web`

#### To use Compose in Development:

Run this command from root to build and run the containers: `docker compose up`
- This will run the configurations of the `docker-compose.yml` and the `docker-compose.override.yml`. 

#### To use Compose in Production: 
Ensure that your `apps/api/.env.production` and `apps/web/.env.production` are configured correctly.

Then, run this command from root: `docker compose -f docker-compose.yml -f docker-compose.prod.yml up` . 
  - This runs the configurations of the `docker-compose.yml` and the `docker-compose.prod.yml`. 

<br />

To stop the containers, run `docker compose down`. If you would like to remove the database volume as well, run `docker compose down -v`.

### Using the Dockerfiles:

#### Follow these steps to build and run the backend docker image:

From root:

`docker build -f apps/api/Dockerfile.api -t seng513-api .`

`docker run --rm -p 3001:3001 -e DATABASE_URL="your-postgres-url" --env-file apps/api/.env seng513-api`

#### Follow these steps to build and run the frontend docker image:
(Before running these commands, please ensure you have stopped your local Next.js process if there is already one running on port 3000.)

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
