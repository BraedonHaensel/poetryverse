# SENG 513 - PoetryVerse Database Schema and Seeding Script - PG 2

## Group members:

| Person          | Lecture | Lab | UCID     |
| --------------- | ------- | --- | -------- |
| Carson May      | L01     | B05 | 30139961 |
| Sukriti Badhwar | L01     | B05 | 30164075 |
| Feranmi Falade  | L01     | B05 | 30145480 |
| Chantae Ho      | L01     | B08 | 30141743 |
| Rohan Kapila    | L01     | B08 | 30145862 |
| Braedon Haensel | L01     | B02 | 30144363 |

## Prerequisites

Install Git from https://git-scm.com/install/.

Install and run Docker from https://docs.docker.com/get-started/get-docker/.

We recommend using Visual Studio Code for development, which can be installed from https://code.visualstudio.com/download.

## Step 1: Clone the repository

Clone the PoetryVerse project repository with SSH with the following command:

```bash
git clone git@csgit.ucalgary.ca:rohan.kapila/seng513-202601-pg-2.git
```

Navigate into the project folder with the following command:

```bash
cd seng513-202601-pg-2
```

Switch to the commit tagged with ‘schema-milestone’ using the following command:

```bash
git switch --detach schema-milestone
```

## Step 2: Create each of the .env files

Create each of the `.env` and `.env.production` files by copying each of their respective `.env.example` and `.env.production.example` files, with the following commands:

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

<u>Note to TA: Please populate the `.env` files with the `.env` file examples we have submitted.</u>

Otherwise, if the `.env` file examples were not provided, you would populate each of the `.env` files created in the previous step by following their commented instructions. You will need to contact a PoetryVerse team member to obtain some of the secret environment variable values.

## Schema and seeding instructions with the Docker PostgreSQL instance

### [Compose] Step 4.1: Run PoetryVerse with Docker Compose

Start the _development_ Compose environment:

```bash
docker compose up --watch
```

Alternatively, start the _production_ Compose environment:

```bash
docker compose --env-file .env.production -f docker-compose.yml -f docker-compose.prod.yml up
```

_Note_: When spinning up either environment, the "migrate" service defined in the base docker-compose.yml gets created, applies the migrations and the schema on the database, and exits.

_Note_: The Compose environments must be stopped and cleaned up before switching between _development_ and _production_:

- Stop and clean up a development environment:

  ```bash
  docker compose down
  ```

- Stop and clean up a production environment:

  ```bash
  docker compose -f docker-compose.yml -f docker-compose.prod.yml down
  ```

### [Compose] Step 5.1: Seed the containerized PostgreSQL database

Seed the database in the _development_ Compose environment:

```bash
docker compose run --rm migrate npm run db:seed --workspace=packages/database
```

Alternatively, seed the database in the _production_ Compose environment:

```bash
docker compose --env-file .env.production -f docker-compose.yml -f docker-compose.prod.yml run --rm migrate npm run db:seed --workspace=packages/database
```

_Note_: Running the seed command populates seed data by starting a temporary container based on the "migrate" service and overrides the service’s default command with the Prisma seeding command.

### [Compose] Step 6.1: Viewing the database contents

Connect to the containerized _development_ PostgreSQL database:

```bash
docker exec -it poetryverse-db psql -U poetryverse -d poetryverse
```

Alternatively, connect to the containerized _production_ PostgreSQL database, replacing _POSTGRES_USER_ and _POSTGRES_DB_ with their secret values in the root `.env.production` file:

```bash
docker exec -it poetryverse-db psql -U <POSTGRES_USER> -d <POSTGRES_DB>
```

In the psql terminal, list the PoetryVerse database tables:

```bash
\dt
```

View a table’s schema:

```bash
\d "<table>"
```

- For example:

  ```bash
  \d "Poem"
  ```

- _Tip_: If necessary, use `q` to exit the viewer

View the seeded rows for a table:

```bash
SELECT * FROM "<table>";
```

- For example:

  ```bash
  SELECT * FROM "Poem";
  ```

- _Tip_: If necessary, use `q` to exit the viewer

- _Tip_: For a cleaner view of the table rows without line wrapping, use:

  ```bash
  \pset x on
  ```
