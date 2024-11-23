import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, FlatList, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { Pagination } from './Pagination';
import { PostDetailModal } from './PostDetailModal';

const MAX_CONTENT_LENGTH = 150;

export function PostList({ title, posts, onEdit, onDelete, onAdd, pagination, searchPlaceholder }) {
  const [selectedPost, setSelectedPost] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const truncateContent = (content, category) => {
    if (category === 'news' && content.length > MAX_CONTENT_LENGTH) {
      return `${content.substring(0, MAX_CONTENT_LENGTH)}...`;
    }
    return content;
  };

  const handlePostPress = (post) => {
    console.log('Opening post details:', post.id);
    setSelectedPost(post);
  };

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderPost = ({ item: post }) => (
    <TouchableOpacity
      key={post.id}
      style={styles.postCard}
      onPress={() => handlePostPress(post)}
    >
      {post.category === 'news' && post.image && (
        <Image 
          source={{ uri: post.image }} 
          style={styles.postImage}
          resizeMode="cover"
        />
      )}
      <View style={[styles.postContent, post.category === 'news' && post.image && styles.postContentWithImage]}>
        <Text style={styles.postTitle}>{post.title}</Text>
        <Text style={styles.dateTime}>
          {new Date(post.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </Text>
        <Text style={styles.postText}>
          {truncateContent(post.content, post.category)}
        </Text>
      </View>
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={(e) => {
            e.stopPropagation();
            onDelete(post);
          }}
        >
          <Icon name="trash-2" size={20} color="#dc2626" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={(e) => {
            e.stopPropagation();
            onEdit(post);
          }}
        >
          <Icon name="edit-2" size={20} color="#666" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <TouchableOpacity onPress={onAdd}>
          <Icon name="plus-circle" size={24} color="#0066cc" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder={searchPlaceholder || "Search posts..."}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      
      <FlatList
        data={filteredPosts}
        renderItem={renderPost}
        keyExtractor={(post) => post.id.toString()}
        scrollEnabled={false}
      />

      {pagination && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onNextPage={pagination.onNextPage}
          onPrevPage={pagination.onPrevPage}
        />
      )}

      <PostDetailModal
        post={selectedPost}
        visible={selectedPost !== null}
        onClose={() => setSelectedPost(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  postsList: {
    gap: 10,
  },
  postCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    elevation: 3,
    marginBottom: 10,
  },
  postContent: {
    flex: 1,
  },
  postContentWithImage: {
    marginLeft: 15,
  },
  postTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  postText: {
    color: '#666',
  },
  postImage: {
    width: 120,
    height: 120,
    borderRadius: 4,
  },
  actionButtons: {
    flexDirection: 'column',
    justifyContent: 'center',
    gap: 12,
  },
  actionButton: {
    padding: 4,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
    paddingHorizontal: 10,
  },
  pageButton: {
    backgroundColor: '#0066cc',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  pageButtonDisabled: {
    backgroundColor: '#cccccc',
    opacity: 0.5,
  },
  pageButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
  pageInfo: {
    color: '#666',
    fontSize: 14,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
});