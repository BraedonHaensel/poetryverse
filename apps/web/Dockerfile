FROM node:24-bookworm-slim
WORKDIR /app

# Install necessary dependencies
COPY package.json package-lock.json ./
COPY apps/web/package.json apps/web/package.json
RUN npm ci

# Copy web application and preserve file structure for npm workspaces
COPY apps/web apps/web

# Include NEXT_PUBLIC_API_URL for the backend API url
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# Set correct WORKDIR
WORKDIR /app/apps/web

# Expose port 3000 and run the web application
EXPOSE 3000
CMD ["npm", "run", "dev"]
