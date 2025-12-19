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

# Fix for Portainer caching old Nginx entrypoint and command
# If Portainer tries to run "nginx" (old command), we intercept it and run "node server.js" instead
RUN echo '#!/bin/sh' > /docker-entrypoint.sh && \
    echo 'if [ "$1" = "nginx" ]; then' >> /docker-entrypoint.sh && \
    echo '  echo "Detected old Nginx command. Switching to Node.js server..."' >> /docker-entrypoint.sh && \
    echo '  exec node server.js' >> /docker-entrypoint.sh && \
    echo 'fi' >> /docker-entrypoint.sh && \
    echo 'exec "$@"' >> /docker-entrypoint.sh && \
    chmod +x /docker-entrypoint.sh

USER node

EXPOSE 80
CMD ["node", "server.js"]
