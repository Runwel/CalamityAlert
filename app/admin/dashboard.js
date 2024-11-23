import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { DashboardHeader } from './components/dashboard/DashboardHeader';
import { PostTabs } from './components/dashboard/PostTabs';
import { EditPostModal } from './components/dashboard/EditPostModal';
import { CreatePostModal } from './components/dashboard/CreatePostModal';
import { DeletePostModal } from './components/dashboard/DeletePostModal';
import { usePagination } from '../src/hooks/usePagination';
import { usePostHandlers } from '../src/hooks/usePostHandlers';
import { usePostData } from '../src/hooks/usePostData';
import { useRealtimeSubscription } from '../src/hooks/useRealtimeSubscription';

export default function Dashboard() {
  const [posts, setPosts] = useState([]);
  const [postCounts, setPostCounts] = useState({ news: 0, alert: 0, hotline: 0 });
  const [usersCount, setUsersCount] = useState({ total: 0, admin: 0 });
  const [editingPost, setEditingPost] = useState(null);
  const [deletingPost, setDeletingPost] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createPostType, setCreatePostType] = useState(null);
  const [activeTab, setActiveTab] = useState('news');

  const { handleEdit, handleCreatePost } = usePostHandlers(posts, setPosts);
  const { fetchPosts, fetchUserCounts } = usePostData(setPosts, setPostCounts, setUsersCount);

  useEffect(() => {
    console.log('Initializing dashboard data...');
    fetchPosts();
    fetchUserCounts();
  }, []);

  useRealtimeSubscription((payload) => {
    console.log('Handling realtime update:', payload);
    
    if (payload.eventType === 'INSERT') {
      console.log('Adding new post to state:', payload.new.id);
      setPosts(prev => [...prev, payload.new]);
      setPostCounts(prev => ({
        ...prev,
        [payload.new.category]: (prev[payload.new.category] || 0) + 1
      }));
    } 
    else if (payload.eventType === 'UPDATE') {
      console.log('Updating existing post in state:', payload.new.id);
      setPosts(prev => 
        prev.map(post => post.id === payload.new.id ? payload.new : post)
      );
    }
    else if (payload.eventType === 'DELETE') {
      console.log('Removing post from state:', payload.old.id);
      // Find the post's category before removing it
      const deletedPost = posts.find(post => post.id === payload.old.id);
      if (deletedPost) {
        console.log('Found post category for deletion:', deletedPost.category);
        setPosts(prev => prev.filter(post => post.id !== payload.old.id));
        setPostCounts(prev => {
          console.log('Current counts before deletion:', prev);
          const newCount = Math.max(0, (prev[deletedPost.category] || 0) - 1);
          console.log('New count for category', deletedPost.category, ':', newCount);
          return {
            ...prev,
            [deletedPost.category]: newCount
          };
        });
      }
    }
  }, 'posts');

  const groupedPosts = {
    news: posts.filter((post) => post.category === 'news'),
    alert: posts.filter((post) => post.category === 'alert'),
    hotline: posts.filter((post) => post.category === 'hotline'),
  };

  const newsPagination = usePagination(groupedPosts.news);
  const alertPagination = usePagination(groupedPosts.alert);
  const hotlinePagination = usePagination(groupedPosts.hotline);

  const handleCreateNewPost = (type) => {
    console.log('Creating new post of type:', type);
    setCreatePostType(type);
    setIsCreateModalOpen(true);
  };

  return (
    <ScrollView style={styles.container}>
      <DashboardHeader 
        usersCount={usersCount}
        postCounts={postCounts}
        onUserCountChange={setUsersCount}
        onPostCountChange={setPostCounts}
      />

      <PostTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        newsProps={{
          title: "News Posts",
          posts: newsPagination.currentItems,
          onEdit: setEditingPost,
          onDelete: setDeletingPost,
          onAdd: () => handleCreateNewPost('news'),
          pagination: {
            currentPage: newsPagination.currentPage,
            totalPages: newsPagination.totalPages,
            onNextPage: newsPagination.goToNextPage,
            onPrevPage: newsPagination.goToPreviousPage
          }
        }}
        alertsProps={{
          title: "Alerts",
          posts: alertPagination.currentItems,
          onEdit: setEditingPost,
          onDelete: setDeletingPost,
          onAdd: () => handleCreateNewPost('alert'),
          pagination: {
            currentPage: alertPagination.currentPage,
            totalPages: alertPagination.totalPages,
            onNextPage: alertPagination.goToNextPage,
            onPrevPage: alertPagination.goToPreviousPage
          }
        }}
        hotlineProps={{
          title: "Hotline",
          posts: hotlinePagination.currentItems,
          onEdit: setEditingPost,
          onDelete: setDeletingPost,
          onAdd: () => handleCreateNewPost('hotline'),
          pagination: {
            currentPage: hotlinePagination.currentPage,
            totalPages: hotlinePagination.totalPages,
            onNextPage: hotlinePagination.goToNextPage,
            onPrevPage: hotlinePagination.goToPreviousPage
          }
        }}
      />

      <EditPostModal
        visible={editingPost !== null}
        onClose={() => setEditingPost(null)}
        onSave={handleEdit}
        post={editingPost}
      />

      <DeletePostModal
        visible={deletingPost !== null}
        onClose={() => setDeletingPost(null)}
        onConfirm={() => setDeletingPost(null)}
        post={deletingPost}
      />

      <CreatePostModal
        visible={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={(data) => {
          console.log('Creating new post:', { ...data, category: createPostType });
          handleCreatePost({ ...data, category: createPostType });
          setIsCreateModalOpen(false);
        }}
        type={createPostType || 'news'}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F6F7FB',
  },
});