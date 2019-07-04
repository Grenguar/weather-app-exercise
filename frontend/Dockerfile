
FROM node:12.5-stretch-slim

VOLUME /frontend
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8000
CMD [ "npm", "start" ]