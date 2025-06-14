import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { WeatherData } from '../types/weather';
import { getWeatherDescription } from '../services/weatherService';
import GlassCard from './GlassCard';

const { width } = Dimensions.get('window');

interface WeatherCardProps {
  weatherData: WeatherData;
  location: string;
}

export default function WeatherCard({ weatherData, location }: WeatherCardProps) {
  const { current } = weatherData;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="location" size={20} color="white" />
        <Text style={styles.location}>{location}</Text>
      </View>

      <View style={styles.mainWeather}>
        <Text style={styles.temperature}>{Math.round(current.temperature_2m)}°</Text>
        <Text style={styles.description}>{getWeatherDescription(current.weather_code)}</Text>
        <Text style={styles.feelsLike}>Feels like {Math.round(current.apparent_temperature)}°</Text>
      </View>

      <GlassCard style={styles.detailsCard}>
        <View style={styles.detailsGrid}>
          <View style={styles.detailItem}>
            <Ionicons name="water" size={24} color="#403b3b" />
            <Text style={styles.detailValue}>{current.relative_humidity_2m}%</Text>
            <Text style={styles.detailLabel}>Humidity</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="speedometer" size={24} color="#403b3b" />
            <Text style={styles.detailValue}>{Math.round(current.pressure_msl)}</Text>
            <Text style={styles.detailLabel}>Pressure</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="eye" size={24} color="#403b3b" />
            <Text style={styles.detailValue}>{Math.round(current.cloud_cover)}%</Text>
            <Text style={styles.detailLabel}>Cloud Cover</Text>
          </View>
        </View>
      </GlassCard>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: width,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  location: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
    marginLeft: 8,
  },
  mainWeather: {
    alignItems: 'center',
    marginBottom: 20,
  },
  temperature: {
    fontSize: 96,
    fontWeight: '700',
    color: 'white',
  },
  description: {
    fontSize: 24,
    color: 'white',
    marginTop: 10,
    fontWeight: '400',
  },
  feelsLike: {
    fontSize: 16,
    color: 'white',
    marginTop: 5,
    fontWeight: '400',
  },
  detailsCard: {
    padding: 0, // Remove padding to avoid inner box effect
  },
  detailsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
  },
  detailItem: {
    alignItems: 'center',
  },
  detailValue: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#403b3b',
    marginTop: 4,
    fontWeight: '500',
  },
});
