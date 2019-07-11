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

const MONTHS = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', ];

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

const fetchForecastByGeoCoordinates = async (lat, long) => {
  if (!lat || !long) {
    return {};
  }
  const forecastEndpoint = `${mapURI}/forecast?lat=${lat}&lon=${long}&appid=${appId}&cnt=4&units=metric`;
  const forecastResponse = await fetch(forecastEndpoint);
  return forecastResponse ? forecastResponse.json() : { error: 'Error occured', };
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

router.get(`${BASE_URL}/forecast/:coords`, async ctx => {
  const coordsArray = ctx.params.coords.split(',');
  const forecastData = await fetchForecastByGeoCoordinates(coordsArray[0], coordsArray[1]);
  if (forecastData.cod === '200') {
    ctx.body = createResponseFromForecastData(forecastData);
  } else {
    ctx.body = {};
  }
});

const createResponseFromForecastData = (forecast) => {
  let response = {};
  let forecastList = forecast.list;
  const cityInfo = forecast.city;
  response = {
    name: cityInfo.name,
    country: cityInfo.country,
  };
  let responseWeatherArray = [];
  for (const index in forecastList) {
    const weatherEl = forecastList[index];
    const timestamp = weatherEl.dt;
    responseWeatherArray.push({
      date: transformTimeStampToDate(timestamp),
      time: transformTimestampToHours(timestamp),
      temp: Math.round(weatherEl.main.temp),
      weather: weatherEl.weather[0],
    });
  }
  response.forecast = responseWeatherArray;
  return response;
};

const transformTimestamp = (timestamp) => {
  return new Date(timestamp * 1000);
};

const transformTimeStampToDate = (timestamp) => {
  const date = transformTimestamp(timestamp);
  return `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
};

const transformTimestampToHours = (timestamp) => {
  const date = transformTimestamp(timestamp);
  const minutes = date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes();
  return `${date.getHours()}:${minutes}`;
};

app.use(router.routes());
app.use(router.allowedMethods());

const server = app.listen(port, () => {
  console.log(`Server listening on port: ${port}`);
});

module.exports = server;
