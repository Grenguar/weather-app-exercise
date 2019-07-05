
FROM node:12.5-stretch-slim
VOLUME /backend
COPY . .
RUN npm install --ignore-optional --silent
CMD npm start
EXPOSE 9000