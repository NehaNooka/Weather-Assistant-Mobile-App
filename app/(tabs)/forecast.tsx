import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import ForecastItem from '../../components/ForecastItem';
import LoadingScreen from '../../components/LoadingScreen';
import { getWeatherData } from '../../services/weatherService';
import { WeatherData } from '../../types/weather';

export default function ForecastScreen() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchForecast = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          const location = await Location.getCurrentPositionAsync({});
          const { latitude, longitude } = location.coords;
          const data = await getWeatherData(latitude, longitude);
          setWeatherData(data);
        }
      } catch (error) {
        console.error('Error fetching forecast:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchForecast();
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  const today = new Date().toISOString().split('T')[0];

  return (
    <LinearGradient colors={['#F9FAFB', '#F3F4F6']} style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>7-Day Forecast</Text>
          <Text style={styles.subtitle}>Plan your week ahead</Text>
        </View>
        
        {weatherData?.daily.time.map((date, index) => (
          <ForecastItem
            key={date}
            date={date}
            weatherCode={weatherData.daily.weather_code[index]}
            tempMax={weatherData.daily.temperature_2m_max[index]}
            tempMin={weatherData.daily.temperature_2m_min[index]}
            precipitationChance={weatherData.daily.precipitation_probability_max[index]}
            isToday={date === today}
          />
        ))}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#111827',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 5,
  },
});
