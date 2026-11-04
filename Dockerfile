# Multi-stage production container for HemaCare OS / RaktSetu
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install dependencies first for layer caching
COPY package*.json ./
RUN npm ci --omit=dev

# Copy all application code
COPY . .

# Expose port (Render, Railway, Cloud Run inject $PORT)
ENV PORT=5000
ENV NODE_ENV=production

EXPOSE 5000

# Start server
CMD ["node", "server.js"]
