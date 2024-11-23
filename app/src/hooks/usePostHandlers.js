import { supabase } from '../api/SupabaseApi';
export const usePostHandlers = (posts, setPosts) => {
  const handleEdit = async (updatedPost) => {
    const { error } = await supabase
      .from('posts')
      .update({
        title: updatedPost.title,
        content: updatedPost.content,
        ...(updatedPost.category === 'news' && { image: updatedPost.image })
      })
      .eq('id', updatedPost.id);
    if (error) {
      console.error('Error updating post:', error);
    } else {
      setPosts(posts.map(post => 
        post.id === updatedPost.id ? { ...post, ...updatedPost } : post
      ));
    }
  };
  const handleCreatePost = async (data) => {
    const { error } = await supabase
      .from('posts')
      .insert([{ ...data }]);
    if (error) {
      console.error('Error creating post:', error);
    }
  };
  return { handleEdit, handleCreatePost };
};