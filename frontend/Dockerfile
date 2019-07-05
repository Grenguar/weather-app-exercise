
FROM node:12.5-stretch-slim

RUN npm install webpack -g --ignore-optional
RUN npm install webpack-dev-server -g --ignore-optional
WORKDIR /app

COPY . /app
RUN npm install --ignore-optional
CMD ["/usr/local/bin/webpack-dev-server","--host", "0.0.0.0", "--config", "webpack.config.js", "--progress", "--inline", "--colors"]

EXPOSE 8000