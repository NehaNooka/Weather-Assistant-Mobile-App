import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="cityWeather" options={{headerBackTitle:'Back', headerTitle: 'Other'}}  />
    </Stack>
  );
}
