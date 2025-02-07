# Step 1: Use a Node.js image to build the project
FROM node:16-alpine as builder
WORKDIR /usr/src/app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps

# Build the project
COPY . .
RUN npm run build

# Step 2: Use a lightweight web server to serve the build
FROM nginx:stable-alpine

# Copy the build application from the previous state to the Nginx container
COPY --from=builder /usr/src/app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
