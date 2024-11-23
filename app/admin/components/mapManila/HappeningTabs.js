import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

export const HappeningTabs = ({ regions, selectedRegion, onRegionSelect, updateCounts }) => {
  console.log('Rendering HappeningTabs with:', { selectedRegion, updateCounts });
  
  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {regions.map((region) => (
          <TouchableOpacity
            key={region.id}
            style={[
              styles.tab,
              selectedRegion?.id === region.id && styles.selectedTab,
              updateCounts[region.name] > 0 && styles.hasUpdates
            ]}
            onPress={() => onRegionSelect(region)}
          >
            <View style={styles.tabContent}>
              <Text style={[
                styles.tabText,
                selectedRegion?.id === region.id && styles.selectedTabText
              ]}>
                {region.name}
              </Text>
              {updateCounts[region.name] > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {updateCounts[region.name]}
                  </Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f8f9fa',
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  scrollView: {
    flexGrow: 0,
  },
  scrollContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  tab: {
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderRadius: 25,
    marginRight: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  selectedTab: {
    backgroundColor: '#6E59A5',
    borderColor: '#6E59A5',
    transform: [{ scale: 1.05 }],
  },
  hasUpdates: {
    borderColor: '#4CAF50',
  },
  tabContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#495057',
  },
  selectedTabText: {
    color: '#fff',
  },
  badge: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});