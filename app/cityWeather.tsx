import React, { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import WeatherLayout from '../components/WeatherLayout';
import LoadingScreen from '../components/LoadingScreen';
import { getWeatherData } from '../services/weatherService';
import { WeatherData } from '../types/weather';

export default function CityWeather() {
  const { city, latitude, longitude } = useLocalSearchParams();
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const data = await getWeatherData(Number(latitude), Number(longitude));
        setWeatherData(data);
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch weather data for the selected city.');
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [latitude, longitude]);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <WeatherLayout
      weatherData={weatherData}
      location={city as string}
    />
  );
}
