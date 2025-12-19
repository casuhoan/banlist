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
# Create directory for data persistence
RUN mkdir data
COPY src/data/formats.json ./data/formats.json

EXPOSE 80
CMD ["node", "server.js"]
