# Use a Node.js base image
FROM node:14

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the frontend code
COPY . .

# Build the frontend application (if you're building it)
RUN npm run build

# Expose the port that your frontend uses
EXPOSE 3000

# Start the frontend application (assuming you're using a development server)
CMD ["npm", "start"]
