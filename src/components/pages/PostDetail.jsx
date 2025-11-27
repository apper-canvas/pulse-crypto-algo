import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import PostCard from "@/components/molecules/PostCard";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import ApperIcon from "@/components/ApperIcon";
import { postsService } from "@/services/api/postsService";
import { usersService } from "@/services/api/usersService";

const PostDetail = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (postId) {
      loadPost();
    }
  }, [postId]);

  const loadPost = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [postData, currentUserData] = await Promise.all([
        postsService.getById(parseInt(postId)),
        usersService.getCurrentUser()
      ]);
      
      setPost(postData);
      setCurrentUser(currentUserData);
    } catch (err) {
      setError(err.message || "Failed to load post");
    } finally {
      setLoading(false);
    }
  };

  const handleLikePost = async (postId, isLiked) => {
    console.log(`Post ${postId} ${isLiked ? "liked" : "unliked"}`);
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) return <Loading />;
  if (error) return <ErrorView error={error} onRetry={loadPost} />;

  return (
    <div className="max-w-2xl mx-auto p-4">
      {/* Back Button */}
      <motion.button
        onClick={handleBack}
        className="flex items-center space-x-2 text-gray-600 hover:text-primary mb-6 transition-colors"
        whileHover={{ x: -4 }}
      >
        <ApperIcon name="ArrowLeft" size={20} />
        <span className="font-body font-medium">Back</span>
      </motion.button>

      {/* Post */}
      {post && (
        <PostCard
          post={post}
          currentUser={currentUser}
          onLike={handleLikePost}
        />
      )}

      {/* Comments Section */}
      <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-display font-semibold text-gray-900 mb-4">
          Comments
        </h3>
        <div className="text-center py-8 text-gray-500 font-body">
          Comments feature coming soon...
        </div>
      </div>
    </div>
  );
};

export default PostDetail;