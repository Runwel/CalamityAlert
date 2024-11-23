import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Image, Text, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export const ImageUpload = ({ onImageSelected, currentImage }) => {
  const [previewUri, setPreviewUri] = useState(null);

  useEffect(() => {
    if (currentImage) {
      setPreviewUri(currentImage);
    }
  }, [currentImage]);

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        console.error('Permission to access media library was denied');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        console.log('Image selected for preview:', result.assets[0]);
        const imageAsset = result.assets[0];
        setPreviewUri(imageAsset.uri);
        
        // Pass the image data to parent without uploading
        onImageSelected({
          uri: imageAsset.uri,
          type: `image/${imageAsset.uri.split('.').pop() || 'jpeg'}`,
          preview: imageAsset.uri,
        });
      }
    } catch (error) {
      console.error('Error picking image:', error);
      onImageSelected(null);
    }
  };

  const handleRemoveImage = () => {
    console.log('Removing image preview...');
    setPreviewUri(null);
    onImageSelected(null);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.uploadButton} 
        onPress={pickImage}
      >
        <Text style={styles.uploadButtonText}>Choose Image</Text>
      </TouchableOpacity>

      {previewUri && (
        <View style={styles.previewContainer}>
          <Image 
            source={{ uri: previewUri }}
            style={styles.previewImage}
            resizeMode="cover"
          />
          <TouchableOpacity 
            style={styles.removeButton}
            onPress={handleRemoveImage}
          >
            <Text style={styles.removeButtonText}>Remove Image</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  uploadButton: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  uploadButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  previewContainer: {
    marginTop: 10,
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
  },
  removeButton: {
    backgroundColor: '#ff4444',
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#fff',
  },
});