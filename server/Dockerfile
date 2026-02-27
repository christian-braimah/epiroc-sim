# Use Node.js 20
FROM node:20-alpine
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy all source files
COPY . .

# Use Port 4000
EXPOSE 4000

# Run the app
CMD ["node", "server.js"]

