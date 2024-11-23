import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { ImageUpload } from '../../../src/utils/ImageUpload';
import { supabase } from '../../../src/api/SupabaseApi';
import * as FileSystem from 'expo-file-system';

const SUPABASE_URL = 'https://osdpvwtthelyqotmghew.supabase.co/storage/v1/object/public/happenings/';

export function EditHappeningModal({ visible, happening, onClose, onSave }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentImage, setCurrentImage] = useState('');
  const [errors, setErrors] = useState({});
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (happening) {
      setTitle(happening.title || '');
      setContent(happening.content || '');
      setCurrentImage(happening.image || '');
      setSelectedImage(null);
    }
  }, [happening]);

  const validateForm = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = 'Title is required';
    if (!content.trim()) newErrors.content = 'Content is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const uploadImage = async (imageData) => {
    try {
      const base64Data = await FileSystem.readAsStringAsync(imageData.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      
      const fileExt = imageData.uri.split('.').pop() || 'jpeg';
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(7);
      const fileName = `${timestamp}-${randomString}.${fileExt}`;

      console.log('Uploading image to Supabase:', fileName);
      
      const { error: uploadError } = await supabase.storage
        .from('happenings')
        .upload(fileName, decode(base64Data), {
          contentType: imageData.type,
          upsert: true
        });

      if (uploadError) throw uploadError;

      return `${SUPABASE_URL}${fileName}`;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  const deleteOldImage = async (oldImageUrl) => {
    if (!oldImageUrl) return;
    try {
      const path = oldImageUrl.replace(SUPABASE_URL, '');
      if (path) {
        const { error } = await supabase.storage
          .from('happenings')
          .remove([path]);
        if (error) throw error;
      }
    } catch (error) {
      console.error('Error deleting old image:', error);
      throw error;
    }
  };

  const handleSubmit = async () => {
    try {
      if (!validateForm()) return;

      setUploading(true);
      let finalImageUrl = currentImage;

      if (selectedImage) {
        if (happening.image) {
          await deleteOldImage(happening.image);
        }
        finalImageUrl = await uploadImage(selectedImage);
      } else if (!currentImage && happening.image) {
        await deleteOldImage(happening.image);
        finalImageUrl = '';
      }

      const updatedHappening = {
        ...happening,
        title,
        content,
        image: finalImageUrl,
        updated_at: new Date().toISOString()
      };

      await onSave(updatedHappening);
      onClose();
    } catch (error) {
      console.error('Error saving happening:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleImageSelected = (imageData) => {
    console.log('Image selected for preview:', imageData);
    setSelectedImage(imageData);
    if (imageData === null) {
      setCurrentImage('');
    }
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
          <Text style={styles.modalTitle}>Edit Happening</Text>
          
          <TextInput
            style={[styles.input, errors.title && styles.inputError]}
            placeholder="Title"
            value={title}
            onChangeText={(text) => {
              setTitle(text);
              setErrors(prev => ({ ...prev, title: '' }));
            }}
          />
          {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
          
          <TextInput
            style={[styles.input, styles.contentInput, errors.content && styles.inputError]}
            placeholder="Content"
            value={content}
            onChangeText={(text) => {
              setContent(text);
              setErrors(prev => ({ ...prev, content: '' }));
            }}
            multiline
          />
          {errors.content && <Text style={styles.errorText}>{errors.content}</Text>}
          
          <ImageUpload 
            onImageSelected={handleImageSelected}
            currentImage={currentImage}
          />
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.button, styles.submitButton]}
              onPress={handleSubmit}
              disabled={uploading}
            >
              <Text style={[styles.buttonText, styles.submitButtonText]}>
                {uploading ? 'Saving...' : 'Save Changes'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const decode = (base64) => {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    width: '90%',
    maxWidth: 500,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  contentInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 15,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginLeft: 10,
    minWidth: 80,
  },
  cancelButton: {
    backgroundColor: '#ddd',
  },
  submitButton: {
    backgroundColor: '#2196F3',
  },
  buttonText: {
    textAlign: 'center',
  },
  submitButtonText: {
    color: 'white',
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputError: {
    borderColor: '#ff4444',
  },
  errorText: {
    color: '#ff4444',
    fontSize: 12,
    marginTop: 4,
  },
  imageSection: {
    marginBottom: 15,
  },
  imageLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  }
});