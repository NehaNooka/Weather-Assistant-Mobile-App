import axios from 'axios';
import { WeatherData } from '../types/weather';

const BASE_URL = 'https://api.open-meteo.com/v1/forecast';
const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';

export const getWeatherData = async (latitude: number, longitude: number): Promise<WeatherData> => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        latitude,
        longitude,
        current: [
          'temperature_2m',
          'relative_humidity_2m',
          'apparent_temperature',
          'is_day',
          'precipitation',
          'rain',
          'showers',
          'snowfall',
          'weather_code',
          'cloud_cover',
          'pressure_msl',
          'surface_pressure',
          'wind_speed_10m',
          'wind_direction_10m',
          'wind_gusts_10m'
        ].join(','),
        hourly: ['temperature_2m', 'precipitation_probability', 'weather_code'].join(','),
        daily: [
          'weather_code',
          'temperature_2m_max',
          'temperature_2m_min',
          'sunrise',
          'sunset',
          'precipitation_sum',
          'rain_sum',
          'precipitation_probability_max'
        ].join(','),
        timezone: 'auto',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};

// Get city coordinates using Open-Meteo Geocoding API
export const searchCity = async (cityName: string) => {
  try {
    const response = await axios.get(GEOCODING_URL, {
      params: {
        name: cityName,
        count: 5,
        language: 'en',
        format: 'json'
      }
    });
    
    return response.data.results || [];
  } catch (error) {
    console.error('Error searching city:', error);
    throw error;
  }
};

// Get current weather summary for a city
export const getCityWeatherSummary = async (latitude: number, longitude: number) => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        latitude,
        longitude,
        current: ['temperature_2m', 'weather_code', 'is_day'].join(','),
        timezone: 'auto',
      },
    });
    
    const { current } = response.data;
    return {
      temperature: Math.round(current.temperature_2m),
      weatherCode: current.weather_code,
      isDay: current.is_day
    };
  } catch (error) {
    console.error('Error fetching city weather summary:', error);
    throw error;
  }
};

export const getWeatherDescription = (code: number): string => {
  const weatherCodes: { [key: number]: string } = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Foggy',
    48: 'Depositing rime fog',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Dense drizzle',
    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    71: 'Slight snow fall',
    73: 'Moderate snow fall',
    75: 'Heavy snow fall',
    77: 'Snow grains',
    80: 'Slight rain showers',
    81: 'Moderate rain showers',
    82: 'Violent rain showers',
    85: 'Slight snow showers',
    86: 'Heavy snow showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with slight hail',
    99: 'Thunderstorm with heavy hail',
  };
  return weatherCodes[code] || 'Unknown';
};

export const getWeatherIcon = (code: number, isDay: number): string => {
  if (code === 0 || code === 1) return isDay ? '☀️' : '🌙';
  if (code === 2 || code === 3) return isDay ? '⛅' : '☁️';
  if (code >= 45 && code <= 48) return '🌫️';
  if (code >= 51 && code <= 65) return '🌧️';
  if (code >= 71 && code <= 77) return '❄️';
  if (code >= 80 && code <= 82) return '🌦️';
  if (code >= 85 && code <= 86) return '🌨️';
  if (code >= 95) return '⛈️';
  return '🌤️';
};
