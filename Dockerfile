# RAULIF TRAVEL — Frontend del catálogo (SPA Vite)
# Sirve el bundle estático + proxiéa /api/raulif-mvp/ al backend
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:stable-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
