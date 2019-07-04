
FROM node:12.5-stretch-slim

VOLUME /backend
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 9000
CMD [ "npm", "start" ]