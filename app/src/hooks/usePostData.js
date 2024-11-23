import { supabase } from '../api/SupabaseApi';
import { calculatePostCounts } from './usePostUtils';
export const usePostData = (setPosts, setPostCounts, setUsersCount) => {
  const fetchPosts = async () => {
    const { data, error } = await supabase.from('posts').select('*');
    if (error) {
      console.error('Error fetching posts:', error);
    } else {
      setPosts(data);
      calculatePostCounts(data, setPostCounts);
    }
  };
  const fetchUserCounts = async () => {
    const { data, error } = await supabase.from('users').select('role');
    if (error) {
      console.error('Error fetching user counts:', error);
    } else {
      const counts = { total: data.length, admin: 0 };
      data.forEach((user) => {
        if (user.role === 'admin') {
          counts.admin += 1;
        }
      });
      setUsersCount(counts);
    }
  };
  return { fetchPosts, fetchUserCounts };
};