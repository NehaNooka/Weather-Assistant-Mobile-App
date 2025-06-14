import React from 'react';
import { 
  ScrollView, 
  StyleSheet, 
  View, 
  Text, 
  ImageBackground, 
  RefreshControl,
  Dimensions 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import WeatherCard from './WeatherCard';
import HourlyForecast from './HourlyForecast';
import WeatherInsights from './WeatherInsights';
import ForecastCard from './ForecastCard';
import { WeatherData } from '../types/weather';

const { width, height } = Dimensions.get('window');

interface WeatherLayoutProps {
  weatherData: WeatherData | null;
  location: string;
  refreshing?: boolean;
  onRefresh?: () => void;
  children?: React.ReactNode;
}

// Make sure this is a default export
export default function WeatherLayout({ 
  weatherData, 
  location, 
  refreshing = false, 
  onRefresh,
  children 
}: WeatherLayoutProps) {
  
  if (!weatherData) return null;

  const getBackgroundImage = () => {
    if (!weatherData) return require('../assets/sunny_day.jpg');
    
    const weatherCode = weatherData.current.weather_code;
    const isDay = weatherData.current.is_day === 1;
    
    if (weatherCode === 0 || weatherCode === 1) {
      return isDay 
        ? require('../assets/sunny_day.jpg')
        : require('../assets/dark_night.jpg');
    } else if (weatherCode >= 51 && weatherCode <= 65) {
      return require('../assets/rainy_day.jpg');
    } else if (weatherCode >= 71 && weatherCode <= 77) {
      return require('../assets/snowy_day.jpg');
    } else if (weatherCode >= 2 && weatherCode <= 3) {
      return require('../assets/cloudy_day.jpg');
    }
    
    return require('../assets/dark_night.jpg');
  };

  return (
    <ImageBackground 
      source={getBackgroundImage()} 
      style={styles.container}
      resizeMode="cover"
    >
      <LinearGradient
        colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.5)']}
        style={StyleSheet.absoluteFillObject}
      />
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          onRefresh ? (
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh}
              tintColor="white"
            />
          ) : undefined
        }
      >
        <WeatherCard 
          weatherData={weatherData} 
          location={location} 
        />
        
        {/* Hourly Forecast Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hourly Forecast</Text>
          <HourlyForecast weatherData={weatherData} />
        </View>
        
        {/* Forecast Cards Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Weather Details</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.forecastScroll}
          >
            <ForecastCard
              title="UV Index"
              value={weatherData.current.is_day ? "High" : "Low"}
              icon="sunny"
              color="#FF6B6B"
            />
            <ForecastCard
              title="Wind"
              value={`${Math.round(weatherData.current.wind_speed_10m)} km/h`}
              icon="flag"
              color="#4ECDC4"
            />
            <ForecastCard
              title="Humidity"
              value={`${weatherData.current.relative_humidity_2m}%`}
              icon="water"
              color="#45B7D1"
            />
            <ForecastCard
              title="Pressure"
              value={`${Math.round(weatherData.current.pressure_msl)} hPa`}
              icon="speedometer"
              color="#96CEB4"
            />
            <ForecastCard
              title="Cloud Cover"
              value={`${Math.round(weatherData.current.cloud_cover)}%`}
              icon="cloud"
              color="#B19CD9"
            />
            <ForecastCard
              title="Feels Like"
              value={`${Math.round(weatherData.current.apparent_temperature)}°`}
              icon="thermometer"
              color="#FFB6C1"
            />
          </ScrollView>
        </View>

        {/* Weather Insights Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Weather Insights</Text>
          <WeatherInsights weatherData={weatherData} />
        </View>

        {/* Additional content (like cities list) */}
        {children}
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#87CEEB', // Sky blue background as fallback
  },
  section: {
    marginTop: 30,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 15,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  forecastScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
});
