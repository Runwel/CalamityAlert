import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { supabase } from '../../../src/api/SupabaseApi';

export function DeletePostModal({ visible, onClose, onConfirm, post }) {
  console.log('Rendering DeletePostModal for post:', post?.id);
  
  const handleDelete = async () => {
    try {
      console.log('Deleting post:', post?.id);
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', post.id);

      if (error) {
        console.error('Error deleting post:', error);
        return;
      }
      
      console.log('Post deleted successfully:', post?.id);
      onConfirm(post);
    } catch (error) {
      console.error('Error in delete operation:', error);
    }
  };
  
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Delete Post</Text>
          <Text style={styles.modalText}>
            Are you sure you want to delete this post?
          </Text>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              onPress={onClose}
              style={[styles.button, styles.cancelButton]}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={handleDelete}
              style={[styles.button, styles.deleteButton]}
            >
              <Text style={[styles.buttonText, styles.deleteButtonText]}>
                Delete
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    width: '90%',
    maxWidth: 500,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    color: '#666',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    marginLeft: 10,
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
  },
  deleteButton: {
    backgroundColor: '#dc2626',
  },
  buttonText: {
    fontSize: 16,
  },
  deleteButtonText: {
    color: '#fff',
  },
});