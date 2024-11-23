import React from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';

const MANILA_REGIONS = [
  'all',
  'Tondo',
  'Binondo',
  'Quiapo',
  'Sampaloc',
  'Malate',
  'Ermita',
  'Paco',
  'Pandacan',
  'Santa Ana',
  'San Miguel',
  'San Andres',
  'Intramuros',
  'Santa Cruz',
  'Santa Mesa',
  'Port Area',
  'San Nicolas',
];

export function FilterModal({ visible, onClose, selectedRegion, onSelectRegion }) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Select Region</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.scrollView}>
            <View style={styles.regionsGrid}>
              <TouchableOpacity
                style={[
                  styles.regionButton,
                  selectedRegion === 'all' && styles.selectedRegion
                ]}
                onPress={() => {
                  onSelectRegion('all');
                  onClose();
                }}
              >
                <Text style={[
                  styles.regionText,
                  selectedRegion === 'all' && styles.selectedText
                ]}>
                  All Regions
                </Text>
              </TouchableOpacity>
              
              {MANILA_REGIONS.filter(region => region !== 'all').map((region) => (
                <TouchableOpacity
                  key={region}
                  style={[
                    styles.regionButton,
                    selectedRegion === region && styles.selectedRegion
                  ]}
                  onPress={() => {
                    onSelectRegion(region);
                    onClose();
                  }}
                >
                  <Text style={[
                    styles.regionText,
                    selectedRegion === region && styles.selectedText
                  ]}>
                    {region}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 20,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    fontSize: 24,
    color: '#666',
  },
  scrollView: {
    paddingHorizontal: 15,
  },
  regionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: 8,
  },
  regionButton: {
    backgroundColor: '#f5f5f5',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedRegion: {
    backgroundColor: '#0066cc',
    borderColor: '#0066cc',
  },
  regionText: {
    fontSize: 14,
    color: '#333',
  },
  selectedText: {
    color: 'white',
  },
});