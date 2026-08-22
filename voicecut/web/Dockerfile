FROM node:20-alpine AS build

WORKDIR /app
COPY voicecut/web/package.json voicecut/web/package-lock.json ./
RUN npm ci
COPY voicecut/web/ ./
RUN npm run build

FROM nginx:alpine
COPY voicecut/web/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
