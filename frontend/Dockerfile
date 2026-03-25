# ETAPA 1: Build
# Usamos una imagen con Node para construir el proyecto
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .

# Vite genera los archivos estáticos en /dist
RUN npm run build

# ETAPA 2: Producción
# Usamos Nginx para servir los archivos estáticos
# Esta imagen es mucho más pequeña que una con Node
FROM nginx:alpine

# Copiamos los archivos del build al directorio de Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Configuración de Nginx para React Router
# Sin esto, al refrescar una ruta como /productos da 404
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]