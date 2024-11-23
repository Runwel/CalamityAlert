import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { pickNewsImage, uploadNewsImage } from '../../../src/utils/newsImageUpload';

function ImageUploadButton({ onPress, uploading }) {
  return (
    <TouchableOpacity 
      style={styles.imageButton}
      onPress={onPress}
      disabled={uploading}
    >
      <Text style={styles.imageButtonText}>
        {uploading ? 'Uploading...' : 'Upload Image (Optional)'}
      </Text>
    </TouchableOpacity>
  );
}

function ImagePreview({ uri, onRemove }) {
  return (
    <View style={styles.imagePreviewContainer}>
      <Image 
        source={{ uri }}
        style={styles.imagePreview}
        resizeMode="cover"
      />
      <TouchableOpacity 
        style={styles.removeImageButton}
        onPress={onRemove}
      >
        <Text style={styles.removeImageText}>Remove Image</Text>
      </TouchableOpacity>
    </View>
  );
}

export function CreatePostModal({ visible, onClose, onSubmit, type }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleImagePick = async () => {
    try {
      setUploading(true);
      const imageAsset = await pickNewsImage();
      if (imageAsset) {
        console.log('Image selected:', imageAsset);
        setSelectedImage(imageAsset);
      }
    } catch (error) {
      console.error('Error selecting image:', error);
    } finally {
      setUploading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!content.trim()) {
      newErrors.content = 'Content is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    try {
      if (!validateForm()) {
        console.log('Form validation failed');
        return;
      }

      console.log('Submitting post with type:', type);
      let imageUrl = '';
      
      if (selectedImage) {
        setUploading(true);
        imageUrl = await uploadNewsImage(selectedImage);
      }

      const postData = {
        title,
        content,
        category: type,
        ...(type === 'news' && { image: imageUrl })
      };
      
      console.log('Post data being submitted:', postData);
      await onSubmit(postData);
      
      setTitle('');
      setContent('');
      setSelectedImage(null);
      setErrors({});
      onClose();
    } catch (error) {
      console.error('Error submitting post:', error);
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
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>
            Create New {type.charAt(0).toUpperCase() + type.slice(1)} Post
          </Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Title *</Text>
            <TextInput
              style={[styles.input, errors.title && styles.inputError]}
              value={title}
              onChangeText={(text) => {
                setTitle(text);
                setErrors(prev => ({ ...prev, title: '' }));
              }}
              placeholder="Enter title"
            />
            {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Content *</Text>
            <TextInput
              style={[styles.input, styles.contentInput, errors.content && styles.inputError]}
              value={content}
              onChangeText={(text) => {
                setContent(text);
                setErrors(prev => ({ ...prev, content: '' }));
              }}
              multiline
              numberOfLines={10}
              placeholder="Enter content"
            />
            {errors.content && <Text style={styles.errorText}>{errors.content}</Text>}
          </View>

          {type === 'news' && (
            <View style={styles.inputContainer}>
              <ImageUploadButton 
                onPress={handleImagePick}
                uploading={uploading}
              />
              {selectedImage && (
                <ImagePreview 
                  uri={selectedImage.uri}
                  onRemove={() => setSelectedImage(null)}
                />
              )}
            </View>
          )}

          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              onPress={onClose}
              style={[styles.button, styles.cancelButton]}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={handleSubmit}
              style={[styles.button, styles.submitButton]}
              disabled={uploading}
            >
              <Text style={[styles.buttonText, styles.submitButtonText]}>
                {uploading ? 'Creating...' : 'Create Post'}
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
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 10,
  },
  contentInput: {
    minHeight: 200,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
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
  submitButton: {
    backgroundColor: '#0066cc',
  },
  buttonText: {
    fontSize: 16,
  },
  submitButtonText: {
    color: '#fff',
  },
  imageButton: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  imageButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  imagePreviewContainer: {
    marginTop: 10,
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
  },
  removeImageButton: {
    backgroundColor: '#ff4444',
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  removeImageText: {
    color: '#fff',
  },
  inputError: {
    borderColor: '#ff4444',
  },
  errorText: {
    color: '#ff4444',
    fontSize: 12,
    marginTop: 4,
  },
});