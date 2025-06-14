import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getUniqueWeatherInsights } from '../services/notificationService';
import { WeatherData } from '../types/weather';
import GlassCard from './GlassCard';

interface WeatherInsightsProps {
  weatherData: WeatherData;
}

export default function WeatherInsights({ weatherData }: WeatherInsightsProps) {
  const insights = getUniqueWeatherInsights(weatherData);
  
  const getInsightIcon = (insight: string) => {
    if (insight.includes('pressure')) return 'speedometer';
    if (insight.includes('humidity')) return 'water';
    if (insight.includes('Wind chill') || insight.includes('Heat index')) return 'thermometer';
    if (insight.includes('Day length')) return 'sunny';
    return 'information-circle';
  };

  const getInsightColor = (insight: string) => {
    if (insight.includes('Low pressure') || insight.includes('Heat index')) return '#E53E3E';
    if (insight.includes('High pressure') || insight.includes('Wind chill')) return '#3182CE';
    if (insight.includes('humidity')) return '#38B2AC';
    return '#805AD5';
  };

  return (
<GlassCard style={{ marginHorizontal: 20, marginBottom: 20 }}>
      <View style={styles.header}>
        <Ionicons name="bulb" size={20} color="#805AD5" />
        <Text style={styles.title}>Weather Insights</Text>
      </View>
      
      {insights.map((insight, index) => (
        <View key={index} style={styles.insightItem}>
          <Ionicons 
            name={getInsightIcon(insight) as any} 
            size={24} 
            color={getInsightColor(insight)} 
          />
          <Text style={styles.insightText}>{insight}</Text>
        </View>
      ))}
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 20,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1c1a1a',
    marginLeft: 8,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  insightText: {
    flex: 1,
    fontSize: 14,
    color: '#1c1a1a',
    marginLeft: 12,
    lineHeight: 20,
  },
});
