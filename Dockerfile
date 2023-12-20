# Comment
FROM node:21-alpine

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .
EXPOSE 5000
CMD npm run server
