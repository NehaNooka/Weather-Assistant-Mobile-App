import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform, Alert } from 'react-native';
import { WeatherData } from '../types/weather';
import { getWeatherDescription } from './weatherService';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: Platform.OS === 'ios',
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// Function to show alert for testing on simulator
function showTestAlert(title: string, body: string) {
  Alert.alert(
    title,
    body,
    [
      { text: 'OK', onPress: () => console.log('Alert dismissed') }
    ],
    { cancelable: true }
  );
}

// Android-specific notification channel configuration
async function createNotificationChannels() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('weather-alerts', {
      name: 'Weather Alerts',
      description: 'Important weather notifications and alerts',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
      sound: 'default',
    });

    await Notifications.setNotificationChannelAsync('daily-summary', {
      name: 'Daily Weather Summary',
      description: 'Daily weather updates and forecasts',
      importance: Notifications.AndroidImportance.DEFAULT,
      sound: 'default',
    });

    await Notifications.setNotificationChannelAsync('severe-weather', {
      name: 'Severe Weather Warnings',
      description: 'Critical weather warnings requiring immediate attention',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 500, 250, 500],
      lightColor: '#FF0000',
      sound: 'default',
      bypassDnd: true,
    });
  }
}

export async function registerForPushNotificationsAsync() {
  let token;

  await createNotificationChannels();

  if (Device.isDevice || Platform.OS === 'ios') {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      Alert.alert('Permission Required', 'Please enable notifications to receive weather alerts');
      return;
    }
    
    try {
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log('Push notification token:', token);
    } catch (error) {
      console.log('Error getting push token:', error);
    }
  }

  return token;
}

export async function scheduleWeatherNotification(weatherData: WeatherData) {
  const { current, daily } = weatherData;
  
  let notificationBody = '';
  let notificationTitle = 'Weather Alert 🌤️';
  let channelId = 'weather-alerts';
  let priority = Notifications.AndroidNotificationPriority.DEFAULT;
  
  // Extreme temperature alert
  if (current.temperature_2m > 35) {
    notificationBody = `🔥 Extreme heat alert! Current temperature: ${Math.round(current.temperature_2m)}°C. Stay hydrated!`;
    notificationTitle = 'Extreme Heat Warning 🔥';
    channelId = 'severe-weather';
    priority = Notifications.AndroidNotificationPriority.HIGH;
  } else if (current.temperature_2m < 0) {
    notificationBody = `❄️ Freezing conditions! Current temperature: ${Math.round(current.temperature_2m)}°C. Bundle up!`;
    notificationTitle = 'Freezing Weather Alert ❄️';
    channelId = 'severe-weather';
    priority = Notifications.AndroidNotificationPriority.HIGH;
  }
  
  // High wind alert
  if (current.wind_speed_10m > 50) {
    notificationBody = `💨 High wind warning! Wind speed: ${Math.round(current.wind_speed_10m)} km/h. Be cautious outdoors!`;
    notificationTitle = 'High Wind Warning 💨';
    channelId = 'severe-weather';
    priority = Notifications.AndroidNotificationPriority.HIGH;
  }
  
  // Precipitation alert
  if (current.precipitation > 10) {
    notificationBody = `☔ Heavy precipitation detected! ${Math.round(current.precipitation)}mm expected. Don't forget your umbrella!`;
    notificationTitle = 'Heavy Rain Alert ☔';
    channelId = 'weather-alerts';
  }
  
  // UV index alert
  if (current.weather_code === 0 && current.is_day === 1 && current.temperature_2m > 25) {
    notificationBody = `☀️ High UV levels expected today! Remember to wear sunscreen!`;
    notificationTitle = 'UV Protection Reminder ☀️';
    channelId = 'weather-alerts';
  }
  
  // Sudden weather change alert
  const tomorrowWeatherCode = daily.weather_code[1];
  const todayWeatherCode = daily.weather_code[0];
  if (Math.abs(tomorrowWeatherCode - todayWeatherCode) > 20) {
    notificationBody = `🌦️ Weather change alert! Tomorrow: ${getWeatherDescription(tomorrowWeatherCode)}`;
    notificationTitle = 'Weather Change Alert 🌦️';
    channelId = 'weather-alerts';
  }
  
  if (notificationBody) {

    // Schedule actual notification
    const notificationContent: Notifications.NotificationContentInput = {
      title: notificationTitle,
      body: notificationBody,
      data: { weatherData },
      sound: 'default',
    };

    if (Platform.OS === 'android') {
      notificationContent.priority = priority;
      notificationContent.vibrate = [0, 250, 250, 250];
      notificationContent.color = '#2f95dc';
    }

    if (Platform.OS === 'ios') {
      notificationContent.badge = 1;
    }

    await Notifications.scheduleNotificationAsync({
      content: notificationContent,
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 2,
        channelId: Platform.OS === 'android' ? channelId : undefined,
      },
    });
  }
}

export async function scheduleDailyWeatherNotification(weatherData: WeatherData) {
  const { current, daily } = weatherData;
  const todayMax = Math.round(daily.temperature_2m_max[0]);
  const todayMin = Math.round(daily.temperature_2m_min[0]);
  const todayPrecipChance = Math.round(daily.precipitation_probability_max[0]);
  
  const notificationBody = `Today: ${getWeatherDescription(daily.weather_code[0])}. High: ${todayMax}°C, Low: ${todayMin}°C. ${todayPrecipChance}% chance of rain.`;
  
  // Show alert immediately for testing
  showTestAlert('Good Morning! ☀️', notificationBody);
  
  // Cancel existing notifications
  await Notifications.cancelAllScheduledNotificationsAsync();
  
  // Schedule for tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(7, 0, 0, 0);
  
  const notificationContent: Notifications.NotificationContentInput = {
    title: 'Good Morning! ☀️',
    body: notificationBody,
    data: { weatherData },
    sound: 'default',
  };

  if (Platform.OS === 'android') {
    notificationContent.priority = Notifications.AndroidNotificationPriority.DEFAULT;
    notificationContent.color = '#2f95dc';
  }

  if (Platform.OS === 'ios') {
    notificationContent.badge = 1;
  }

  await Notifications.scheduleNotificationAsync({
    content: notificationContent,
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: tomorrow,
      channelId: Platform.OS === 'android' ? 'daily-summary' : undefined,
    },
  });
}

// Test function to simulate various weather alerts
export async function testWeatherAlerts() {
  const testScenarios = [
    {
      title: 'Extreme Heat Warning 🔥',
      body: '🔥 Extreme heat alert! Current temperature: 38°C. Stay hydrated!',
    },
    {
      title: 'Freezing Weather Alert ❄️',
      body: '❄️ Freezing conditions! Current temperature: -5°C. Bundle up!',
    },
    {
      title: 'High Wind Warning 💨',
      body: '💨 High wind warning! Wind speed: 65 km/h. Be cautious outdoors!',
    },
    {
      title: 'Heavy Rain Alert ☔',
      body: '☔ Heavy precipitation detected! 25mm expected. Don\'t forget your umbrella!',
    },
    {
      title: 'UV Protection Reminder ☀️',
      body: '☀️ High UV levels expected today! Remember to wear sunscreen!',
    },
  ];

  // Show a random test alert
  const randomScenario = testScenarios[Math.floor(Math.random() * testScenarios.length)];
  showTestAlert(randomScenario.title, randomScenario.body);
  
  // Also schedule a real notification
  await Notifications.scheduleNotificationAsync({
    content: {
      title: randomScenario.title,
      body: randomScenario.body,
      sound: 'default',
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 1,
    },
  });
}

// Test specific notification type
export async function testSpecificNotification(type: string) {
  const notifications = {
    heat: {
      title: 'Extreme Heat Warning 🔥',
      body: '🔥 Temperature reaching 38°C! Stay indoors and hydrate frequently.',
      channelId: 'severe-weather',
    },
    cold: {
      title: 'Freezing Alert ❄️',
      body: '❄️ Temperature dropping to -5°C! Wear warm clothing and limit outdoor exposure.',
      channelId: 'severe-weather',
    },
    rain: {
      title: 'Heavy Rain Warning ☔',
      body: '☔ 25mm of rain expected in the next hour! Carry an umbrella and drive carefully.',
      channelId: 'weather-alerts',
    },
    wind: {
      title: 'High Wind Alert 💨',
      body: '💨 Wind speeds up to 65 km/h! Secure loose objects and avoid outdoor activities.',
      channelId: 'severe-weather',
    },
    uv: {
      title: 'UV Index Alert ☀️',
      body: '☀️ Very high UV levels today! Apply SPF 30+ sunscreen and wear protective clothing.',
      channelId: 'weather-alerts',
    },
    storm: {
      title: 'Thunderstorm Warning ⛈️',
      body: '⛈️ Severe thunderstorm approaching! Seek shelter immediately and stay away from windows.',
      channelId: 'severe-weather',
    },
  };

  const notification = notifications[type as keyof typeof notifications];
  if (notification) {
    // Show alert
    showTestAlert(notification.title, notification.body);
    
    // Schedule actual notification
    await Notifications.scheduleNotificationAsync({
      content: {
        title: notification.title,
        body: notification.body,
        sound: 'default',
        data: { type },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 1,
        channelId: Platform.OS === 'android' ? notification.channelId : undefined,
      },
    });
  }
}

// Function to get unique weather insights
export function getUniqueWeatherInsights(weatherData: WeatherData): string[] {
  const insights: string[] = [];
  const { current, daily } = weatherData;
  
  // Pressure changes
  if (current.pressure_msl < 1000) {
    insights.push('🌪️ Low pressure system detected - stormy weather possible!');
  } else if (current.pressure_msl > 1025) {
    insights.push('☀️ High pressure system - expect clear and stable weather!');
  }
  
  // Humidity insights
  if (current.relative_humidity_2m > 80) {
    insights.push('💧 High humidity levels - it might feel muggy today!');
  } else if (current.relative_humidity_2m < 30) {
    insights.push('🏜️ Very dry conditions - stay hydrated and moisturize!');
  }
  
  // Wind chill or heat index
  const tempDiff = Math.abs(current.temperature_2m - current.apparent_temperature);
  if (tempDiff > 5) {
    if (current.apparent_temperature < current.temperature_2m) {
      insights.push(`🥶 Wind chill effect: Feels ${Math.round(tempDiff)}°C colder than actual temperature!`);
    } else {
      insights.push(`🥵 Heat index: Feels ${Math.round(tempDiff)}°C warmer than actual temperature!`);
    }
  }
  
  // Sunrise/sunset times
  const sunrise = new Date(daily.sunrise[0]);
  const sunset = new Date(daily.sunset[0]);
  const dayLength = (sunset.getTime() - sunrise.getTime()) / (1000 * 60 * 60);
  insights.push(`🌅 Day length: ${dayLength.toFixed(1)} hours (Sunrise: ${sunrise.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}, Sunset: ${sunset.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })})`);
  
  return insights;
}

// Setup notification listeners
export function setupNotificationListeners() {
  const notificationListener = Notifications.addNotificationReceivedListener(notification => {
    console.log('Notification received:', notification);
    // Show alert when notification is received in foreground
    const { title, body } = notification.request.content;
    if (title && body) {
      showTestAlert(title, body);
    }
  });

  const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
    console.log('User interacted with notification:', response);
  });

  return () => {
    Notifications.removeNotificationSubscription(notificationListener);
    Notifications.removeNotificationSubscription(responseListener);
  };
}
