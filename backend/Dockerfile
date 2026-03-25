# Usamos una imagen base oficial de Node
# "alpine" es una versión mínima de Linux, mucho más liviana
FROM node:20-alpine

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiamos primero solo los archivos de dependencias
# Docker cachea cada capa — si package.json no cambió,
# no reinstala dependencias en el siguiente build
COPY package*.json ./

# Instalamos solo dependencias de producción
RUN npm ci --only=production

# Ahora copiamos el resto del código
# Hacemos esto después del npm install para aprovechar el cache
COPY . .

# Documentamos el puerto que usa la app
EXPOSE 3000

# Comando para iniciar el servidor
CMD ["node", "src/server.js"]