# ----- BUILD ANGULAR -----
FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ----- NGINX PARA PRODUCCIÓN -----
FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/*

# IMPORTANTE: ajusta ESTA ruta según tu dist real
# si Angular genera dist/sakai-ng/browser → déjala
# si genera dist/sakai-ng → cámbiala
COPY --from=build /app/dist/sakai-ng/browser /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
