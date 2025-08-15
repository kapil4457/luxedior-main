FROM node:20-alpine AS builder
WORKDIR /app
COPY sanity-studio/package*.json ./
RUN npm install
COPY sanity-studio/ ./
RUN npm run build

FROM node:20-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=builder /app/dist ./dist
EXPOSE 3333
CMD ["serve", "-s", "dist", "-l", "3333"]
