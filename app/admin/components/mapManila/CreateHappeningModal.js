import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { ImageUpload } from '../../../src/utils/ImageUpload';
import { supabase } from '../../../src/api/SupabaseApi';

const SUPABASE_URL = 'https://osdpvwtthelyqotmghew.supabase.co/storage/v1/object/public/happenings/';

export function CreateHappeningModal({ visible, onClose, onSubmit }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imagePath, setImagePath] = useState('');
  const [uploading, setUploading] = useState(false);

  const uploadImage = async (imageUri) => {
    try {
      console.log('Starting image upload process for:', imageUri);
      
      // Read the file as base64
      const base64Data = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      
      // Generate unique filename
      const fileExt = imageUri.split('.').pop() || 'jpeg';
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(7);
      const fileName = `${timestamp}-${randomString}.${fileExt}`;
      
      console.log('Uploading image to Supabase with filename:', fileName);

      // Upload to Supabase
      const { error: uploadError } = await supabase.storage
        .from('happenings')
        .upload(fileName, decode(base64Data), {
          contentType: `image/${fileExt}`,
          upsert: true
        });

      if (uploadError) throw uploadError;

      console.log('Image uploaded successfully');
      return `${SUPABASE_URL}${fileName}`;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  const handleImageSelected = async (imageData) => {
    try {
      console.log('Image selected:', imageData);
      const imageUri = typeof imageData === 'string' ? imageData : imageData?.uri || '';
      setImagePath(imageUri);
    } catch (error) {
      console.error('Error handling image selection:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      setUploading(true);
      console.log('Starting submission with image path:', imagePath);
      
      let finalImageUrl = '';
      if (imagePath) {
        finalImageUrl = await uploadImage(imagePath);
        console.log('Final image URL:', finalImageUrl);
      }
      
      await onSubmit({ 
        title, 
        content, 
        image: finalImageUrl
      });
      
      setTitle('');
      setContent('');
      setImagePath('');
    } catch (error) {
      console.error('Error in handleSubmit:', error);
    } finally {
      setUploading(false);
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
          <Text style={styles.modalTitle}>Add New Happening</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Title"
            value={title}
            onChangeText={setTitle}
          />
          
          <TextInput
            style={[styles.input, styles.contentInput]}
            placeholder="Content"
            value={content}
            onChangeText={setContent}
            multiline
          />
          
          <ImageUpload 
            onImageSelected={handleImageSelected}
            currentImage={imagePath}
          />
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
              disabled={uploading}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.button, styles.submitButton]}
              onPress={handleSubmit}
              disabled={uploading}
            >
              <Text style={[styles.buttonText, styles.submitButtonText]}>
                {uploading ? 'Uploading...' : 'Submit'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

// Helper function to decode base64
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
  imagePreviewContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  previewText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  imagePreview: {
    width: 200,
    height: 200,
    resizeMode: 'cover',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
});
