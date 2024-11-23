export const calculatePostCounts = (posts, setPostCounts) => {
    const counts = { news: 0, alert: 0, hotline: 0 };
    posts.forEach((post) => {
      counts[post.category] = (counts[post.category] || 0) + 1;
    });
    setPostCounts(counts);
  };