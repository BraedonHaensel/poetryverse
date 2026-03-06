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

Fill in the missing env var values by following the instructions in each respective .env

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
    "source.fixAll.eslint": "explicit"
  },
}
```

Restart VSCode to apply the new configuration.
