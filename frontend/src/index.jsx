import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import uuid from 'uuid/v1';

const baseURL = process.env.ENDPOINT;
const GOOGLE_API_ADDRESS = 'https://www.googleapis.com/geolocation/v1';
const geolocationApiKey = process.env.GEO_API_KEY;
const HELSINKI_COORDS = {
  lat: '60.192059',
  long: '24.945831',
};

const getClientGeoLocation = async () => {
  if (geolocationApiKey === 'empty') {
    return { HELSINKI_COORDS };
  }
  const weatherUrl = `${GOOGLE_API_ADDRESS}/geolocate?key=${geolocationApiKey}`;
  const fetchGeoAPI = await fetch(weatherUrl, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const response = await fetchGeoAPI.json();
  return {
    lat: response.location.lat,
    long: response.location.lng,
  };
};

const getForecastFromApi = async (lat, long) => {
  try {
    const response = await fetch(`${baseURL}/forecast/${lat},${long}`);
    return response.json();
  } catch (error) {
    return {};
  }
};

class Weather extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      place: 'Loading...',
      forecast: [],
      date: '',
    };
  }

  async componentWillMount() {
    try {
      const location = await getClientGeoLocation();
      const forecastData = await getForecastFromApi(location.lat, location.long);
      if (forecastData) {
        this.setState({
          forecast: forecastData.forecast,
          place: `${forecastData.name}, ${forecastData.country}`,
          date: forecastData.forecast[0].date,
        });
      }
    } catch (error) {
      const forecastBackup = await getForecastFromApi(HELSINKI_COORDS.lat, HELSINKI_COORDS.long);
      if (forecastBackup) {
        this.setState({
          forecast: forecastBackup.forecast,
          place: `${forecastBackup.name}, ${forecastBackup.country}`,
          date: forecastBackup.forecast[0].date,
        });
      }
    }
  }

  render() {
    const { place, forecast, date } = this.state;

    return (
      <div className="weatherInfo">
        <div className="header">
          <div className="header">
            <h1>{`${place}`}</h1>
            <h2>{`${date}`}</h2>
          </div>
        </div>
        <div className="container">
          {forecast.map(el => (
            <WeatherIcon
              key={uuid()}
              time={el.time}
              temp={el.temp}
              icon={el.weather.icon.slice(0, -1)}
            />))}
        </div>
      </div>
    );
  }
}

const WeatherIcon = props =>
  (<div className="icon">
    <span>{props.time}, +{props.temp}&#8451;</span>
    {props.icon && <img alt="weather_state" src={`/img/${props.icon}.svg`} />}
  </div>
);

WeatherIcon.propTypes = {
  time: PropTypes.string.isRequired,
  temp: PropTypes.number.isRequired,
  icon: PropTypes.string.isRequired,
};

ReactDOM.render(
  <Weather />,
  document.getElementById('app')
);
