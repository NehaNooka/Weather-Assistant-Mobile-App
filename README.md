# Personal Weather Assistant

[Watch the Demo Video](https://youtube.com/shorts/10GUpMTtgJc?feature=share)

## Project Overview

A modern, feature-rich weather application built with React Native, Typescript and Expo that provides real-time weather updates, intelligent notifications, and beautiful visualizations.

## Core Features

The design follows a clean, modern aesthetic with clear visual hierarchy:

- **Real-time Weather Data** : Current conditions, hourly forecasts, and 7-day predictions
- **Dynamic Backgrounds**: Beautiful weather-appropriate backgrounds that change based on conditions
- **Multi-City Support**: Add and track weather for multiple cities worldwide
- **Smart Notifications**: Intelligent weather alerts for extreme conditions
- **Weather Insights**: Unique weather information not found in typical weather apps

## Advanced Features

- **Glassmorphism UI**: Modern, translucent design elements
- **Weather Animations**: Rain and snow effects overlay
- **Hourly Forecast**: 24-hour temperature and precipitation predictions
- **Detailed Weather Cards**: UV Index, Wind Speed, Humidity, Pressure, and more
- **Location-based Weather**: Automatic weather detection for current location

# Getting Started

## Prerequisites

- Node.js (v14 or newer)
- npm or yarn
- Expo CLI
- iOS Simulator/Android Emulator or physical device

## Installation

- Clone the repository

```bash
git clone https://github.com/NehaNooka/Weather-Assistant-Mobile-App.git
```

- Install dependencies

```bash
npm install
# or
yarn install
```

- Install Expo CLI globally (if not already installed)

```bash
npx expo start
```
- Start the development server

```bash
npx expo start
```

- Run on simulator/emulator or scan the QR code with the Expo Go app on your device

## Project Structure

```javascript
WeatherAssistant/
|__screenshots             # App Screenshots
|
├── app/                   # Expo Router navigation
│   ├── (tabs)/            # Tab navigation screens
│   │   ├── index.tsx      # Home/Current Weather
│   │   ├── forecast.tsx   # 7-day forecast
│   │   └── settings.tsx   # App settings
│   ├── cityWeather.tsx    # City detail page
│   └── _layout.tsx        # Root layout
├── components/            # Reusable components
│   ├── CitySearchModal.tsx
│   ├── ForecastCard.tsx
│   ├── ForecastItem.tsx
│   ├── GlassCard.tsx
│   ├── HourlyForecast.tsx
│   ├── LoadingScreen.tsx
│   ├── WeatherCard.tsx
│   ├── WeatherInsights.tsx
│   └── WeatherLayout.tsx
├── services/              # API and services
│   ├── weatherService.ts
│   └── notificationService.ts
├── types/                 # TypeScript definitions
├── constants/             # App constants
└── assets/               # Images and resources

```

## Technologies Used

- **React Native**: Mobile app framework
- **Expo**: Development platform and tools
- **TypeScript**: Type-safe JavaScript
- **Expo Router**: File-based navigation
- **Open-Meteo API**: Free weather data API
- **Expo Notifications**: Push notification support
- **Expo Location**: GPS location services

## Contributing

#### Contributions are welcome! Please feel free to submit a Pull Request.

- Fork the project
- Create your feature branch (git checkout -b feature/AmazingFeature)
- Commit your changes (git commit -m 'Add some AmazingFeature')
- Push to the branch (git push origin feature/AmazingFeature)
- Open a Pull Request

## Acknowledgments

- Weather data provided by Open-Meteo
- Icons from Expo Vector Icons
- UI inspiration from modern weather applications

## Made with ❤️ by Neha Nooka
