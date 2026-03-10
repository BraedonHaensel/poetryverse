FROM node:24-bookworm-slim
WORKDIR /app

# Install necessary dependencies
COPY package.json package-lock.json ./
COPY apps/api/package.json apps/api/package.json
COPY packages/database/package.json packages/database/package.json
RUN npm ci

# Copy api and database and preserve file structure for npm workspaces
COPY apps/api apps/api
COPY packages/database packages/database

# Include DATABASE_URL for Prisma
ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

# Generate Prisma client and then build api
RUN npm run db:generate --workspace=packages/database
RUN npm run build --workspace=apps/api

# Set correct WORKDIR
WORKDIR /app/apps/api

# Expose port 3001 and run the API
EXPOSE 3001
CMD ["npm", "start"]
