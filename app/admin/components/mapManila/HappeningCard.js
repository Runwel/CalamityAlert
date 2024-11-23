import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
export const HappeningCard = ({ happening, onPress, onEdit, onDelete }) => {
    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    };
  
    return (
      <TouchableOpacity style={styles.card} onPress={() => onPress(happening)}>
        <View style={styles.header}>
          <Text style={styles.title}>{happening.title}</Text>
          <View style={styles.actions}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.editButton]}
              onPress={() => onEdit(happening)}
            >
              <Text style={styles.actionButtonText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionButton, styles.deleteButton]}
              onPress={() => onDelete(happening.id)}
            >
              <Text style={styles.actionButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Text style={styles.date}>{formatDate(happening.created_at)}</Text>
        <Text numberOfLines={2} style={styles.preview}>
          {happening.content}
        </Text>
      </TouchableOpacity>
    );
  };
  
  const styles = StyleSheet.create({
    card: {
      backgroundColor: '#fff',
      padding: 16,
      borderRadius: 12,
      marginBottom: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
      flex: 1,
      marginRight: 8,
    },
    actions: {
      flexDirection: 'row',
      gap: 8,
    },
    actionButton: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 6,
    },
    editButton: {
      backgroundColor: '#0066cc',
    },
    deleteButton: {
      backgroundColor: '#ff4444',
    },
    actionButtonText: {
      color: '#fff',
      fontSize: 12,
      fontWeight: '500',
    },
    date: {
      fontSize: 12,
      color: '#666',
      marginBottom: 8,
    },
    preview: {
      fontSize: 14,
      color: '#333',
      lineHeight: 20,
    },
  });