
FROM node:12.5-stretch-slim

COPY package*.json ./
RUN npm install
COPY . .
CMD [ "npm", "start" ]
EXPOSE 8000
