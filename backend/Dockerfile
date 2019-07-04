
FROM node:12.5-stretch-slim

COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 9000
CMD [ "node", "src/index.js" ]