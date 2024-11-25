import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
import { supabase } from '../src/api/SupabaseApi';
import { HappeningDetails } from '../src/components/maps/HappeningDetails';
import { RegionFilter } from '../src/components/maps/RegionFilter';
import { SearchBar } from '../src/components/maps/SearchBar';
import { useTheme } from '../src/context/ThemeContext';
import { responsive } from '../src/utils/responsive';

const MAX_CONTENT_LENGTH = 100;

export default function StatusScreen() {
  const { isDarkMode } = useTheme();
  const [happenings, setHappenings] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedHappening, setSelectedHappening] = useState(null);
  
  const windowWidth = Dimensions.get('window').width;
  const isTablet = windowWidth >= 768;

  const getCardWidth = () => {
    const padding = responsive.padding.small;
    const gap = responsive.padding.small;
    const columns = isTablet ? 2 : 1;
    return (windowWidth - (padding * 2) - (gap * (columns - 1))) / columns;
  };
  
  useEffect(() => {
    fetchHappenings();
    const subscription = setupRealtimeSubscription();
    return () => subscription();
  }, []);
  const fetchHappenings = async () => {
    const { data, error } = await supabase
      .from('happenings')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      console.error('Error fetching happenings:', error);
    } else {
      setHappenings(data || []);
    }
  };
  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('happenings_updates')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'happenings' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setHappenings(prev => [payload.new, ...prev]);
          }
        }
      )
      .subscribe();
    return () => supabase.removeChannel(channel);
  };
  const filteredHappenings = happenings.filter(happening => {
    const matchesRegion = selectedRegion === 'all' || happening.region === selectedRegion;
    const matchesSearch = happening.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         happening.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRegion && matchesSearch;
  });
  const truncateContent = (content) => {
    if (content.length > MAX_CONTENT_LENGTH) {
      return `${content.substring(0, MAX_CONTENT_LENGTH)}...`;
    }
    return content;
  };
  if (selectedHappening) {
    return (
      <HappeningDetails 
        happening={selectedHappening} 
        onClose={() => setSelectedHappening(null)}
        isDarkMode={isDarkMode}
      />
    );
  }

  return (
    <View style={[
      styles.container,
      { backgroundColor: isDarkMode ? '#1a1a1a' : '#fff' }
    ]}>
      <View style={styles.filterRow}>
        <View style={styles.searchContainer}>
          <SearchBar 
            value={searchQuery}
            onChangeText={setSearchQuery}
            isDarkMode={isDarkMode}
          />
        </View>
        <View style={styles.filterContainer}>
          <RegionFilter
            selectedRegion={selectedRegion}
            onSelectRegion={setSelectedRegion}
            isDarkMode={isDarkMode}
          />
        </View>
      </View>
      <ScrollView style={styles.happeningsList}>
        <View style={[
          styles.grid,
          { flexDirection: isTablet ? 'row' : 'column' }
        ]}>
          {filteredHappenings.map((happening) => {
            const formattedDateTime = new Date(happening.created_at).toLocaleString([], {
              year: 'numeric',
              month: 'numeric',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });
            
            return (
              <TouchableOpacity
                key={happening.id}
                style={[
                  styles.happeningCard,
                  { 
                    backgroundColor: isDarkMode ? '#1e293b' : '#fff',
                    width: getCardWidth(),
                    borderColor: isDarkMode ? '#334155' : '#e2e8f0',
                  }
                ]}
                onPress={() => setSelectedHappening(happening)}
              >
                <View style={[
                  styles.cardContent,
                  happening.image ? styles.cardWithImage : styles.cardWithoutImage
                ]}>
                  {happening.image && (
                    <Image 
                      source={{ uri: happening.image }} 
                      style={styles.imageAside}
                      resizeMode="cover"
                    />
                  )}
                  <View style={[
                    styles.textContent,
                    { flex: 1 }
                  ]}>
                    <Text style={[
                      styles.regionBadge,
                      { backgroundColor: isDarkMode ? '#334155' : '#e2e8f0' }
                    ]}>{happening.region}</Text>
                    <Text style={[
                      styles.title,
                      { color: isDarkMode ? '#e2e8f0' : '#000' }
                    ]}>{happening.title}</Text>
                    <Text style={[
                      styles.date,
                      { color: isDarkMode ? '#94a3b8' : '#64748b' }
                    ]}>
                      {formattedDateTime}
                    </Text>
                    <Text 
                      style={[
                        styles.preview,
                        { color: isDarkMode ? '#cbd5e1' : '#475569' }
                      ]} 
                      numberOfLines={3}
                    >
                      {truncateContent(happening.content)}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: responsive.padding.small,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: responsive.padding.small,
    marginBottom: responsive.padding.small,
  },
  searchContainer: {
    flex: 1,
  },
  filterContainer: {
    width: '40%',
  },
  happeningsList: {
    flex: 1,
  },
  grid: {
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  happeningCard: {
    borderRadius: 8,
    padding: responsive.padding.small,
    marginBottom: responsive.padding.small,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardContent: {
    gap: responsive.padding.medium,
  },
  cardWithImage: {
    flexDirection: 'row',
  },
  cardWithoutImage: {
    flexDirection: 'column',
  },
  imageAside: {
    width: 120,
    height: 150,
    borderRadius: 8,
  },
  textContent: {
    gap: responsive.padding.small,
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  time: {
    fontSize: responsive.fontSize.small,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  textContent: {
    gap: responsive.padding.small,
  },
  regionBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: responsive.padding.small,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: responsive.fontSize.small,
  },
  title: {
    fontSize: responsive.fontSize.large,
    fontWeight: 'bold',
  },
  date: {
    fontSize: responsive.fontSize.small,
  },
  preview: {
    fontSize: responsive.fontSize.medium,
    lineHeight: 20,
  },
});