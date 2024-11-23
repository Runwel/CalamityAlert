import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  Modal,
  StyleSheet,
  ActivityIndicator
} from 'react-native';

export function NewsSection({ posts, loading }) {
  const [selectedArticle, setSelectedArticle] = useState(null);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0066cc" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.grid}>
          {posts.map((post) => (
            <TouchableOpacity
              key={post.id}
              style={styles.card}
              onPress={() => setSelectedArticle(post)}
            >
              {post.image && (
                <Image
                  source={{ uri: post.image }}
                  style={styles.image}
                  resizeMode="cover"
                />
              )}
              <View style={styles.cardContent}>
                <Text style={styles.title}>{post.title}</Text>
                <Text style={styles.meta}>{post.formattedDate}</Text>
                <Text style={styles.excerpt} numberOfLines={3}>
                  {post.content}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <Modal
        visible={selectedArticle !== null}
        animationType="slide"
        onRequestClose={() => setSelectedArticle(null)}
      >
        {selectedArticle && (
          <View style={styles.modalContainer}>
            <ScrollView>
              {selectedArticle.image && (
                <Image
                  source={{ uri: selectedArticle.image }}
                  style={styles.modalImage}
                  resizeMode="cover"
                />
              )}
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>{selectedArticle.title}</Text>
                <Text style={styles.modalMeta}>
                  {selectedArticle.formattedDate}
                </Text>
                <Text style={styles.modalText}>{selectedArticle.content}</Text>
              </View>
            </ScrollView>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setSelectedArticle(null)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        )}
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  grid: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  cardContent: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  meta: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  excerpt: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalImage: {
    width: '100%',
    height: 300,
  },
  modalContent: {
    padding: 16,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  modalMeta: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  modalText: {
    fontSize: 16,
    lineHeight: 24,
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 8,
    borderRadius: 20,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});