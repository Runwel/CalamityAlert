import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { supabase } from '../src/api/SupabaseApi';
import { HappeningDetails } from '../src/components/maps/HappeningDetails';
import { RegionFilter } from '../src/components/maps/RegionFilter';
import { SearchBar } from '../src/components/maps/SearchBar';

const MAX_CONTENT_LENGTH = 150;

export default function StatusScreen() {
  const [happenings, setHappenings] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedHappening, setSelectedHappening] = useState(null);
  
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
      />
    );
  }
  return (
    <View style={styles.container}>
      <View style={styles.filterRow}>
        <View style={styles.searchContainer}>
          <SearchBar 
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <View style={styles.filterContainer}>
          <RegionFilter
            selectedRegion={selectedRegion}
            onSelectRegion={setSelectedRegion}
          />
        </View>
      </View>
      <ScrollView style={styles.happeningsList}>
        {filteredHappenings.map((happening) => (
          <TouchableOpacity
            key={happening.id}
            style={styles.happeningCard}
            onPress={() => setSelectedHappening(happening)}
          >
            <View style={styles.cardContent}>
              {happening.image && (
                <View style={styles.imageContainer}>
                  <Image 
                    source={{ uri: happening.image }} 
                    style={styles.image}
                    resizeMode="cover"
                  />
                </View>
              )}
              <View style={styles.textContent}>
                <Text style={styles.regionBadge}>{happening.region}</Text>
                <Text style={styles.title}>{happening.title}</Text>
                <Text style={styles.date}>
                  {new Date(happening.created_at).toLocaleDateString()}
                </Text>
                <Text style={styles.preview} numberOfLines={2}>
                  {truncateContent(happening.content)}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
    paddingTop: 50,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
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
  happeningCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardContent: {
    flexDirection: 'row',
    gap: 15,
  },
  imageContainer: {
    width: 200,
    height: 200,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  textContent: {
    flex: 1,
  },
  regionBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#e2e8f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 8,
  },
  preview: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
  },
});