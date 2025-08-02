FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy dependencies files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the app
COPY . .

# Set Node.js heap memory limit
ENV NODE_OPTIONS="--max-old-space-size=1024"

# Expose port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]