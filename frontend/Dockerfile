# syntax=docker/dockerfile:1.4
FROM node:20-alpine AS build
WORKDIR /frontend

# Ensure coreutils (for cat) is installed
RUN apk add --no-cache coreutils

# Install dependencies
COPY package*.json ./
RUN npm install
COPY . .

# Debug: List files and directories to ensure the context is correct
RUN ls -la

# Debug: Print the contents of /run/secrets
RUN echo "Listing /run/secrets directory:" && ls -la /run/secrets

# Use BuildKit secret mount
RUN --mount=type=secret,id=dotenv \
    sh -euxc '\
      echo "Printing .env file contents:" && cat /run/secrets/dotenv && \
      export $(grep -Ev "^(#|$)" /run/secrets/dotenv | sed "s/^[ \\t]*//" | xargs) && \
      npm run build'

FROM node:20-alpine AS app
WORKDIR /frontend
COPY --from=build /frontend .
EXPOSE 3000
CMD ["npm", "start"]
