import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { pickNewsImage, uploadNewsImage } from '../../../src/utils/newsImageUpload';
import { supabase } from '../../../src/api/SupabaseApi';

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

export function EditPostModal({ visible, onClose, onSave, post }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (post) {
      console.log('Loading post data:', post);
      setTitle(post.title || '');
      setContent(post.content || '');
      // Reset image state when loading a new post
      setImage(post.image || '');
      setSelectedImage(null);
    }
  }, [post]);

  const handleImagePick = async () => {
    try {
      setUploading(true);
      const imageAsset = await pickNewsImage();
      if (imageAsset) {
        console.log('New image selected:', imageAsset);
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

  const deleteOldImage = async (oldImageUrl) => {
    if (!oldImageUrl) return;
    try {
      console.log('Attempting to delete old image:', oldImageUrl);
      const path = oldImageUrl.split('news/')[1];
      if (path) {
        console.log('Deleting image with path:', path);
        const { error } = await supabase.storage
          .from('news')
          .remove([path]);
        if (error) {
          console.error('Error deleting old image:', error);
          throw error;
        }
        console.log('Old image deleted successfully');
      }
    } catch (error) {
      console.error('Error in deleteOldImage:', error);
      throw error;
    }
  };

  const handleSave = async () => {
    try {
      if (!validateForm()) {
        console.log('Form validation failed');
        return;
      }

      setUploading(true);
      let imageUrl = image;
      
      if (selectedImage) {
        if (post.image) {
          await deleteOldImage(post.image);
        }
        imageUrl = await uploadNewsImage(selectedImage);
        console.log('New image uploaded:', imageUrl);
      } else if (!image && post.image) {
        await deleteOldImage(post.image);
        imageUrl = '';
      }

      await onSave({
        ...post,
        title,
        content,
        ...(post.category === 'news' && { image: imageUrl })
      });
      onClose();
    } catch (error) {
      console.error('Error saving post:', error);
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
          <Text style={styles.modalTitle}>Edit Post</Text>
          
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
              numberOfLines={12}
              placeholder="Enter content"
            />
            {errors.content && <Text style={styles.errorText}>{errors.content}</Text>}
          </View>

          {post?.category === 'news' && (
            <View style={styles.inputContainer}>
              <TouchableOpacity 
                style={styles.imageButton}
                onPress={handleImagePick}
                disabled={uploading}
              >
                <Text style={styles.imageButtonText}>
                  {uploading ? 'Uploading...' : 'Change Image'}
                </Text>
              </TouchableOpacity>

              {(image || selectedImage) && (
                <ImagePreview 
                  uri={selectedImage ? selectedImage.uri : image}
                  onRemove={() => {
                    setSelectedImage(null);
                    setImage('');
                  }}
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
              onPress={handleSave}
              style={[styles.button, styles.saveButton]}
              disabled={uploading}
            >
              <Text style={[styles.buttonText, styles.saveButtonText]}>
                {uploading ? 'Saving...' : 'Save'}
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
    padding: 10,
    width: '90%',
    maxWidth: 500,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  inputContainer: {
    marginBottom: 10,
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
  saveButton: {
    backgroundColor: '#0066cc',
  },
  buttonText: {
    fontSize: 16,
  },
  saveButtonText: {
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