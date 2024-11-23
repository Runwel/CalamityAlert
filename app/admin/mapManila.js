import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { supabase } from '../src/api/SupabaseApi';
import { CreateHappeningModal } from './components/mapManila/CreateHappeningModal';
import { ViewHappeningModal } from './components/mapManila/ViewHappeningModal';
import { HappeningTabs } from './components/mapManila/HappeningTabs';
import { HappeningCard } from './components/mapManila/HappeningCard';
import {HappeningHistory} from './components/mapManila/HappeningHistory';
const MANILA_REGIONS = [
  { id: 1, name: 'Tondo' },
  { id: 2, name: 'Binondo' },
  { id: 3, name: 'Quiapo' },
  { id: 4, name: 'Sampaloc' },
  { id: 5, name: 'Malate' },
  { id: 6, name: 'Ermita' },
  { id: 7, name: 'Paco' },
  { id: 8, name: 'Pandacan' },
  { id: 9, name: 'Santa Ana' },
  { id: 10, name: 'San Miguel' },
  { id: 11, name: 'San Andres' },
  { id: 12, name: 'Intramuros' },
  { id: 13, name: 'Santa Cruz' },
  { id: 14, name: 'Santa Mesa' },
  { id: 15, name: 'Port Area' },
  { id: 16, name: 'San Nicolas' },
];

const RegionPosts = () => {
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedHappening, setSelectedHappening] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [happenings, setHappenings] = useState([]);
  const [updateCounts, setUpdateCounts] = useState({});

  useEffect(() => {
    console.log('Initializing RegionPosts');
    fetchHappenings();
    const cleanup = setupRealtimeSubscription();
    return cleanup;
  }, [selectedRegion]);

  const setupRealtimeSubscription = () => {
    console.log('Setting up realtime subscription');
    const channel = supabase
      .channel('happenings_channel')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'happenings' },
        (payload) => {
          console.log('Realtime update received:', payload);
          handleRealtimeUpdate(payload);
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up subscription');
      supabase.removeChannel(channel);
    };
  };

  const handleRealtimeUpdate = (payload) => {
    const { eventType, new: newRecord, old: oldRecord } = payload;
    
    switch (eventType) {
      case 'INSERT':
        setHappenings(prev => [newRecord, ...prev]);
        updateCount(newRecord.region, 1);
        break;
      case 'DELETE':
        setHappenings(prev => prev.filter(h => h.id !== oldRecord.id));
        updateCount(oldRecord.region, -1);
        break;
      case 'UPDATE':
        setHappenings(prev => 
          prev.map(h => h.id === newRecord.id ? newRecord : h)
        );
        break;
    }
  };

  const updateCount = (region, change) => {
    setUpdateCounts(prev => ({
      ...prev,
      [region]: Math.max(0, (prev[region] || 0) + change)
    }));
  };

  const fetchHappenings = async () => {
    console.log('Fetching happenings');
    try {
      const query = supabase
        .from('happenings')
        .select('*')
        .order('created_at', { ascending: false });

      if (selectedRegion) {
        query.eq('region', selectedRegion.name);
      }

      const { data, error } = await query;
      if (error) throw error;

      console.log(`Fetched ${data?.length} happenings`);
      setHappenings(data || []);
      
      const counts = {};
      data?.forEach(happening => {
        counts[happening.region] = (counts[happening.region] || 0) + 1;
      });
      setUpdateCounts(counts);
    } catch (error) {
      console.error('Error fetching happenings:', error);
    }
  };

  const handleCreateHappening = async (data) => {
    console.log('Creating new happening');
    try {
      const { error } = await supabase
        .from('happenings')
        .insert([{
          ...data,
          region: selectedRegion.name
        }]);

      if (error) throw error;
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error('Error creating happening:', error);
    }
  };

  const handleEditHappening = async (happening) => {
    console.log('Editing happening:', happening.id);
    setSelectedHappening(happening);
    setIsViewModalOpen(true);
  };

  const handleDeleteHappening = async (id) => {
    console.log('Deleting happening:', id);
    try {
      const { error } = await supabase
        .from('happenings')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting happening:', error);
    }
  };

  const handleHistorySelect = (happening) => {
    setSelectedHappening(happening);
    setIsViewModalOpen(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Manila Happenings</Text>
        <Text style={styles.headerSubtitle}>
          {selectedRegion ? `Viewing ${selectedRegion.name}` : 'Select a region to view happenings'}
        </Text>
      </View>

      <HappeningTabs
        regions={MANILA_REGIONS}
        selectedRegion={selectedRegion}
        onRegionSelect={setSelectedRegion}
        updateCounts={updateCounts}
      />

      <View style={styles.content}>
        <View style={styles.contentHeader}>
          <Text style={styles.contentTitle}>
            {selectedRegion ? `${selectedRegion.name} Happenings` : 'Recent Happenings'}
          </Text>
          {selectedRegion && (
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => setIsCreateModalOpen(true)}
            >
              <Text style={styles.addButtonText}>+ Add New</Text>
            </TouchableOpacity>
          )}
        </View>

        <ScrollView style={styles.happeningsList}>
          {happenings.map((happening) => (
            <HappeningCard
              key={happening.id}
              happening={happening}
              onPress={(happening) => {
                setSelectedHappening(happening);
                setIsViewModalOpen(true);
              }}
              onEdit={handleEditHappening}
              onDelete={handleDeleteHappening}
            />
          ))}
        </ScrollView>

        <HappeningHistory onHappeningSelect={handleHistorySelect} />
      </View>

      <CreateHappeningModal
        visible={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateHappening}
      />

      <ViewHappeningModal
        visible={isViewModalOpen}
        happening={selectedHappening}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedHappening(null);
        }}
        onEdit={handleEditHappening}
        onDelete={handleDeleteHappening}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    padding: 15,
    paddingTop: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  contentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  contentTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  addButton: {
    backgroundColor: '#0066cc',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  happeningsList: {
    flex: 1,
  },
});

export default RegionPosts;