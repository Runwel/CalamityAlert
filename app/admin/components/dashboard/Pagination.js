import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export function Pagination({ currentPage, totalPages, onNextPage, onPrevPage }) {
  if (totalPages <= 1) return null;
  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={[styles.button, currentPage === 1 && styles.buttonDisabled]}
        onPress={onPrevPage}
        disabled={currentPage === 1}
      >
        <Text style={styles.buttonText}>Previous</Text>
      </TouchableOpacity>
      
      <Text style={styles.pageInfo}>
        Page {currentPage} of {totalPages}
      </Text>
      
      <TouchableOpacity 
        style={[styles.button, currentPage === totalPages && styles.buttonDisabled]}
        onPress={onNextPage}
        disabled={currentPage === totalPages}
      >
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#0066cc',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  buttonDisabled: {
    backgroundColor: '#cccccc',
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '500',
  },
  pageInfo: {
    color: '#666',
    fontSize: 14,
  },
});