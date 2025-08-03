FROM node:20-alpine AS build
WORKDIR /frontend
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build


FROM node:20-alpine AS app
WORKDIR /frontend
COPY --from=build /frontend .
EXPOSE 3000
CMD ["npm", "start"]