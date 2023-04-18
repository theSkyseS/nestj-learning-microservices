# Use an official Node.js runtime as a parent image
FROM node:18-alpine

ENV PORT=${RABBITMQ_PORT:-5672}

# Set the working directory to /app
WORKDIR /usr/microservices/profile-service

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install the dependencies
RUN apk add --no-cache --virtual build-dependencies \
  python \
  make \
  g++ && \
  npm install --only=production && \
  apk del build-dependencies

# Copy the rest of the application code to the container
COPY . .

# Expose port for the application
EXPOSE $PORT

# Define the command to start the application
CMD ["npm", "run", "start"]