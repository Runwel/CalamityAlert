import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FilterModal } from './FilterModal';

export function RegionFilter({ selectedRegion, onSelectRegion }) {
  const [isModalVisible, setIsModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.button}
        onPress={() => setIsModalVisible(true)}
      >
        <Text style={styles.buttonText}>
          {selectedRegion === 'all' ? 'All Regions' : selectedRegion}
        </Text>
      </TouchableOpacity>

      <FilterModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        selectedRegion={selectedRegion}
        onSelectRegion={onSelectRegion}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  button: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 14,
    color: '#333',
  },
});