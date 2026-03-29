FROM node:20.9.0-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run ng build
FROM nginx:stable
COPY default.conf /etc/nginx/conf.d/
COPY --from=builder /app/dist/ /usr/share/nginx/html
EXPOSE 80