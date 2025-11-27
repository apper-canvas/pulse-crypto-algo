import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PostCard from "@/components/molecules/PostCard";
import PostComposer from "@/components/molecules/PostComposer";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { postsService } from "@/services/api/postsService";
import { usersService } from "@/services/api/usersService";

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showComposer, setShowComposer] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [postsData, currentUserData] = await Promise.all([
        postsService.getAll(),
        usersService.getCurrentUser()
      ]);
      
      setPosts(postsData);
      setCurrentUser(currentUserData);
    } catch (err) {
      setError(err.message || "Failed to load feed");
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (postData) => {
    const newPost = await postsService.create({
      content: postData.content,
      mediaUrl: postData.mediaPreview,
      mediaType: postData.mediaFile ? 
        (postData.mediaFile.type.startsWith("image/") ? "image" : "video") : 
        null,
      authorId: currentUser.Id,
      privacy: "public"
    });

    setPosts(prevPosts => [newPost, ...prevPosts]);
    setShowComposer(false);
  };

  const handleLikePost = async (postId, isLiked) => {
    // Optimistic update handled in PostCard
    console.log(`Post ${postId} ${isLiked ? "liked" : "unliked"}`);
  };

  if (loading) return <Loading />;
  if (error) return <ErrorView error={error} onRetry={loadData} />;

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      {/* Create Post */}
      <div className="space-y-4">
        {!showComposer ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
          >
            <button
              onClick={() => setShowComposer(true)}
              className="w-full flex items-center space-x-4 text-left group"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center group-hover:scale-105 transition-transform">
                <ApperIcon name="Plus" size={20} className="text-primary" />
              </div>
              <div className="flex-1">
                <div className="text-lg font-display font-semibold text-gray-900 group-hover:text-primary transition-colors">
                  Share a moment
                </div>
                <div className="text-gray-600 font-body">
                  What's happening in your world?
                </div>
              </div>
            </button>
          </motion.div>
        ) : (
          <PostComposer
            user={currentUser}
            onPost={handleCreatePost}
            onClose={() => setShowComposer(false)}
          />
        )}
      </div>

      {/* Posts Feed */}
      <AnimatePresence>
        {posts.length === 0 ? (
          <Empty
            icon="Users"
            title="Your feed is empty"
            description="Start following people to see their posts in your feed, or create your first post to get the conversation started."
            actionText="Create Post"
            onAction={() => setShowComposer(true)}
          />
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <PostCard
                key={post.Id}
                post={post}
                currentUser={currentUser}
                onLike={handleLikePost}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Floating Action Button - Mobile Only */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowComposer(true)}
        className="lg:hidden fixed bottom-20 right-6 w-14 h-14 bg-gradient-coral text-white rounded-full shadow-lg flex items-center justify-center z-40"
      >
        <ApperIcon name="Plus" size={24} />
      </motion.button>
    </div>
  );
};

export default Feed;