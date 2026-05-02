# SENG 513 - PoetryVerse Database Schema and Seeding Script - PG 2

## Group Members

- Sukriti Badhwar
- Feranmi Falade
- Braedon Haensel
- Chantae Ho
- Rohan Kapila
- Carson May

## Schema File

The Prisma database schema is located at [packages/database/prisma/schema.prisma](../packages/database/prisma/schema.prisma).

## Seeding Script

The seed script is located at [packages/database/prisma/seed.js](../packages/database/prisma/seed.js).

Seed data is stored in [packages/database/prisma/seeding-data/](../packages/database/prisma/seeding-data/).

## Prerequisites

Install Git from https://git-scm.com/install/.

Install and run Docker from https://docs.docker.com/get-started/get-docker/.

We recommend using Visual Studio Code for development, which can be installed from https://code.visualstudio.com/download.

## Step 1: Clone the repository

Clone the PoetryVerse project repository with SSH with this command:

```bash
git clone git@csgit.ucalgary.ca:rohan.kapila/seng513-202601-pg-2.git
```

Navigate into the project folder with this command:

```bash
cd seng513-202601-pg-2
```

Switch to the commit tagged with ‘schema-milestone’ with this command:

```bash
git switch --detach schema-milestone
```

## Step 2: Create the .env files

Create the `.env` and `.env.production` files by copying their respective `.env.example` and `.env.production.example` files with these commands:

```bash
cp .env.example .env
cp .env.production.example .env.production

cp apps/api/.env.example apps/api/.env
cp apps/api/.env.production.example apps/api/.env.production

cp apps/web/.env.example apps/web/.env
cp apps/web/.env.production.example apps/web/.env.production

cp packages/database/.env.example packages/database/.env
```

## Step 3: Populate the .env files

<u>Note to the TAs: Please populate the `.env` files with the `.env` file examples we have submitted.</u>

Otherwise, if the `.env` file examples were not provided, you would populate the `.env` files created in the previous step by following their commented instructions. You will need to contact a PoetryVerse team member to obtain some of the secret environment variable values.

## Schema and seeding instructions with the Docker PostgreSQL instance

### [Compose] Step 4.1: Run PoetryVerse with Docker Compose

Start the _development_ Compose environment with this command:

```bash
docker compose up --watch
```

Alternatively, start the _production_ Compose environment with this command:

```bash
docker compose --env-file .env.production -f docker-compose.yml -f docker-compose.prod.yml up
```

_Note_: When spinning up either environment, the "migrate" service defined in the base docker-compose.yml gets created, applies the migrations and the schema on the database, and exits.

_Note_: The Compose environments must be stopped and cleaned up before switching between _development_ and _production_:

- Stop and clean up a development environment with this command:

  ```bash
  docker compose down
  ```

- Stop and clean up a production environment with this command:

  ```bash
  docker compose -f docker-compose.yml -f docker-compose.prod.yml down
  ```

### [Compose] Step 5.1: Seed the containerized PostgreSQL database

Seed the database in the _development_ Compose environment with this command:

```bash
docker compose run --rm migrate npm run db:seed --workspace=packages/database
```

Alternatively, seed the database in the _production_ Compose environment with this command:

```bash
docker compose --env-file .env.production -f docker-compose.yml -f docker-compose.prod.yml run --rm migrate npm run db:seed --workspace=packages/database
```

_Note_: Running the seed command populates seed data by starting a temporary container based on the "migrate" service and overrides the service’s default command with the Prisma seeding command.

### [Compose] Step 6.1: View the database contents

Connect to the containerized _development_ PostgreSQL database with this command:

```bash
docker exec -it poetryverse-db psql -U poetryverse -d poetryverse
```

Alternatively, connect to the containerized _production_ PostgreSQL database, replacing _POSTGRES_USER_ and _POSTGRES_DB_ with their secret values in the root `.env.production` file, with this command:

```bash
docker exec -it poetryverse-db psql -U <POSTGRES_USER> -d <POSTGRES_DB>
```

In the psql terminal, list the PoetryVerse database tables with this command:

```bash
\dt
```

View a table’s schema with this command:

```bash
\d "<table>"
```

- For example:

  ```bash
  \d "Poem"
  ```

- _Tip_: If necessary, use `q` to exit the viewer

View the seeded rows for a table with this command:

```bash
SELECT * FROM "<table>";
```

- For example:

  ```bash
  SELECT * FROM "Poem";
  ```

- _Tip_: If necessary, use `q` to exit the viewer

- _Tip_: For a cleaner view of the table rows, enable expanded display with this command:

  ```bash
  \pset x on
  ```

## Schema and seeding instructions with a local PostgreSQL database

_Prerequisite_: Install PostgreSQL and set up a local database:

- https://www.postgresql.org/download/

_Important Note_: Ensure the `DATABASE_URL` environment variable in [packages/database/.env](../packages/database/.env) is uncommented and points to your local PostgreSQL database.

### [Local] Step 4.2.1: Install dependencies and generate the Prisma client

Install the app's dependencies with this command:

```bash
npm install
```

Generate the Prisma client with this command:

```bash
npm run db:generate --workspace=packages/database
```

### [Local] Step 4.2.2: Apply schema/migrations to the local database

There are several ways to apply the schema/migrations to your _local_ database.

The easiest is with this command, which just applies the Prisma schema directly to your database (recommended for basic local setup):

```bash
npm run db:push --workspace=packages/database
```

Alternatively, the schema can be applied by running the Prisma migrations with this command (recommended for CI/staging/production):

```bash
npm run db:deploy --workspace=packages/database
```

### [Local] Step 5.2: Seed the local database

Once the Prisma schema is applied, you can run the Prisma seeding script with this command:

```bash
npm run db:seed --workspace=packages/database
```

### [Local] Step 6.2: View the database contents

Connect to the _local_ PostgreSQL database using your corresponding _username_ and _db_name_ with this command:

```bash
psql -U <username> -d <db_name>
```

View a table’s schema with this command:

```bash
\d "<table>"
```

- For example:

  ```bash
  \d "Poem"
  ```

- _Tip_: If necessary, use `q` to exit the viewer

View the seeded rows for a table with this command:

```bash
SELECT * FROM "<table>";
```

- For example:

  ```bash
  SELECT * FROM "Poem";
  ```

- _Tip_: If necessary, use `q` to exit the viewer

- _Tip_: For a cleaner view of the table rows, enable expanded display with this command:

  ```bash
  \pset x on
  ```
