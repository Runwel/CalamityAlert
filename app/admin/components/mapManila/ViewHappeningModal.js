import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import { supabase } from '../../../src/api/SupabaseApi';
import { EditHappeningModal } from './EditHappeningModal';
import Icon from 'react-native-vector-icons/Feather';

export function ViewHappeningModal({ visible, happening, onClose, onDelete }) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  console.log('ViewHappeningModal - happening:', happening);

  if (!happening) {
    console.log('ViewHappeningModal - No happening provided');
    return null;
  }

  const handleEdit = () => {
    console.log('Edit clicked for happening:', happening);
    setIsEditModalOpen(true);
  };

  const handleDelete = () => {
    console.log('Delete clicked for happening:', happening.id);
    onDelete?.(happening.id);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          
          <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.editButton]}
                  onPress={handleEdit}
                >
                  <Icon name="edit-2" size={20} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, styles.deleteButton]}
                  onPress={handleDelete}
                >
                  <Icon name="trash-2" size={20} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, styles.closeButtonTop]}
                  onPress={onClose}
                >
                  <Icon name="x" size={20} color="#666" />
                </TouchableOpacity>
              </View>
          <ScrollView>
            {happening.image && (
              <Image
                source={{ uri: happening.image }}
                style={styles.image}
                resizeMode="cover"
              />
            )}
            <Text style={styles.title}>{happening.title}</Text>

            <Text style={styles.region}>Region: {happening.region}</Text>
            
            <Text style={styles.date}>
              Posted: {new Date(happening.created_at).toLocaleDateString()}
            </Text>
            
            <Text style={styles.content}>{happening.content}</Text>
          </ScrollView>
        </View>
      </View>

      <EditHappeningModal
        visible={isEditModalOpen}
        happening={happening}
        onClose={() => setIsEditModalOpen(false)}
        onSave={async (updatedHappening) => {
          console.log('Saving updated happening:', updatedHappening);
          const { error } = await supabase
            .from('happenings')
            .update(updatedHappening)
            .eq('id', happening.id);
            
          if (error) {
            console.error('Error updating happening:', error);
          } else {
            setIsEditModalOpen(false);
            onClose();
          }
        }}
      />
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: '100%',
    maxHeight: '100%',
    position: 'relative',
  },
  closeButtonTop: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 10,
  },
  actionButtons: {
    flexDirection: 'row',
    top: -10,
    right: -240,
    gap: 3,
  },
  actionButton: {
    padding: 8,
    borderRadius: 6,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#FFA500',
  },
  deleteButton: {
    backgroundColor: '#FF4444',
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 12,
    marginBottom: 20,
  },
  region: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  date: {
    fontSize: 14,
    color: '#888',
    marginBottom: 20,
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    marginBottom: 30,
  },
});