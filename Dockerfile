# Dockerfile for kids-team download portal
FROM node:21-alpine
LABEL org.opencontainers.image.description = "kids-team Download Portal"
LABEL org.opencontainers.image.source="https://github.com/kids-team/downloadportal"
WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .
EXPOSE 5000
CMD npm run server
