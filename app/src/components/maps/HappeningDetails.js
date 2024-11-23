import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image } from 'react-native';
export function HappeningDetails({ happening, onClose }) {
  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <Text style={styles.region}>{happening.region}</Text>
        <Text style={styles.title}>{happening.title}</Text>
        <Text style={styles.date}>
          {new Date(happening.created_at).toLocaleDateString()}
        </Text>
        
        {happening.image && (
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: happening.image }}
              style={styles.image}
              resizeMode="contain"
            />
          </View>
        )}
        
        <Text style={styles.description}>{happening.content}</Text>
      </ScrollView>
      
      <TouchableOpacity
        style={styles.closeButton}
        onPress={onClose}
      >
        <Text style={styles.closeButtonText}>Back to List</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  region: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  date: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 16,
  },
  imageContainer: {
    width: '100%',
    height: 400,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#334155',
  },
  closeButton: {
    backgroundColor: '#0ea5e9',
    padding: 16,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});