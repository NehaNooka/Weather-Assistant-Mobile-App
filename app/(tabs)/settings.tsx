import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { scheduleDailyWeatherNotification, testWeatherAlerts, testSpecificNotification } from '../../services/notificationService';
import * as Location from 'expo-location';
import { getWeatherData } from '../../services/weatherService';

export default function SettingsScreen() {
  const [dailyNotifications, setDailyNotifications] = useState(true);
  const [severeWeatherAlerts, setSevereWeatherAlerts] = useState(true);
  const [temperatureUnit, setTemperatureUnit] = useState('celsius');

  const handleDailyNotificationToggle = async (value: boolean) => {
    setDailyNotifications(value);
    if (value) {
      try {
        const location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;
        const weatherData = await getWeatherData(latitude, longitude);
        await scheduleDailyWeatherNotification(weatherData);
        Alert.alert('Success', 'Daily notifications enabled at 7:00 AM');
      } catch (error) {
        Alert.alert('Error', 'Failed to enable notifications');
      }
    }
  };

  const handleTestNotification = async () => {
    await testWeatherAlerts();
  };

  const handleSpecificNotification = async (type: string) => {
    await testSpecificNotification(type);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>Notifications</Text>
      
      <View style={styles.settingItem}>
        <View style={styles.settingTextContainer}>
          <Text style={styles.settingLabel}>Daily Weather Summary</Text>
          <Text style={styles.settingDescription}>
            Get weather updates every morning at 7 AM
          </Text>
        </View>
        <Switch
          value={dailyNotifications}
          onValueChange={handleDailyNotificationToggle}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={dailyNotifications ? '#2f95dc' : '#f4f3f4'}
        />
      </View>

      <View style={styles.settingItem}>
        <View style={styles.settingTextContainer}>
          <Text style={styles.settingLabel}>Severe Weather Alerts</Text>
          <Text style={styles.settingDescription}>
            Notifications for extreme weather conditions
          </Text>
        </View>
        <Switch
          value={severeWeatherAlerts}
          onValueChange={setSevereWeatherAlerts}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={severeWeatherAlerts ? '#2f95dc' : '#f4f3f4'}
        />
      </View>

      <Text style={styles.sectionTitle}>Test Notifications</Text>
      
      <TouchableOpacity 
        style={styles.testButton}
        onPress={handleTestNotification}
      >
        <Ionicons name="notifications" size={20} color="white" />
        <Text style={styles.testButtonText}>Test Random Alert</Text>
      </TouchableOpacity>

      <View style={styles.testGrid}>
        <TouchableOpacity 
          style={[styles.testGridButton, { backgroundColor: '#FF6B6B' }]}
          onPress={() => handleSpecificNotification('heat')}
        >
          <Text style={styles.testGridIcon}>🔥</Text>
          <Text style={styles.testGridText}>Heat</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.testGridButton, { backgroundColor: '#45B7D1' }]}
          onPress={() => handleSpecificNotification('cold')}
        >
          <Text style={styles.testGridIcon}>❄️</Text>
          <Text style={styles.testGridText}>Cold</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.testGridButton, { backgroundColor: '#4ECDC4' }]}
          onPress={() => handleSpecificNotification('rain')}
        >
          <Text style={styles.testGridIcon}>☔</Text>
          <Text style={styles.testGridText}>Rain</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.testGridButton, { backgroundColor: '#96CEB4' }]}
          onPress={() => handleSpecificNotification('wind')}
        >
          <Text style={styles.testGridIcon}>💨</Text>
          <Text style={styles.testGridText}>Wind</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.testGridButton, { backgroundColor: '#FFB6C1' }]}
          onPress={() => handleSpecificNotification('uv')}
        >
          <Text style={styles.testGridIcon}>☀️</Text>
          <Text style={styles.testGridText}>UV</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.testGridButton, { backgroundColor: '#9B59B6' }]}
          onPress={() => handleSpecificNotification('storm')}
        >
          <Text style={styles.testGridIcon}>⛈️</Text>
          <Text style={styles.testGridText}>Storm</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Units</Text>
      
      <TouchableOpacity 
        style={styles.unitButton}
        onPress={() => setTemperatureUnit(temperatureUnit === 'celsius' ? 'fahrenheit' : 'celsius')}
      >
        <Text style={styles.settingLabel}>Temperature Unit</Text>
        <Text style={styles.unitValue}>
          {temperatureUnit === 'celsius' ? '°C' : '°F'}
        </Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>About</Text>
      
      <View style={styles.aboutSection}>
        <Text style={styles.aboutText}>Weather Assistant v1.0</Text>
        <Text style={styles.aboutDescription}>
          Your personal weather companion with real-time updates and intelligent notifications
        </Text>
        <Text style={styles.aboutDescription}>
          Powered by Open-Meteo API
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 15,
    color: '#333',
  },
  settingItem: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  settingTextContainer: {
    flex: 1,
    marginRight: 10,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  settingDescription: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  testButton: {
    backgroundColor: '#2f95dc',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  testButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  testGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  testGridButton: {
    width: '30%',
    aspectRatio: 1,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  testGridIcon: {
    fontSize: 30,
    marginBottom: 5,
  },
  testGridText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  unitButton: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  unitValue: {
    fontSize: 16,
    color: '#2f95dc',
    fontWeight: '600',
  },
  aboutSection: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 30,
  },
  aboutText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  aboutDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 5,
  },
});
