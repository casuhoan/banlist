# Build Stage
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Ensure typescript is available or simply run build which uses local node_modules binary
RUN npx vite build

# Serve Stage
# Serve Stage
FROM node:18-alpine
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY package*.json ./
COPY server.js ./
# Install ONLY production dependencies (express)
RUN npm install --omit=dev
# Create directory for data persistence and set permissions
RUN mkdir data && chown -R node:node /app
COPY --chown=node:node src/data/formats.json ./data/formats.json

# Fix for Portainer caching old Nginx entrypoint
# We create a dummy entrypoint script because Portainer might still try to run /docker-entrypoint.sh
RUN echo '#!/bin/sh' > /docker-entrypoint.sh && \
    echo 'exec "$@"' >> /docker-entrypoint.sh && \
    chmod +x /docker-entrypoint.sh

USER node

EXPOSE 80
CMD ["node", "server.js"]
