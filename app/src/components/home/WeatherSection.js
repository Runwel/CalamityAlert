import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export function WeatherSection({ weather, isDarkMode }) {
  if (!weather || !weather.location) {
    return <Text style={styles.errorText}>Weather data not available</Text>;
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', { weekday: 'short' });
  };

  return (
    <LinearGradient
      colors={isDarkMode ? ['#0c4a6e', '#0369a1'] : ['#0ea5e9', '#38bdf8']}
      style={styles.weatherSection}
    >
      <Text style={styles.locationText}>
        {weather.location.region}, {weather.location.country}
      </Text>
      
      <View style={styles.mainWeatherContainer}>
        <View style={styles.weatherContainer}>
          <Image
            source={{ uri: `https:${weather.current.condition.icon}` }}
            style={styles.weatherIcon}
          />
          <View style={styles.weatherInfo}>
            <Text style={styles.temperature}>
              {weather.current.temp_c}°C
            </Text>
            <Text style={styles.condition}>
              {weather.current.condition.text}
            </Text>
          </View>
        </View>

        <View style={styles.weatherDetails}>
          <View style={styles.weatherDetail}>
            <Text style={styles.detailLabel}>Humidity</Text>
            <Text style={styles.detailValue}>{weather.current.humidity}%</Text>
          </View>
          <View style={styles.weatherDetail}>
            <Text style={styles.detailLabel}>Wind Speed</Text>
            <Text style={styles.detailValue}>{weather.current.wind_kph} km/h</Text>
          </View>
        </View>
      </View>

      {weather.forecast && (
        <View style={[styles.section, { backgroundColor: isDarkMode ? '#2d2d2d' : '#ffffff' }]}>
          <Text style={[styles.sectionTitle, { color: isDarkMode ? '#ffffff' : '#0f172a' }]}>
            Weather Forecast
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {weather.forecast.forecastday.slice(0, 5).map((day, index) => (
              <LinearGradient
                key={index}
                colors={isDarkMode ? ['#1e293b', '#334155'] : ['#f8fafc', '#f1f5f9']}
                style={styles.forecastCard}
              >
                <Text style={[styles.forecastDay, { color: isDarkMode ? '#e2e8f0' : '#1e293b' }]}>
                  {formatDate(day.date)}
                </Text>
                <Image
                  source={{ uri: `https:${day.day.condition.icon}` }}
                  style={styles.forecastIcon}
                />
                <Text style={[styles.forecastTemperature, { color: isDarkMode ? '#ffffff' : '#0f172a' }]}>
                  {Math.round(day.day.avgtemp_c)}°C
                </Text>
                <Text style={[styles.forecastCondition, { color: isDarkMode ? '#94a3b8' : '#64748b' }]}>
                  {day.day.condition.text}
                </Text>
              </LinearGradient>
            ))}
          </ScrollView>
        </View>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  weatherSection: {
    padding: 10,
    borderRadius: 15,
  },
  locationText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  mainWeatherContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  weatherContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  weatherIcon: {
    width: 100,
    height: 100,
  },
  weatherInfo: {
    marginLeft: 20,
  },
  temperature: {
    color: '#ffffff',
    fontSize: 48,
    fontWeight: 'bold',
  },
  condition: {
    color: '#ffffff',
    fontSize: 18,
  },
  weatherDetails: {
    alignItems: 'flex-end',
  },
  weatherDetail: {
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  detailLabel: {
    color: '#ffffff',
    fontSize: 14,
    opacity: 0.8,
  },
  detailValue: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  errorText: {
    color: '#ffffff',
    fontSize: 16,
    textAlign: 'center',
  },
  section: {
    marginTop: 20,
    borderRadius: 15,
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  forecastCard: {
    padding: 15,
    borderRadius: 12,
    marginRight: 12,
    alignItems: 'center',
    minWidth: 100,
  },
  forecastDay: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  forecastIcon: {
    width: 40,
    height: 40,
    marginVertical: 8,
  },
  forecastTemperature: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  forecastCondition: {
    fontSize: 14,
    textAlign: 'center',
  }
});