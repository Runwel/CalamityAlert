import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { responsive } from '../../utils/responsive';

export function WeatherSection({ weather, isDarkMode }) {
  if (!weather || !weather.location) {
    return <Text style={styles.errorText}>Weather data not available</Text>;
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', { weekday: 'short' });
  };

  return (
    <LinearGradient
      colors={isDarkMode ? ['#1e293b', '#0f172a'] : ['#0ea5e9', '#38bdf8']}
      style={styles.weatherSection}
    >
      <View style={styles.glassEffect}>
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
          <View style={styles.forecastContainer}>
            <Text style={styles.sectionTitle}>
              3 Days Weather Forecast
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {weather.forecast.forecastday.slice(0, 5).map((day, index) => (
                <LinearGradient
                  key={index}
                  colors={isDarkMode ? ['rgba(30, 41, 59, 0.8)', 'rgba(15, 23, 42, 0.8)'] : ['rgba(255, 255, 255, 0.9)', 'rgba(241, 245, 249, 0.9)']}
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
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  weatherSection: {
    borderRadius: responsive.scale(20),
    margin: responsive.scale(10),
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  glassEffect: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    padding: responsive.scale(15),
  },
  locationText: {
    padding: responsive.scale(20),
    color: '#ffffff',
    fontSize: responsive.scale(24),
    fontWeight: 'bold',
    textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
  },
  mainWeatherContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: responsive.scale(15),
    marginTop: responsive.scale(-10),
  },
  weatherContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  weatherIcon: {
    width: responsive.scale(80),
    height: responsive.scale(80),
  },
  weatherInfo: {
    marginLeft: responsive.scale(15),
  },
  temperature: {
    color: '#ffffff',
    fontSize: responsive.scale(42),
    fontWeight: 'bold',
    textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
  },
  condition: {
    color: '#ffffff',
    fontSize: responsive.scale(16),
  },
  weatherDetails: {
    alignItems: 'flex-end',
    flex: 1,
  },
  weatherDetail: {
    alignItems: 'flex-end',
    marginBottom: responsive.scale(8),
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: responsive.scale(8),
    borderRadius: responsive.scale(10),
  },
  detailLabel: {
    color: '#ffffff',
    fontSize: responsive.scale(14),
    opacity: 0.8,
  },
  detailValue: {
    color: '#ffffff',
    fontSize: responsive.scale(16),
    fontWeight: '600',
  },
  forecastContainer: {
    marginTop: responsive.scale(20),
    padding: responsive.scale(15),
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: responsive.scale(15),
  },
  sectionTitle: {
    fontSize: responsive.scale(18),
    fontWeight: '600',
    marginBottom: responsive.scale(15),
    color: '#ffffff',
  },
  forecastCard: {
    padding: responsive.scale(15),
    borderRadius: responsive.scale(15),
    marginRight: responsive.scale(12),
    alignItems: 'center',
    width: responsive.width * 0.35,
    maxWidth: 150,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  forecastDay: {
    fontSize: responsive.scale(14),
    fontWeight: '500',
    marginBottom: responsive.scale(8),
  },
  forecastIcon: {
    width: responsive.scale(50),
    height: responsive.scale(50),
    marginVertical: responsive.scale(8),
  },
  forecastTemperature: {
    fontSize: responsive.scale(18),
    fontWeight: 'bold',
    marginVertical: responsive.scale(6),
  },
  forecastCondition: {
    fontSize: responsive.scale(12),
    textAlign: 'center',
  },
  errorText: {
    color: '#ffffff',
    fontSize: responsive.scale(16),
    textAlign: 'center',
    padding: responsive.scale(20),
  },
});