# Stage 1: Build the React Frontend
FROM node:18-alpine as build-frontend
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Force relative paths for API (so /api works on same domain)
ENV VITE_API_URL=""
RUN npm run build

# Stage 2: Setup the Node.js Backend
FROM node:18-alpine as production
WORKDIR /app

# Install backend dependencies
COPY backend/package*.json ./backend/
WORKDIR /app/backend
RUN npm install --production

# Move back to root
WORKDIR /app

# Copy built frontend from Stage 1 to /app/dist
COPY --from=build-frontend /app/dist ./dist

# Copy backend source code to /app/backend
COPY backend ./backend

# Default to port 80 for hosting (standard HTTP port)
ENV PORT=80
EXPOSE 80

# Start the backend (which now also serves the frontend)
CMD ["node", "backend/server.js"]
