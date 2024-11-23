import React from 'react';
import { Modal, View, Text, ScrollView, TouchableOpacity, StyleSheet, Image } from 'react-native';

export function PostDetailModal({ post, visible, onClose }) {
  if (!post) return null;
  
  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <ScrollView>
          {post.image && (
            <Image
              source={{ uri: post.image }}
              style={styles.modalImage}
              resizeMode="cover"
            />
          )}
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{post.title}</Text>
            <Text style={styles.dateTime}>
              {new Date(post.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </Text>
            <Text style={styles.modalText}>{post.content}</Text>
          </View>
        </ScrollView>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={onClose}
        >
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
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