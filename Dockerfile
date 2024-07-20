# Etapa de construcción
FROM node:20-alpine AS builder

# Habilitar pnpm y preparar entorno
RUN corepack enable && corepack prepare pnpm@latest --activate
ENV PNPM_HOME=/usr/local/bin

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package.json pnpm-lock.yaml ./

# Instalar dependencias de construcción
RUN pnpm install

# Copiar todo el código fuente
COPY . .

# Copiar el archivo .env al contenedor
COPY .env .env

# Construir el proyecto
RUN pnpm build

# Imagen de producción
FROM node:20-alpine

# Habilitar pnpm y preparar entorno
RUN corepack enable && corepack prepare pnpm@latest --activate
ENV PNPM_HOME=/usr/local/bin

# Establecer directorio de trabajo
WORKDIR /app

# Copiar dependencias de producción desde la etapa de construcción
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --production --frozen-lockfile

# Copiar el código construido desde la etapa de construcción
COPY --from=builder /app/dist /app/dist

# Copiar el archivo .env al contenedor
COPY .env .env

# Comando de inicio
CMD ["npm", "start"]