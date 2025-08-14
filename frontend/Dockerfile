# syntax=docker/dockerfile:1.4
FROM node:20-alpine AS build
WORKDIR /frontend
COPY package*.json ./
RUN npm install
COPY . .
RUN ls -la
# RUN --mount=type=secret,id=dotenv \
#     sh -euxc '\
#       export $(grep -Ev "^(#|$)" /run/secrets/dotenv | xargs)  \
#       && npm run build \
#     '
RUN 'cat /run/secrets/dotenv'
ENV DOCKER_BUILDKIT=1
RUN --mount=type=secret,id=dotenv \
sh -euxc '\
  echo "Printing .env file contents:" && cat /run/secrets/dotenv && \
  export $(grep -Ev "^(#|$)" /run/secrets/dotenv | sed "s/^[ \t]*//" | xargs) && npm run build \
'

FROM node:20-alpine AS app
WORKDIR /frontend
COPY --from=build /frontend .
EXPOSE 3000
CMD ["npm", "start"]