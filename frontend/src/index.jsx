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
  const weatherUrl = `https://www.googleapis.com/geolocation/v1/geolocate?key=${process.env.GEO_API_KEY}`;
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
      name: '',
      country: '',
    };
  }

  async componentWillMount() {
    // const weather = await getWeatherFromApi();
    // this.setState({ icon: weather.icon.slice(0, -1) });
    const location = await getClientGeoLocations();
    const weatherData = await getWeatherFromApiByCoordinates(location.lat, location.long);
    this.setState({
      icon: weatherData.weather.icon.slice(0, -1),
      name: weatherData.name,
      country: weatherData.country,
    });
  }

  render() {
    const { icon, name, country } = this.state;

    return (
      <div className="icon">
        <h1>{`${name}, ${country}`}</h1>
        { icon && <img alt="weather_state" src={`/img/${icon}.svg`} /> }
      </div>
    );
  }
}

ReactDOM.render(
  <Weather />,
  document.getElementById('app')
);
