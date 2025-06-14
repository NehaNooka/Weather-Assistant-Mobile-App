import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { getWeatherIcon, getWeatherDescription } from '../services/weatherService';

interface ForecastItemProps {
  date: string;
  weatherCode: number;
  tempMax: number;
  tempMin: number;
  precipitationChance: number;
  isToday?: boolean;
}

export default function ForecastItem({ 
  date, 
  weatherCode, 
  tempMax, 
  tempMin, 
  precipitationChance,
  isToday = false
}: ForecastItemProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return {
      day: days[date.getDay()],
      date: `${months[date.getMonth()]} ${date.getDate()}`
    };
  };

  const { day, date: dateStr } = formatDate(date);

  return (
    <LinearGradient
      colors={isToday ? ['#4B5563', '#374151'] : ['#FFFFFF', '#F9FAFB']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
    >
      <View style={styles.dateSection}>
        <Text style={[styles.day, isToday && styles.todayText]}>{isToday ? 'Today' : day}</Text>
        <Text style={[styles.date, isToday && styles.todayText]}>{dateStr}</Text>
      </View>
      
      <View style={styles.weatherSection}>
        <Text style={styles.icon}>{getWeatherIcon(weatherCode, 1)}</Text>
        <Text style={[styles.description, isToday && styles.todayText]} numberOfLines={1}>
          {getWeatherDescription(weatherCode)}
        </Text>
      </View>
      
      <View style={styles.tempSection}>
        <View style={styles.tempContainer}>
          <Ionicons 
            name="arrow-up" 
            size={16} 
            color={isToday ? 'rgba(255,255,255,0.8)' : '#6B7280'} 
          />
          <Text style={[styles.tempMax, isToday && styles.todayText]}>{Math.round(tempMax)}°</Text>
        </View>
        <View style={styles.tempContainer}>
          <Ionicons 
            name="arrow-down" 
            size={16} 
            color={isToday ? 'rgba(255,255,255,0.8)' : '#9CA3AF'} 
          />
          <Text style={[styles.tempMin, isToday && styles.todayText]}>{Math.round(tempMin)}°</Text>
        </View>
      </View>
      
      {precipitationChance > 0 && (
        <View style={styles.precipitationContainer}>
          <Ionicons 
            name="water" 
            size={16} 
            color={isToday ? 'rgba(255,255,255,0.8)' : '#60A5FA'} 
          />
          <Text style={[styles.precipitation, isToday && styles.todayText]}>
            {precipitationChance}%
          </Text>
        </View>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginVertical: 8,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  dateSection: {
    flex: 1.5,
  },
  day: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  date: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  weatherSection: {
    flex: 2,
    alignItems: 'center',
  },
  icon: {
    fontSize: 32,
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    color: '#4B5563',
    textAlign: 'center',
  },
  tempSection: {
    flex: 1,
    alignItems: 'flex-end',
  },
  tempContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  tempMax: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 4,
  },
  tempMin: {
    fontSize: 18,
    fontWeight: '400',
    color: '#6B7280',
    marginLeft: 4,
  },
  precipitationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 15,
  },
  precipitation: {
    fontSize: 14,
    color: '#60A5FA',
    marginLeft: 4,
    fontWeight: '500',
  },
  todayText: {
    color: 'white',
  },
});
