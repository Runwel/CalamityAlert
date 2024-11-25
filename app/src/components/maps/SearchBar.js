import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

export function SearchBar({ value, onChangeText }) {
  return (
    <TextInput
      style={styles.input}
      placeholder="Search happenings..."
      value={value}
      onChangeText={onChangeText}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    height: 50,
  },
});