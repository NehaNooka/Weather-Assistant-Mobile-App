import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { WeatherData } from '../types/weather';
import { getWeatherIcon } from '../services/weatherService';
import GlassCard from './GlassCard';

interface HourlyForecastProps {
  weatherData: WeatherData;
}

export default function HourlyForecast({ weatherData }: HourlyForecastProps) {
  const { hourly } = weatherData;
  
  const getHourLabel = (timeString: string) => {
    const date = new Date(timeString);
    const hour = date.getHours();
    return hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`;
  };

  return (
<GlassCard style={{ marginHorizontal: 20, marginBottom: 20 }}>
      <View style={styles.header}>
        <Ionicons name="time" size={20} color="#667EEA" />
        <Text style={styles.title}>Hourly Forecast</Text>
      </View>
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollView}>
        {hourly.time.slice(0, 24).map((time, index) => (
          <View key={time} style={styles.hourItem}>
            <Text style={styles.hourLabel}>{getHourLabel(time)}</Text>
            <Text style={styles.weatherIcon}>
              {getWeatherIcon(hourly.weather_code[index], 1)}
            </Text>
            <Text style={styles.temperature}>{Math.round(hourly.temperature_2m[index])}°</Text>
            {hourly.precipitation_probability[index] > 0 && (
              <View style={styles.precipitationContainer}>
                <Ionicons name="water" size={12} color="#4299E1" />
                <Text style={styles.precipitation}>{hourly.precipitation_probability[index]}%</Text>
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 20,
    padding: 0,
    paddingTop: 15,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    marginLeft: 18,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
    marginLeft: 8,
  },
  scrollView: {
    marginHorizontal: -10,
  },
  hourItem: {
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  hourLabel: {
    fontSize: 12,
    color: '#403b3b',
    marginBottom: 8,
    fontWeight: '500',
  },
  weatherIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  temperature: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
  },
  precipitationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  precipitation: {
    fontSize: 11,
    color: '#4299E1',
    marginLeft: 2,
  },
});
