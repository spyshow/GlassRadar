# Stage 1: Base - Install dependencies only when package.json changes
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm install

# Stage 2: Build - Copy source and build the application
FROM base AS build
COPY . .
RUN npm run build

# Stage 3: Production - Serve the built app using Nginx
FROM nginx:stable-alpine AS production
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
