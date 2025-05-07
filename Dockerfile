# Fase 1 - Builder: só compila o projeto
FROM node:18-alpine AS builder

WORKDIR /app

# Copia só o package.json e o package-lock.json pra aproveitar cache do Docker
COPY package*.json ./

# Instala apenas dependências de produção
RUN npm install

# Copia todo o restante do código
COPY . .

# Compila o projeto
RUN npm run build

# Fase 2 - Runner: imagem final, mínima
FROM node:18-alpine AS runner

WORKDIR /app

# Define ambiente de produção
ENV NODE_ENV=production

# Copia apenas o necessário da fase builder
COPY --from=builder /app/.next/ ./.next/
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./

# Instala dependências de produção na imagem final
RUN npm install --omit=dev

# Expõe a porta (Next.js usa a 3000, mas adapta se precisar)
EXPOSE 3000

# Comando padrão de inicialização
CMD ["npm", "start"]