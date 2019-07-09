
FROM node:12.5-stretch-slim
WORKDIR /app-be
COPY . ./app-be
RUN npm install --ignore-optional --silent
CMD npm start
EXPOSE 9000