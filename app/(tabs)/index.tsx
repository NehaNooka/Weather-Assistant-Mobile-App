import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import WeatherLayout from '../../components/WeatherLayout';
import CitySearchModal from '../../components/CitySearchModal';
import LoadingScreen from '../../components/LoadingScreen';
import { getWeatherData, getCityWeatherSummary } from '../../services/weatherService';
import { scheduleWeatherNotification } from '../../services/notificationService';
import { WeatherData, Location as LocationType } from '../../types/weather';

interface City {
  id: string;
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  temperature?: number;
  weatherCode?: number;
  isDay?: number;
}

export default function HomeScreen() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [location, setLocation] = useState<LocationType | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [cities, setCities] = useState<City[]>([]);
  const [showCitySearch, setShowCitySearch] = useState(false);
  const router = useRouter();

  const fetchLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Allow location access to get weather data');
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = currentLocation.coords;
      
      const reverseGeocode = await Location.reverseGeocodeAsync({ latitude, longitude });
      const city = reverseGeocode[0]?.city || reverseGeocode[0]?.district || 'Unknown Location';
      
      setLocation({ latitude, longitude, city });
      return { latitude, longitude };
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('Error', 'Failed to get location');
    }
  };

  const fetchWeather = async () => {
    try {
      const coords = await fetchLocation();
      if (coords) {
        const data = await getWeatherData(coords.latitude, coords.longitude);
        setWeatherData(data);
        await scheduleWeatherNotification(data);
      }
    } catch (error) {
      console.error('Error fetching weather:', error);
      Alert.alert('Error', 'Failed to fetch weather data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchCitiesWeather = async () => {
    const updatedCities = await Promise.all(
      cities.map(async (city) => {
        try {
          const summary = await getCityWeatherSummary(city.latitude, city.longitude);
          return {
            ...city,
            temperature: summary.temperature,
            weatherCode: summary.weatherCode,
            isDay: summary.isDay,
          };
        } catch (error) {
          console.error(`Error fetching weather for ${city.name}:`, error);
          return city;
        }
      })
    );
    setCities(updatedCities);
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  useEffect(() => {
    if (cities.length > 0) {
      fetchCitiesWeather();
    }
  }, [cities.length]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchWeather();
    await fetchCitiesWeather();
  };

  const handleAddCity = (city: { name: string; latitude: number; longitude: number; country: string }) => {
    const newCity: City = {
      id: `${city.latitude}-${city.longitude}`,
      name: city.name,
      country: city.country,
      latitude: city.latitude,
      longitude: city.longitude,
    };
    setCities([...cities, newCity]);
  };

  const removeCity = (cityId: string) => {
    setCities(cities.filter(city => city.id !== cityId));
  };

  const viewCityWeather = (city: City) => {
    router.push({
      pathname: '/cityWeather',
      params: { 
        city: city.name, 
        latitude: city.latitude, 
        longitude: city.longitude 
      },
    });
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <WeatherLayout
        weatherData={weatherData}
        location={location?.city || 'Current Location'}
        refreshing={refreshing}
        onRefresh={onRefresh}
      >
        {/* Cities Section */}
        <View style={styles.citiesSection}>
          <View style={styles.citiesHeader}>
            <Text style={styles.sectionTitle}>Other Cities</Text>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => setShowCitySearch(true)}
            >
              <Ionicons name="add-circle" size={24} color="white" />
            </TouchableOpacity>
          </View>
          
          {cities.map((city) => (
            <TouchableOpacity
              key={city.id}
              style={styles.cityCard}
              onPress={() => viewCityWeather(city)}
            >
              <View style={styles.cityInfo}>
                <Text style={styles.cityName}>{city.name}</Text>
                <Text style={styles.cityCountry}>{city.country}</Text>
              </View>
              {city.temperature !== undefined && (
                <Text style={styles.cityTemp}>{city.temperature}°</Text>
              )}
              <TouchableOpacity 
                onPress={() => removeCity(city.id)}
                style={styles.removeButton}
              >
                <Ionicons name="close-circle" size={20} color="rgba(255,255,255,0.6)" />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>
      </WeatherLayout>

      <CitySearchModal
        visible={showCitySearch}
        onClose={() => setShowCitySearch(false)}
        onSelectCity={handleAddCity}
      />
    </>
  );
}

const styles = StyleSheet.create({
  citiesSection: {
    marginTop: 30,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  citiesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  addButton: {
    padding: 5,
  },
  cityCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  cityInfo: {
    flex: 1,
  },
  cityName: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  cityCountry: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  cityTemp: {
    fontSize: 32,
    fontWeight: '300',
    color: 'white',
    marginRight: 10,
  },
  removeButton: {
    padding: 5,
  },
});
