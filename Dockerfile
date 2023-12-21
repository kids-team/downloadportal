# Dockerfile for kids-team download portal
FROM node:21-alpine
LABEL org.opencontainers.image.description = "kids-team Download Portal"
WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .
EXPOSE 5000
CMD npm run server
