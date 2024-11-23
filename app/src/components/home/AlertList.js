import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const MAX_CONTENT_LENGTH = 100;

export function AlertsList({ alerts, isDarkMode, onAlertPress, currentPage, totalPages, onNextPage, onPrevPage }) {
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const truncateContent = (content) => {
    if (content.length > MAX_CONTENT_LENGTH) {
      return content.substring(0, MAX_CONTENT_LENGTH) + '...';
    }
    return content;
  };

  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: isDarkMode ? '#ffffff' : '#0f172a' }]}>
        Emergency Alerts
      </Text>
      {alerts.map((alert) => (
        <TouchableOpacity 
          key={alert.id} 
          style={styles.alertCard}
          onPress={() => onAlertPress(alert)}
        >
          <Text style={[styles.alertTitle, { color: isDarkMode ? '#e2e8f0' : '#1e293b' }]}>
            {alert.title}
          </Text>
          <Text style={styles.dateTime}>
            {formatDateTime(alert.created_at)}
          </Text>
          <Text style={[styles.alertContent, { color: isDarkMode ? '#94a3b8' : '#64748b' }]}>
            {truncateContent(alert.content)}
          </Text>
        </TouchableOpacity>
      ))}
      
      {totalPages > 1 && (
        <View style={styles.pagination}>
          <TouchableOpacity 
            style={[styles.pageButton, currentPage === 1 && styles.pageButtonDisabled]}
            onPress={onPrevPage}
            disabled={currentPage === 1}
          >
            <Text style={styles.pageButtonText}>Previous</Text>
          </TouchableOpacity>
          
          <Text style={styles.pageInfo}>
            Page {currentPage} of {totalPages}
          </Text>
          
          <TouchableOpacity 
            style={[styles.pageButton, currentPage === totalPages && styles.pageButtonDisabled]}
            onPress={onNextPage}
            disabled={currentPage === totalPages}
          >
            <Text style={styles.pageButtonText}>Next</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    padding: 15,
    marginBottom: 20,
    borderRadius: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  alertCard: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  dateTime: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  alertContent: {
    fontSize: 14,
    lineHeight: 20,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
  },
  pageButton: {
    backgroundColor: '#0ea5e9',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  pageButtonDisabled: {
    backgroundColor: '#94a3b8',
    opacity: 0.5,
  },
  pageButtonText: {
    color: '#ffffff',
    fontWeight: '500',
  },
  pageInfo: {
    color: '#64748b',
    fontSize: 14,
  },
});