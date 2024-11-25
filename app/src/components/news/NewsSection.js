import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  Modal,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { responsive } from '../../utils/responsive';

export function NewsSection({ posts, loading, isDarkMode }) {
  const [selectedArticle, setSelectedArticle] = useState(null);
  const windowWidth = Dimensions.get('window').width;
  const isTablet = windowWidth >= 768;

  const getCardWidth = () => {
    const padding = responsive.padding.small;
    const gap = responsive.padding.small;
    const columns = isTablet ? 2 : 1;
    return (windowWidth - (padding * 2) - (gap * (columns - 1))) / columns;
  };

  if (loading) {
    return (
      <View style={[
        styles.loadingContainer,
        { backgroundColor: isDarkMode ? '#1a1a1a' : '#fff' }
      ]}>
        <ActivityIndicator size="large" color={isDarkMode ? '#60a5fa' : '#0066cc'} />
      </View>
    );
  }

  const renderCard = (post) => {
    const hasImage = !!post.image;
    const formattedDateTime = new Date(post.created_at).toLocaleString([], {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    if (!hasImage) {
      return (
        <LinearGradient
          colors={isDarkMode ? ['#1e293b', '#334155'] : ['#f8fafc', '#f1f5f9']}
          style={[styles.textOnlyCard, { width: getCardWidth() }]}
        >
          <View style={styles.cardContent}>     
            <Text style={[
              styles.title,
              { color: isDarkMode ? '#e2e8f0' : '#000' }
            ]}>{post.title}</Text>
            <Text style={[
              styles.meta,
              { color: isDarkMode ? '#94a3b8' : '#64748b' }
            ]}>{formattedDateTime}</Text>
            <Text style={[
              styles.excerpt,
              { color: isDarkMode ? '#cbd5e1' : '#475569' }
            ]} numberOfLines={3}>
              {post.content}
            </Text>
          </View>
        </LinearGradient>
      );
    }

    return (
      <View style={[
        styles.card,
        {
          backgroundColor: isDarkMode ? '#1e293b' : '#fff',
          width: getCardWidth(),
          borderColor: isDarkMode ? '#334155' : '#e2e8f0',
        }
      ]}>
        <View style={styles.cardWithImage}>
          <Image
            source={{ uri: post.image }}
            style={styles.imageAside}
            resizeMode="cover"
          />
          <View style={[styles.textContent]}>
            <Text style={[
              styles.title,
              { color: isDarkMode ? '#e2e8f0' : '#000' }
            ]}>{post.title}</Text>
            <Text style={[
              styles.meta,
              { color: isDarkMode ? '#94a3b8' : '#64748b' }
            ]}>{formattedDateTime}</Text>
            <Text style={[
              styles.excerpt,
              { color: isDarkMode ? '#cbd5e1' : '#475569' }
            ]} numberOfLines={3}>
              {post.content}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={[
      styles.container,
      { backgroundColor: isDarkMode ? '#1a1a1a' : '#fff' }
    ]}>
      <ScrollView>
        <View style={[
          styles.grid,
          { flexDirection: isTablet ? 'row' : 'column' }
        ]}>
          {posts.map((post) => (
            <TouchableOpacity
              key={post.id}
              onPress={() => setSelectedArticle(post)}
            >
              {renderCard(post)}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <Modal
        visible={selectedArticle !== null}
        animationType="slide"
        onRequestClose={() => setSelectedArticle(null)}
      >
        {selectedArticle && (
          <View style={[
            styles.modalContainer,
            { backgroundColor: isDarkMode ? '#1a1a1a' : '#fff' }
          ]}>
            <ScrollView>
              {selectedArticle.image && (
                <Image
                  source={{ uri: selectedArticle.image }}
                  style={styles.modalImage}
                  resizeMode="contain"
                />
              )}
              <View style={styles.modalContent}>
                <Text style={[
                  styles.modalTitle,
                  { color: isDarkMode ? '#e2e8f0' : '#000' }
                ]}>{selectedArticle.title}</Text>
                <Text style={[
                  styles.modalMeta,
                  { color: isDarkMode ? '#94a3b8' : '#666' }
                ]}>{new Date(selectedArticle.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</Text>
                <Text style={[
                  styles.modalText,
                  { color: isDarkMode ? '#cbd5e1' : '#000' }
                ]}>{selectedArticle.content}</Text>
              </View>
            </ScrollView>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setSelectedArticle(null)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        )}
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: responsive.padding.small,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  grid: {
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  card: {
    borderRadius: 8,
    padding: responsive.padding.small,
    marginBottom: responsive.padding.small,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    overflow: 'hidden',
  },
  textOnlyCard: {
    borderRadius: 8,
    padding: responsive.padding.small,
    marginBottom: responsive.padding.small,
  },
  cardContent: {
    gap: responsive.padding.small,
    padding: responsive.padding.small,
  },
  cardWithImage: {
    flexDirection: 'row',
  },
  imageAside: {
    width: 120,
    height: 120,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  textContent: {
    flex: 1,
    padding: responsive.padding.small,
    gap: responsive.padding.xsmall || 4,
  },
  title: {
    fontSize: responsive.fontSize.large,
    fontWeight: 'bold',
  },
  meta: {
    fontSize: responsive.fontSize.small,
  },
  excerpt: {
    fontSize: responsive.fontSize.medium,
    lineHeight: 20,
  },
  modalContainer: {
    flex: 1,
  },
  modalImage: {
    width: '100%', // Fills the modal's width
    height: undefined, // Allow height to adjust based on aspect ratio
    aspectRatio: 1, // Set this based on your image's aspect ratio (e.g., 16/9 = 1.78)
  },
  modalContent: {
    padding: 16,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  modalMeta: {
    fontSize: 14,
    marginBottom: 16,
  },
  modalText: {
    fontSize: 16,
    lineHeight: 24,
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 8,
    borderRadius: 20,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});