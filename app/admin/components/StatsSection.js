import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export function StatsSection({ usersCount, postCounts }) {
  return (
    <View style={styles.container}>
      <View style={styles.cardsContainer}>
        <View style={[styles.card, styles.cardFlex]}>
          <Text style={styles.title}>Users</Text>
          <Text style={styles.text}>Total Users: {usersCount.total}</Text>
          <Text style={styles.text}>Admin Users: {usersCount.admin}</Text>
        </View>
        
        <View style={[styles.card, styles.cardFlex]}>
          <Text style={styles.title}>Posts</Text>
          <Text style={styles.text}>News: {postCounts.news}</Text>
          <Text style={styles.text}>Alerts: {postCounts.alerts}</Text>
          <Text style={styles.text}>Hotline: {postCounts.hotline}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  cardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  card: {
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardFlex: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  text: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  }
});