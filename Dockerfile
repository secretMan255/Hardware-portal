# Step 1: Use a lightweight web server to serve the pre-built files
FROM nginx:stable-alpine

# Copy the pre-built files to the Nginx container
COPY dist /usr/share/nginx/html

# Copy the custom Nginx configuration file
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# Validate the Nginx configuration to catch errors early
RUN nginx -t

# Expose the port for serving the application
EXPOSE 8080

# Start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]

