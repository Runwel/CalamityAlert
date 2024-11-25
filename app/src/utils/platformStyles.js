import { Platform } from 'react-native';

export const platformStyles = {
  // Spacing
  padding: {
    base: Platform.select({
      ios: 20,
      android: 16,
    }),
    small: Platform.select({
      ios: 15,
      android: 12,
    }),
  },
  
  // Border radius
  borderRadius: {
    large: Platform.select({
      ios: 15,
      android: 12,
    }),
    medium: Platform.select({
      ios: 12,
      android: 10,
    }),
    small: Platform.select({
      ios: 8,
      android: 6,
    }),
  },
  
  // Shadows
  shadow: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
    android: {
      elevation: 4,
    },
  }),
  
  // Font sizes
  fontSize: {
    large: Platform.select({
      ios: 20,
      android: 18,
    }),
    medium: Platform.select({
      ios: 16,
      android: 14,
    }),
    small: Platform.select({
      ios: 14,
      android: 12,
    }),
  },
  
  // Margins
  margin: {
    base: Platform.select({
      ios: 20,
      android: 16,
    }),
    small: Platform.select({
      ios: 10,
      android: 8,
    }),
  },
  
  // Component specific dimensions
  dimensions: {
    weatherIcon: Platform.select({
      ios: 60,
      android: 50,
    }),
    cardWidth: Platform.select({
      ios: 120,
      android: 110,
    }),
  },
};

export const getScreenWidth = (width) => Platform.select({
  ios: width - 40,
  android: width - 32,
});
