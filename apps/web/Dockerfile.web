FROM node:24-bookworm-slim
WORKDIR /app

# Install necessary dependencies
COPY package.json package-lock.json ./
COPY apps/web/package.json apps/web/package.json
COPY packages/database/package.json packages/database/package.json
RUN npm ci

# Copy web application and preserve file structure for npm workspaces
COPY apps/web apps/web
COPY packages/database packages/database

# Include DATABASE_URL for Prisma
ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

# Include NEXT_PUBLIC_API_URL for the backend API url
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# Generate Prisma client
RUN npm run db:generate --workspace=packages/database

# Set correct WORKDIR
WORKDIR /app/apps/web

# Expose port 3000 and run the web application
EXPOSE 3000
CMD ["npm", "run", "dev"]
