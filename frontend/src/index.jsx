import React from 'react';
import ReactDOM from 'react-dom';

const baseURL = process.env.ENDPOINT;
const geolocationApiKey = process.env.GEO_API_KEY;

const getWeatherFromApi = async () => {
  try {
    const response = await fetch(`${baseURL}/weather`);
    return response.json();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
  return {};
};

const getClientGeoLocations = async () => {
  const weatherUrl = `https://www.googleapis.com/geolocation/v1/geolocate?key=${geolocationApiKey}`;
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

const getWeatherFromApiByCoordinates = async (lat, long) => {
  try {
    const response = await fetch(`${baseURL}/weather/${lat},${long}`);
    return response.json();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
  return {};
};

class Weather extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      icon: '',
      place: 'Loading...',
    };
  }

  async componentWillMount() {
    try {
      const location = await getClientGeoLocations();
      const weatherData = await getWeatherFromApiByCoordinates(location.lat, location.long);
      this.setState({
        icon: weatherData.weather.icon.slice(0, -1),
        place: `${weatherData.name}, ${weatherData.country}`,
      });
    } catch (error) {
      const weather = await getWeatherFromApi();
      this.setState({
        icon: weather.icon.slice(0, -1),
        place: 'Helsinki, FI',
      });
    }
  }

  render() {
    const { icon, place } = this.state;

    return (
      <div className="icon">
        <h1>{`${place}`}</h1>
        { icon && <img alt="weather_state" src={`/img/${icon}.svg`} /> }
      </div>
    );
  }
}

ReactDOM.render(
  <Weather />,
  document.getElementById('app')
);
