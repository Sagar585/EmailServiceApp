# Use a Node.js base image with a version that supports ??=
FROM node:16

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the backend code
COPY . .

# Expose the port that your backend uses
EXPOSE 2000

# Start the backend application
CMD ["node", "index.js"]
