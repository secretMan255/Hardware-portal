# Introduce

This is a landing page made by node.js, vuetify that using axios to fetch data from the [backend](https://github.com/secretMan255/Rest-API-and-Mysql-Service).

# How to setup?

Set enviroment variable

-    VITE_API_BASE_URL -> API endpoint
-    VITE_BEREAR_TOKEN -> Token
-    VITE_GOOGLE_CLIENT_ID -> Google client id for initial google login
-    VITE_SITE_KEY -> Google reCAPTCHA site key (not using now, load loadRecaptcha if u want to use)
-    VITE_MAP_KEY -> Google map api key

Install package

```
npm run i
```

Start project

```
npm run dev
```

# Deploy

Create nginx folder in root path and touch default.conf to configue nginx (already provided)

```
server {
    listen 8080;
    server_name localhost;

    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri /index.html;
    }

    error_page 404 /index.html;

    gzip on;
    gzip_types text/plain application/xml text/css application/javascript;
    gzip_min_length 1024;
}
```

Build dict

```
npm run build
```

Create a Dockerfile in root path (already provided)

```
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
```

Build image

```
docker build -t image-name .
```

If u want to push to dockerhub

```
docker push tagname/image-name
```

Create script (googleDeploy.sh) at root path if u want to deploy on google cloud run
Start Deploy

```
./googleDeploy.sh
```

Script

```
# Define environment variables
GOOGLE_PROJECT_ID=""
CLOUD_RUN_SERVICE=""
VITE_API_BASE_URL=""
VITE_BEREAR_TOKEN=""
VITE_GOOGLE_CLIENT_ID=""
VITE_SITE_KEY=""
VITE_MAP_KEY=""

# Step 2: Deploy to Cloud Run
gcloud run deploy $CLOUD_RUN_SERVICE \
     --image=docker.io/yapyiliang2001/wingman-hardware-portal:latest \
     --update-env-vars=VITE_API_BASE_URL=$VITE_API_BASE_URL,VITE_BEREAR_TOKEN=$VITE_BEREAR_TOKEN,VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID,VITE_SITE_KEY=$VITE_SITE_KEY,VITE_MAP_KEY=$VITE_MAP_KEY \
     --platform=managed \
     --region=asia-southeast1 \
     --allow-unauthenticated \
     --timeout=500s \
     --project=$GOOGLE_PROJECT_ID
```
