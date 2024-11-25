import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, StyleSheet, ActivityIndicator, Image, TouchableOpacity  } from 'react-native';
import { useTheme } from '../src/context/ThemeContext';
import WeatherApi from '../src/api/WeatherApi';
import { supabase } from '../src/api/SupabaseApi'
import { LinearGradient } from 'expo-linear-gradient';
import AlertModal from '../src/components/AlertModal';
import { responsive } from '../src/utils/responsive';
import { WeatherSection } from '../src/components/home/WeatherSection';
import { AlertsList } from '../src/components/home/AlertList';

const ALERTS_PER_PAGE = 5;

export default function Home() {
  const { isDarkMode } = useTheme();
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alerts, setAlerts] = useState([]);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const [weatherData, forecastData] = await Promise.all([
          WeatherApi.getCurrentWeather(),
          WeatherApi.getForecast()
        ]);
        setWeather(weatherData);
        setForecast({ forecast: { forecastday: forecastData } });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    const fetchAlerts = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('category', 'alert')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching alerts:', error);
      } else {
        setAlerts(data || []);
      }
    };

    fetchWeatherData();
    fetchAlerts();

    const subscription = supabase
      .channel('public:posts')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'posts',
          filter: 'category=eq.alerts'
        }, 
        (payload) => {
          setAlerts(current => [payload.new, ...current]);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleAlertPress = (alert) => {
    setSelectedAlert(alert);
    setModalVisible(true);
  };

  const totalPages = Math.ceil(alerts.length / ALERTS_PER_PAGE);
  const startIndex = (currentPage - 1) * ALERTS_PER_PAGE;
  const paginatedAlerts = alerts.slice(startIndex, startIndex + ALERTS_PER_PAGE);

  if (loading) {
    return (
      <LinearGradient
        colors={isDarkMode ? ['#1e293b', '#0f172a'] : ['#f0f9ff', '#e0f2fe']}
        style={styles.container}
      >
        <ActivityIndicator size="large" color={isDarkMode ? '#0EA5E9' : '#0284c7'} />
      </LinearGradient>
    );
  }

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: isDarkMode ? '#0f172a' : '#f0f9ff' }]}
      contentContainerStyle={styles.contentContainer}
    >
      <WeatherSection weather={{ ...weather, ...forecast }} isDarkMode={isDarkMode} />
      
      <AlertsList 
        alerts={paginatedAlerts}
        isDarkMode={isDarkMode}
        onAlertPress={handleAlertPress}
        currentPage={currentPage}
        totalPages={totalPages}
        onNextPage={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
        onPrevPage={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
      />

      <AlertModal
        visible={modalVisible}
        alert={selectedAlert}
        onClose={() => {
          setModalVisible(false);
          setSelectedAlert(null);
        }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingVertical: responsive.scale(15),
  },
});