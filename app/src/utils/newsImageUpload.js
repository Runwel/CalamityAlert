import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { supabase } from '../api/SupabaseApi';

const SUPABASE_URL = 'https://osdpvwtthelyqotmghew.supabase.co/storage/v1/object/public/news/';

export const pickNewsImage = async () => {
  try {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      console.error('Permission to access media library was denied');
      return null;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      console.log('News image selected:', result.assets[0]);
      return result.assets[0];
    }
    return null;
  } catch (error) {
    console.error('Error picking news image:', error);
    throw error;
  }
};

export const uploadNewsImage = async (imageAsset) => {
  try {
    console.log('Starting news image upload...', imageAsset);

    const base64Data = await FileSystem.readAsStringAsync(imageAsset.uri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const fileExt = imageAsset.uri.split('.').pop() || 'jpeg';
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(7);
    const fileName = `${timestamp}-${randomString}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('news')
      .upload(fileName, decode(base64Data), {
        contentType: `image/${fileExt}`,
        upsert: true
      });

    if (uploadError) {
      console.error('Supabase upload error:', uploadError);
      throw uploadError;
    }

    const imageUrl = `${SUPABASE_URL}${fileName}`;
    console.log('News image upload successful, URL:', imageUrl);
    return imageUrl;
  } catch (error) {
    console.error('Error in uploadNewsImage:', error);
    throw error;
  }
};

const decode = (base64) => {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};