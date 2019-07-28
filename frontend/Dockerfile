
FROM node:12.5-stretch-slim
WORKDIR /app
COPY package*.json ./
RUN npm install --ignore-optional --silent
COPY . .
CMD npm start
EXPOSE 8000