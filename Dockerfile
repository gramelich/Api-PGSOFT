# Estágio de build
FROM node:18-alpine AS builder

WORKDIR /app

# Copia arquivos de dependências
COPY package.json yarn.lock* ./
RUN if [ -f yarn.lock ]; then yarn install --frozen-lockfile --production=false; \
    else npm install; fi

# Copia código fonte e compila TS
COPY src/ ./src/
COPY tsconfig.json ./
RUN if [ -f yarn.lock ]; then yarn build; \
    else npm run build; fi

# Estágio de produção
FROM node:18-alpine AS production

WORKDIR /app

# Instala apenas deps de produção
COPY package.json yarn.lock* ./
RUN if [ -f yarn.lock ]; then yarn install --frozen-lockfile --production=true; \
    else npm ci --only=production; fi

# Copia código compilado
COPY --from=builder /app/dist ./dist
COPY .env* ./

# Expõe porta
EXPOSE 3000

# Comando de start (ajuste se o package.json tiver script diferente)
CMD ["node", "dist/index.js"]  # Assumindo que o entry point é dist/index.js; verifique no repo
