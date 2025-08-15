# syntax=docker/dockerfile:1.4
FROM node:20-alpine AS build
WORKDIR /frontend

RUN apk add --no-cache coreutils

ARG SANITY_PROJECT_ID
ARG SANITY_API_TOKEN
ARG SANITY_API_VERSION
ARG SANITY_PROJECT_ENV

COPY package*.json ./
RUN npm install
COPY . .

RUN ls -la
RUN SANITY_PROJECT_ID=${SANITY_PROJECT_ID} SANITY_API_TOKEN=${SANITY_API_TOKEN} SANITY_API_VERSION=${SANITY_API_VERSION} SANITY_PROJECT_ENV=${SANITY_PROJECT_ENV} npm run build


# RUN echo "Listing /run/secrets directory:" && ls -la /run/secrets

# RUN --mount=type=secret,id=dotenv \
#     sh -euxc '\
#       echo "Printing .env file contents:" && cat /run/secrets/dotenv && \
#       export $(grep -Ev "^(#|$)" /run/secrets/dotenv | sed "s/^[ \\t]*//" | xargs) && \
#       npm run build'

FROM node:20-alpine AS app
WORKDIR /frontend
COPY --from=build /frontend .
EXPOSE 3000
CMD ["npm", "start"]
