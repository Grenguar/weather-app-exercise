// eslint-disable-next-line no-unused-vars
const dotenv = require('dotenv').config(); // This is needed for the dotenv to work in order to keep secrets in .env file
// eslint-disable-next-line no-unused-vars
const debug = require('debug')('weathermap');

const Koa = require('koa');
const router = require('koa-router')();
const fetch = require('node-fetch');
const cors = require('kcors');

const appId = process.env.APPID || '';
const mapURI = process.env.MAP_ENDPOINT || 'http://api.openweathermap.org/data/2.5';
const targetCity = process.env.TARGET_CITY || 'Helsinki,fi';

const port = process.env.PORT || 9000;

const app = new Koa();
const BASE_URL = `/api`;

app.use(cors());

const fetchWeatherByCityName = async () => {
  const endpoint = `${mapURI}/weather?q=${targetCity}&appid=${appId}&`;
  const response = await fetch(endpoint);
  return response ? response.json() : {};
};

const fetchWeatherByGeoCoordinates = async (lat, long) => {
  if (!lat || !long) {
    return {};
  }
  const geoEndpoint = `${mapURI}/weather?lat=${lat}&lon=${long}&appid=${appId}`;
  const geoResponse = await fetch(geoEndpoint);
  return geoResponse ? geoResponse.json() : { error: 'Error occured', };
};

router.get(`${BASE_URL}/weather`, async ctx => {
  const weatherData = await fetchWeatherByCityName();
  ctx.type = 'application/json; charset=utf-8';
  ctx.body = weatherData.weather ? weatherData.weather[0] : {};
});

router.get(`${BASE_URL}/weather/:coords`, async ctx => {
  const coordsArray = ctx.params.coords.split(',');
  const weatherData = await fetchWeatherByGeoCoordinates(coordsArray[0], coordsArray[1]);
  if (weatherData.weather) {
    ctx.body = {
      weather: weatherData.weather[0],
      country: weatherData.sys.country,
      name: weatherData.name,
    };
  } else {
    ctx.body = {};
  }
});

app.use(router.routes());
app.use(router.allowedMethods());

const server = app.listen(port, () => {
  console.log(`Server listening on port: ${port}`);
});

module.exports = server;
