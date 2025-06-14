import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

interface ForecastCardProps {
  title: string;
  value: string;
  icon: string;
  color: string;
}

export default function ForecastCard({ title, value, icon, color }: ForecastCardProps) {
  return (
    <View style={styles.container}>
      <BlurView intensity={80} style={styles.blurView} tint="light">
        <View style={[styles.content, { backgroundColor: `${color}20` }]}>
          <View style={[styles.iconContainer, { backgroundColor: `${color}40` }]}>
            <Ionicons name={icon as any} size={24} color={color} />
          </View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.value}>{value}</Text>
        </View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 120,
    height: 120,
    marginRight: 15,
    borderRadius: 20,
    overflow: 'hidden',
  },
  blurView: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 15,
    justifyContent: 'space-between',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 8,
  },
  value: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
});
