# Step 1: Build the app using Node.js
FROM node:22 AS build

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json to the container
COPY package*.json ./



# Install the dependencies
RUN npm install --omit=dev

RUN npm install typescript
# Copy the rest of the app code
COPY . .

# Build the Vite app for production
RUN npm run build
RUN npm uninstall typescript


# Expose the port that the app will run on
EXPOSE 4173

# Command to run Nginx
CMD ["npm", "run", "preview"]
