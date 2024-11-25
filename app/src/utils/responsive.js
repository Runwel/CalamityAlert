import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const responsive = {
  width,
  height,
  scale: (size) => Math.min(size * (width / 400), size * 1.2),
  isSmallDevice: width < 375,
  isMediumDevice: width >= 375 && width < 768,
  isLargeDevice: width >= 768,
  fontSize: {
    small: Math.min(12 * (width / 400), 14),
    medium: Math.min(14 * (width / 400), 16),
    large: Math.min(16 * (width / 400), 18),
    xlarge: Math.min(20 * (width / 400), 24),
  },
  padding: {
    small: Math.min(8 * (width / 400), 10),
    medium: Math.min(16 * (width / 400), 20),
    large: Math.min(24 * (width / 400), 30),
  }
};