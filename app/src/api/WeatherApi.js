import axios from 'axios';

const API_KEY = 'ea9bfbcd2d9846d5990191337240611';  // Use your actual API key
const BASE_URL = 'http://api.weatherapi.com/v1';

const WeatherApi = {
  // Function to fetch current weather
  getCurrentWeather: async (location = 'Manila') => {
    try {
      const response = await axios.get(`${BASE_URL}/current.json`, {
        params: {
          key: API_KEY,
          q: location,
        },
      });
      return response.data;
    } catch (error) {
      console.error(error);
      return null;
    }
  },

  // Function to fetch the 5-day weather forecast
  getForecast: async (location = 'Manila') => {
    try {
      const response = await axios.get(`${BASE_URL}/forecast.json`, {
        params: {
          key: API_KEY,
          q: location,
          days: 5,  // Number of days to forecast
        },
      });
      return response.data.forecast.forecastday;  // Extract forecast days
    } catch (error) {
      console.error(error);
      return null;
    }
  },
};

export default WeatherApi;
