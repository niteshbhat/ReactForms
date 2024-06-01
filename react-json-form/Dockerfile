# Use the official Node.js image as the base image
FROM node:14-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Build the React application
RUN npm run build

# Install a lightweight HTTP server to serve the static files
RUN npm install -g serve

# Set the command to serve the React application
CMD ["serve", "-s", "build"]

# Expose port 5000
EXPOSE 5000
